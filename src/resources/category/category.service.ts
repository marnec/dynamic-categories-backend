import { Injectable } from '@nestjs/common';
import { group } from 'radash';
import { Transactional } from 'typeorm-transactional';
import { ItemProperty } from '../item/entities/item-property.entity';
import { ItemCategoryRepository } from '../item/item-category.repository';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './create-category.dto';
import { Category } from './entities/category.entity';
import { Property } from './entities/property.entity';
import { PropertyRepository } from './property.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly propertyRepository: PropertyRepository,
    private readonly itemCategoryRepository: ItemCategoryRepository
  ) {}

  async getAll(): Promise<Category[]> {
    const categories = await this.categoryRepository.find({ relations: { properties: true } });

    const itemCategories = await this.itemCategoryRepository
      .createQueryBuilder('ic')
      .distinctOn([`ip.metadata->'value'`])
      .leftJoinAndMapMany('ic.properties', ItemProperty, 'ip', 'ip.itemCategory = ic.id')
      .where('ip.type = :type', { type: Property.types.freeChoice })
      .getMany();
      
    if (!itemCategories.length) {
      return categories;
    }

    const groupedItemProperties = group(
      itemCategories.flatMap((c) =>
        c.properties.map((p) => ({ ...p, itemCategory: { id: c.templateCategory } }))
      ),
      (p) => `${p.itemCategory.id}-${p.name}`
    );

    for (const category of categories) {
      for (const property of category.properties) {
        const key = `${category.id}-${property.name}`;
        const itemProperties = groupedItemProperties[key];

        // this means that a category with a free-choice property exists
        // but it does not have any item associated
        if (!itemProperties) {
          continue;
        }

        property.metadata.choices = itemProperties.map(({ metadata }) => metadata.value as string);
      }
    }

    return categories;
  }

  @Transactional()
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, properties } = createCategoryDto;

    const category = await this.categoryRepository.save(this.categoryRepository.create({ name }));

    this.propertyRepository.save(
      properties.map((p) => this.propertyRepository.create({ ...p, category }))
    );

    return category;
  }
}
