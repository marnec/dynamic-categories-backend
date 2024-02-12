import { IsEnum, IsNotEmpty, IsObject } from 'class-validator';
import { Property, PropertyTypes } from './entities/property.entity';
import { Metadata } from '../item/entities/item-property.entity';

export class CreatePropertyDto {
  @IsNotEmpty()
  name: string;

  @IsEnum(Property.types)
  type: PropertyTypes;

  @IsObject()
  metadata: Omit<Metadata, 'value' | 'type'>;
}
