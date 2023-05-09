import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Project {
  @Field()
  id: string
 
  @Field()
  key: string

  @Field()
  name: string
}
