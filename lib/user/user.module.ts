import { Module } from '@nestjs/common'
import { UserService} from './user.service'
import { JiraModule } from '../jira/jira.module'

@Module({
  imports: [JiraModule],
  providers: [
    UserService,
  ],
  exports: [ UserService ]
})
export class UserModule{}
