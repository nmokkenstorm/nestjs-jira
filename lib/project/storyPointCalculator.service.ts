import { Injectable, Inject } from '@nestjs/common'
import { JiraIssueDetails } from './issue.service'
import { envPointFields } from './tokens'

@Injectable()
export class StoryPointCalculator {
  constructor(
    @Inject(envPointFields) private readonly storyPointFields: string[],
  ) {}

  public getScore({ fields }: JiraIssueDetails): number {
    return (
      this.getPoints(fields) ||
      fields.subtasks
        ?.map(({ fields }) => fields)
        ?.map(this.getPoints)
        ?.reduce((a: number, b: number) => a + b, 0) ||
      0
    )
  }

  private getPoints = (fields: JiraIssueDetails['fields']): number =>
    Number(
      Object.entries(fields)
        .filter(([key]) => this.storyPointFields.includes(key))
        .map(([_, value]) => value || 0)
        .filter((value) => !!value)[0] ?? 0,
    )
}
