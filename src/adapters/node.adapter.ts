import * as http from 'http'
import * as https from 'https'
import { HttpHeaders } from '../core/headers'
import { HttpRequest } from '../core/request'
import { HttpResponse } from '../core/response'

export function nodeAdatper<T>(request: HttpRequest): Observable<HttpResponse> {}
