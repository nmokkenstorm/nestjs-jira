import { InputType } from '@nestjs/graphql'
import { PaginationFilter } from '../base/pagination.input'

@InputType()
export class ProjectFilter extends PaginationFilter {}
