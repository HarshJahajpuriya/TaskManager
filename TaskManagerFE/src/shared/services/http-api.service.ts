import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from './urls';

@Injectable({
  providedIn: 'root',
})
export class HttpApiService {
  constructor(private httpClient: HttpClient) {}

  public get<TResponse>(
    path: string,
    params?: { [key: string]: string }
  ): Observable<TResponse> {
    return this.httpClient.get(`${BASE_API_URL}${path}`, {
      headers: this.getHttpHeaders(),
      params: this.getValidParams(params),
    }) as Observable<TResponse>;
  }

  public post<TBody, TResponse>(
    path: string,
    body: TBody,
    params?: { [key: string]: string }
  ): Observable<TResponse> {
    return this.httpClient.post(`${BASE_API_URL}${path}`, body, {
      headers: this.getHttpHeaders(),
      params: this.getValidParams(params),
    }) as Observable<TResponse>;
  }

  public patch<TBody, TResponse>(
    path: string,
    body: TBody,
    params?: { [key: string]: string }
  ): Observable<TResponse> {
    return this.httpClient.patch(`${BASE_API_URL}${path}`, body, {
      headers: this.getHttpHeaders(),
      params: this.getValidParams(params),
    }) as Observable<TResponse>;
  }

  public delete<TResponse>(
    path: string,
    params?: { [key: string]: string }
  ): Observable<TResponse> {
    return this.httpClient.delete(`${BASE_API_URL}${path}`, {
      headers: this.getHttpHeaders(),
      params: this.getValidParams(params),
    }) as Observable<TResponse>;
  }

  private getHttpHeaders() {
    const authToken = sessionStorage.getItem('userToken');
    return new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
    });
  }

  private getValidParams(params?: { [key: string]: string }) {
    return params
      ? new HttpParams({
          fromObject: params,
        })
      : undefined;
  }
}
