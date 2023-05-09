import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { JiraService } from './client.service'
import { username, password, baseUri } from './config'
import { ConfigService } from '@nestjs/config'

type EnvPair = { key: string; value: string }

const envValue = ({ key, value }: EnvPair) => ({
  inject: [ConfigService],
  provide: key,
  useFactory: (config: ConfigService) => config.get<string>(value),
})

@Module({
  imports: [HttpModule],
  providers: [
    JiraService,
    envValue({ key: baseUri, value: 'JIRA_BASE_URI' }),
    envValue({ key: username, value: 'JIRA_USER' }),
    envValue({ key: password, value: 'JIRA_TOKEN' }),
  ],
  exports: [JiraService],
})
export class JiraModule {}
