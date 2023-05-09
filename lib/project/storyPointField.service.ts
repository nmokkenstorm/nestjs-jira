import { Injectable } from '@nestjs/common'
import { JiraService } from '../jira/client.service'

type Field = { id: string; key: string; name: string }

@Injectable()
export class StoryPointFieldService {
  constructor(private readonly jira: JiraService) {}

  getStoryPointFields = async (): Promise<string[]> =>
    (await this.jira.get<Field[]>('field'))
      .filter(this.isStoryPointField)
      .map(({ key }) => key)

  private isStoryPointField = ({ name }: Field): boolean =>
    !!name.match(new RegExp('story', 'i'))?.length
}
