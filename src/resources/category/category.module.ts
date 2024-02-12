import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { provideCustomRepository } from 'src/shared/provider/provide-custom-repository';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './category.repository';
import { Property } from './entities/property.entity';
import { PropertyRepository } from './property.repository';
import { ItemModule } from '../item/item.module';
import { ItemCategory } from '../item/entities/item-category.entity';
import { ItemCategoryRepository } from '../item/item-category.repository';

@Module({
  providers: [
    CategoryService,
    provideCustomRepository(Category, CategoryRepository),
    provideCustomRepository(Property, PropertyRepository),
    provideCustomRepository(ItemCategory, ItemCategoryRepository)
  ],
  controllers: [CategoryController]
})
export class CategoryModule {}
