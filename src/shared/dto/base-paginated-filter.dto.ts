import { Transform, Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';

export class SortObject {
  [field: string]: 'ASC' | 'DESC';
}

export class Pageable {
  constructor(basePaginatedFilterDto: BasePaginatedFilterDto) {
    this.take = basePaginatedFilterDto.size;
    this.skip = basePaginatedFilterDto.page * basePaginatedFilterDto.size;
    this.order = basePaginatedFilterDto.sort;
  }

  take: number;
  skip: number;
  order: SortObject;
}

export class BasePaginatedFilterDto {
  @IsNumber()
  page: number;

  @IsNumber()
  size: number;

  @Transform(({ value }) => {
    const [field, direction] = value.split(',') as string;
    return { [field]: direction.toUpperCase() } as SortObject;
  })
  @ValidateNested()
  @Type(() => SortObject)
  sort?: SortObject;
}
