import { Injectable } from '@nestjs/common'
import { JiraService } from '../jira/client.service'

type JiraUser = {
  displayName: string
  accountId: string
  avatarUrls: {
    ['48x48']: string
  }
}

@Injectable()
export class UserService {
  constructor(private readonly jira: JiraService) {}

  async getUsers(): Promise<JiraUser[]> {
    return this.jira.get<JiraUser[]>('users')
  }
}
