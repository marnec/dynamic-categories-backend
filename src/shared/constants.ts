import { Pageable } from './dto/base-paginated-filter.dto';

export const unPaged: Pageable = {
  order: null,
  skip: null,
  take: null
};
