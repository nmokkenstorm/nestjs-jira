import {
  Args,
  Query,
  Resolver,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql'
import { Project } from './project.model'
import { Issue } from './issue.model'
import { ProjectService } from './project.service'
import { ProjectFilter } from './projectFilter.input'
import { IssueFilter } from './issueFilter.input'
import { IssueService } from './issue.service'

@Resolver(() => Project)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly issueService: IssueService,
  ) {}

  @Query(() => [Project])
  async projects(
    @Args({ name: 'filter', type: () => ProjectFilter })
    { limit }: ProjectFilter,
  ) {
    return this.projectService.getProjects({ limit })
  }

  @Query(() => Project)
  async project(@Args('key') key: string) {
    return this.projectService.getProject(String(key))
  }

  @ResolveField(() => [Issue])
  async issues(
    @Parent() project: Project,
    @Args({ name: 'filter', type: () => IssueFilter })
    filter: IssueFilter,
  ) {
    try {
      return this.issueService.forProject(project, filter)
    } catch (e) {
      return []
    }
  }

  @ResolveField(() => Int)
  async issueCount(project: Project): Promise<number> {
    try {
      return (await this.issueService.countForProject(project)) ?? 0
    } catch (e) {
      return 0
    }
  }
}
