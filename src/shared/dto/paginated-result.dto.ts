export class PaginatedResult<T> {
    constructor(content: T[], totalElements: number) {
        this.content = content;
        this.totalElements = totalElements;
    }

    content: T[]
    totalElements: number;
    totalPages?: number;
  }