import { HttpRequest, HttpResponse } from "./http";

export interface PermissionMiddleware{
    handle(httpRequest: HttpRequest): Promise<HttpResponse>
}