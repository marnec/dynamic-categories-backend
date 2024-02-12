import { Repository } from 'typeorm';
import { ItemCategory } from './entities/item-category.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemCategoryRepository extends Repository<ItemCategory> {}
