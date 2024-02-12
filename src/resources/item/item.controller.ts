import { Body, Controller, Post, Put, Query } from '@nestjs/common';
import { CreateItemDto } from './create-item.dto';
import { Item } from './entities/item.entity';
import { ItemFiltersDto } from './item-filters.dto';
import { ItemService } from './item.service';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Put()
  async find(@Body() filters: ItemFiltersDto): Promise<Item[]> {
    return this.itemService.find(filters);
  }

  @Post()
  async createItem(@Body() createItemDto: CreateItemDto) {
    return this.itemService.createItem(createItemDto);
  }
}
