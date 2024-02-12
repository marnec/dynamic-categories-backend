import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { provideCustomRepository } from 'src/shared/provider/provide-custom-repository';
import { Item } from './entities/item.entity';
import { ItemRepository } from './item.repository';
import { ItemCategory } from './entities/item-category.entity';
import { ItemCategoryRepository } from './item-category.repository';
import { ItemProperty } from './entities/item-property.entity';
import { ItemPropertyRepository } from './item-property.repository';

@Module({
  providers: [
    ItemService,
    provideCustomRepository(Item, ItemRepository),
    provideCustomRepository(ItemCategory, ItemCategoryRepository),
    provideCustomRepository(ItemProperty, ItemPropertyRepository)
  ],
  controllers: [ItemController],
  exports: [ItemService]
})
export class ItemModule {}
