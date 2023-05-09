import { Injectable } from '@nestjs/common'
import { JiraService } from '../jira/client.service'

type JiraProject = {
  id: string
  name: string
  key: string
}

@Injectable()
export class ProjectService {
  constructor(private readonly jira: JiraService) {}

  async getProjects(
    { limit }: { limit: number } = { limit: 100 },
  ): Promise<JiraProject[]> {
    const { values } = await this.jira.get<{ values: JiraProject[] }>(
      'project/search',
    )

    return values.slice(0, limit)
  }

  async getProject(key: string): Promise<JiraProject | null> {
    const projects = await this.getProjects()

    return projects.find((project) => project.key === key) ?? null
  }
}
