import { Min, Max } from 'class-validator'
import { Int, Field, InputType } from '@nestjs/graphql'

export const defaultPaginationLimit: number = 100
export const defaultPagination: PaginationFilter = {
  limit: defaultPaginationLimit,
}

@InputType()
export class PaginationFilter {
  @Field(() => Int)
  @Min(1)
  @Max(250)
  limit: number = defaultPaginationLimit
}
