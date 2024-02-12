import { Injectable } from '@nestjs/common';
import { objectify } from 'radash';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { CreateItemDto } from './create-item.dto';
import { ItemCategory } from './entities/item-category.entity';
import { ItemProperty } from './entities/item-property.entity';
import { Item } from './entities/item.entity';
import { ItemCategoryRepository } from './item-category.repository';
import { ItemFiltersDto } from './item-filters.dto';
import { ItemPropertyRepository } from './item-property.repository';
import { ItemRepository } from './item.repository';
import intersect from 'fast_array_intersect';
import { Property } from '../category/entities/property.entity';

@Injectable()
export class ItemService {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly itemCategoryRepository: ItemCategoryRepository,
    private readonly itemPropertyRepository: ItemPropertyRepository
  ) {}

  async find(filters: ItemFiltersDto): Promise<Item[]> {
    const { category, properties } = filters;

    const propertiesToFilter = await this.itemPropertyRepository.find({
      where: {
        name: In(properties.map((p) => p.name)),
        itemCategory: { templateCategory: category }
      }
    });

    const propertyByName = objectify(propertiesToFilter, (p) => p.name);
    const queries = [];

    const baseQuery = this.itemRepository
      .createQueryBuilder('items')
      .select('items.id')
      .leftJoinAndSelect(ItemCategory, 'ic', 'ic.id = items.category')
      .leftJoinAndSelect(ItemProperty, 'ip', 'ip.item-category = ic.id')
      .where('ic.templateCategory = :category', { category });

    if (!properties.length) {
      queries.push(baseQuery);
    }

    for (const { name, value } of properties) {
      const query = baseQuery.clone();

      const itemProperty = propertyByName[name];

      if (!itemProperty) {
        continue;
      }

      const { type } = itemProperty;

      query.andWhere(`ip.name = :name`, { name: name });

      switch (type) {
        case Property.types.string:
          query.andWhere(`(ip.metadata->>'value')::text LIKE :value`, { value: `%${value}%` });
          break;

        case Property.types.boolean:
          query.andWhere(`(ip.metadata->>'value')::boolean = :value`, { value });
          break;

        case Property.types.number:
          const { min, max } = value as { min: number; max: number };

          if (typeof value === Property.types.number) {
            query.andWhere(`(ip.metadata->>'value')::numeric = :value`, { value });
          } else {
            if (min !== undefined && min !== null) {
              query.andWhere(`(ip.metadata->>'value')::numeric >= :min`, { min });
            }
            if (max !== undefined && max !== null) {
              query.andWhere(`(ip.metadata->>'value')::numeric <= :max`, { max });
            }
          }
          break;

        case Property.types.constrainedChoice:
        case Property.types.freeChoice:
          query.andWhere(`(ip.metadata->>'value')::text IN (:...value)`, { value });
          break;

        default:
          break;
      }
      queries.push(query);
    }

    const nestedUnionResults: Item[][] = await Promise.all(queries.map((query) => query.getMany()));
    const ids = intersect(nestedUnionResults.map((r) => r.map(({ id }) => id)));

    if (!ids.length) {
      return [];
    }

    // we will hit the ~65k parameters limit
    return this.itemRepository.find({
      where: { id: In(ids) },
      relations: { category: { properties: true } }
    });
  }

  @Transactional()
  async createItem(createItemDto: CreateItemDto) {
    const category = await this.itemCategoryRepository.save(
      this.itemCategoryRepository.create({
        name: createItemDto.category.name,
        templateCategory: createItemDto.category.templateCategory,
        inSync: true
      })
    );

    await this.itemRepository.save(
      this.itemRepository.create({ name: createItemDto.name, category })
    );

    await this.itemPropertyRepository.save(
      createItemDto.category.properties.map(({ metadata, name, type }) =>
        this.itemPropertyRepository.create({ metadata, itemCategory: category, name, type })
      )
    );
  }
}
