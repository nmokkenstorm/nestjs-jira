import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class IssueStatus {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  description: string 
}
