import { BadRequestException, Logger, Type } from '@nestjs/common';
import { omit, pick } from 'radash';

import { BasePaginatedFilterDto, Pageable } from '../dto/base-paginated-filter.dto';

export function FilteredPaginatedQuery<E>(entity: Type<E>): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const className = target?.name || target?.constructor?.name;
    const logger = new Logger(className);
    const targetMethod = descriptor.value;
    const methodDescriptor = descriptor;
    methodDescriptor.value = function (...args: any[]) {
      let dto = args[0] as BasePaginatedFilterDto;
      if (!(dto?.constructor?.prototype instanceof BasePaginatedFilterDto)) {
        throw new BadRequestException(
          'The first argument of a @FilteredPaginatedQuery decorated method must extend BasePaginatedFilterDto'
        );
      }

      const { page, size, sort } = pick(dto, ['page', 'size', 'sort']);
      dto = omit(dto, ['page', 'size', 'sort']) as BasePaginatedFilterDto;

      const pageable = new Pageable({ page, size, sort });
      return targetMethod.call(this, ...args, pageable);
    };
    return methodDescriptor;
  };
}
