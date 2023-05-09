import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { username, password, baseUri } from './config'

@Injectable()
export class JiraService {
  constructor(
    private readonly http: HttpService,
    @Inject(baseUri) private readonly baseUri: string,
    @Inject(username) private readonly username: string,
    @Inject(password) private readonly password: string
  ) {}

  async get<T = never>(
    uri: string,
    params: Record<string, string | number> = {}
  ): Promise<T> {
    try {
      const response = await this.http
        .get<T>(`${this.baseUri}/rest/api/3/${uri}`, {
          params,
          headers: {
            ['Accept']: 'application/json',
            ['Content-Type']: 'application/json',
          },
          auth: {
            username: this.username,
            password: this.password,
          },
        })
        .toPromise()

      if (!response) {
        throw new Error('no response')
      }

      return response.data
    } catch (e) {
      console.error(e)
      throw e
    }
  }
}
