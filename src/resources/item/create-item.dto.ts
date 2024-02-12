import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsObject,
  ValidateNested
} from 'class-validator';
import { Metadata } from './entities/item-property.entity';
import { Property, PropertyTypes } from '../category/entities/property.entity';
import { PropertyType } from 'typeorm';

export class CreateItemPropertiesDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(Property.types)
  type: PropertyTypes;

  metadata: Metadata;
}

export class CreateItemCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  templateCategory: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateItemPropertiesDto)
  properties: CreateItemPropertiesDto[];
}

export class CreateItemDto {
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => CreateItemCategoryDto)
  @IsObject()
  category: CreateItemCategoryDto;
}
