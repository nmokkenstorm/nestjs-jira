import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class IssueType {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  iconUrl: string

  @Field()
  description: string 
}
