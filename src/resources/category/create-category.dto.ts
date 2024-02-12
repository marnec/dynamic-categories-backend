import { ArrayMinSize, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreatePropertyDto } from './create-property.dto';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreatePropertyDto)
  properties: CreatePropertyDto[];
}
