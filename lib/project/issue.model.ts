import { Field, ObjectType, Float } from '@nestjs/graphql'
import { IssuePriority } from './issuePriority.model'
import { IssueType  } from './issueType.model'
import { IssueStatus } from './issueStatus.model'

@ObjectType()
export class Issue {
  @Field()
  id: string

  @Field(() => Float)
  storyPoints: number

  @Field(() => IssueStatus)
  status: IssueStatus

  @Field(() => IssuePriority)
  priority: IssuePriority

  @Field(() => IssueType )
  type: IssueType

  @Field(() => [String])
  labels: string[]

  @Field(() => [Issue])
  subtasks: Issue[]

  @Field(() => Issue , { nullable: true})
  parent: Issue | null

  @Field()
  summary: string

  @Field()
  description: string

  @Field()
  key: string
}
