import { SortOrder } from '../const';
import { PaginationInput } from '../inputs/page.input';

export class PaginationDto {
  take: number;
  order: SortOrder;
  page: number;

  constructor(take: number, page: number, order: SortOrder) {
    this.take = take;
    this.order = order;
    this.page = page;
  }

  get skip() {
    return (this.page - 1) * this.take;
  }

  static fromInput(input: PaginationInput): PaginationDto {
    return new PaginationDto(input.take, input.page, input.order);
  }
}
