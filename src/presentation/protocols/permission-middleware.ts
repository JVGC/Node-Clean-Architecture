import { type HttpRequest, type HttpResponse } from './http'

export interface PermissionMiddleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
