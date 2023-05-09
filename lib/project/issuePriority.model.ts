import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class IssuePriority {
  @Field()
  id: string

  @Field()
  name: string

  @Field()
  iconUrl: string
}
