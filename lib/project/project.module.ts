import { Module, DynamicModule } from '@nestjs/common'
import { ProjectResolver } from './project.resolver'
import { IssueService } from './issue.service'
import { ProjectService } from './project.service'
import { JiraModule } from '../jira/jira.module'
import { StoryPointFieldService } from './storyPointField.service'
import { envPointFields } from './tokens'
import { StoryPointCalculator } from './storyPointCalculator.service'

interface Config {
  storyPointFields: string[]
}

const defaultConfig: Config = {
  storyPointFields: [],
}

@Module({})
export class ProjectModule {
  static register({ storyPointFields }: Config = defaultConfig): DynamicModule {
    return {
      module: ProjectModule,
      imports: [JiraModule],
      exports: [ProjectService],
      providers: [
        IssueService,
        ProjectService,
        ProjectResolver,
        StoryPointFieldService,
        StoryPointCalculator,
        {
          provide: envPointFields,
          inject: [StoryPointFieldService],
          useFactory: async (fields: StoryPointFieldService) =>
            storyPointFields.length
              ? storyPointFields
              : await fields.getStoryPointFields(),
        },
      ],
    }
  }
}
