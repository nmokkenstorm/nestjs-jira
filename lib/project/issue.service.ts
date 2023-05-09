import { Injectable } from '@nestjs/common'
import { Issue } from './issue.model'
import { JiraService } from '../jira/client.service'
import { defaultPagination } from '../base/pagination.input'
import { IssueFilter } from './issueFilter.input'
import { StoryPointCalculator } from './storyPointCalculator.service'

type JiraProject = {
  id: string
  name: string
  key: string
}

type Description = {
  type: string
  content: Record<string, string>[]
}

type StatusCategory = {
  id: number
  name: string
  key: string
  colorName: string
}

type Status = {
  id: string
  name: string
  description: string
  statusCategory: StatusCategory
}

type IssueType = {
  id: string
  description: string
  iconUrl: string
  name: string
}

type Priority = {
  iconUrl: string
  id: string
  name: string
}

const defaultCategory: StatusCategory = {
  id: 0,
  key: '',
  colorName: 'red',
  name: 'none',
}

const defaultStatus: Status = {
  description: '',
  id: '',
  name: '',
  statusCategory: defaultCategory,
}

const defaultType: IssueType = {
  iconUrl: '',
  description: '',
  id: '',
  name: '',
}

const defaultPriority: Priority = {
  iconUrl: '',
  id: '',
  name: '',
}

export type JiraIssueDetails = {
  id: string
  key: string
  fields: Record<string, unknown> &
    Partial<{
      parent: JiraIssueDetails
      subtasks: JiraIssueDetails[]
      issuetype: IssueType
      summary: string
      labels: string[]
      priority: Priority
      status: Status
      description: Description
    }>
}

type Result = { issues: JiraIssueDetails[]; total: number; startAt: number }

type QueryArgs = {
  key: string
  maxResults?: number
  startAt?: number
}

@Injectable()
export class IssueService {
  constructor(
    private readonly jira: JiraService,
    private readonly pointCalculator: StoryPointCalculator
  ) {}

  async countForProject({ key }: JiraProject): Promise<number> {
    return (await this.fetchResponse({ key, maxResults: 1 }))?.total
  }

  async forProject(
    { key }: JiraProject,
    { limit, type, status, priority, label }: IssueFilter = defaultPagination
  ): Promise<Issue[]> {
    let startAt = 0
    let result: JiraIssueDetails[] = []
    let response: Result | null = null

    do {
      response = await this.fetchResponse({ key, maxResults: limit, startAt })
      result = result.concat(response?.issues ?? [])
      startAt = startAt + (response?.issues?.length ?? 0)
    } while (response === null || response?.issues?.length)

    return result
      .map(this.mapResults)
      .filter((item) => !type || item.type.name === type)
      .filter((item) => !status || item.status.name === status)
      .filter((item) => !priority || item.priority.name === priority)
      .filter((item) => !label || (item.labels ?? []).includes(label))
      .slice(0, limit)
  }

  private fetchResponse = ({
    key,
    maxResults = 50,
    startAt = 0,
  }: QueryArgs): Promise<Result> =>
    this.jira.get<Result>('search', {
      jql: `project='${key}'`,
      maxResults,
      startAt,
    })

  private mapResults = (issue: JiraIssueDetails): Issue => {
    const {
      id,
      key,
      fields: {
        parent,
        subtasks,
        summary,
        status,
        labels = [],
        issuetype,
        priority,
      },
    } = issue

    return {
      id,
      key,
      parent: parent ? this.mapResults(parent) : null,
      subtasks: (subtasks ?? []).map(this.mapResults),
      summary: summary ?? 'untitled issue',
      storyPoints: this.pointCalculator.getScore(issue),
      status: status ?? defaultStatus,
      labels,
      priority: priority ?? defaultPriority,
      type: issuetype ?? defaultType,
      description: 'no description yet',
    }
  }
}
