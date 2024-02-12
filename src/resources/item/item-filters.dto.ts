import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';

export class ItemPropertyFilterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  value: string | number | { max: number; min: number } | string[];
}

export class ItemFiltersDto {
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => ItemPropertyFilterDto)
  properties: ItemPropertyFilterDto[];
}
