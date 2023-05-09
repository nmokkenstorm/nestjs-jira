import { Field, InputType } from '@nestjs/graphql'
import { PaginationFilter } from '../base/pagination.input'

@InputType()
export class IssueFilter extends PaginationFilter {
  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  status?: string

  @Field({ nullable: true })
  priority?: string

  @Field({ nullable: true })
  label?: string
}
