import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Result } from "../models/result";
const TOKEN_HEADER_KEY = "x-access-token";
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private authAPI: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req;
    const token = this.authAPI.getUserInfo();
    if (token != null) {
      authReq = this.addTokenHeader(req, token);
    }
    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          !authReq.url.includes("auth/signin") &&
          error.status === 401
        ) {
          return this.handle401Error(authReq, next);
        }

        let errorCount = 0;
        const errorWithTimestamp$ = throwError(() => {
          const error: any = new Error(`This is error number ${++errorCount}`);
          error.timestamp = Date.now();
          return error;
        });
        return errorWithTimestamp$;
      })
    );
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.authAPI.getUserInfo();

      if (token)
        return this.authAPI.refreshToken().pipe(
          switchMap((token: Result) => {
            this.isRefreshing = false;

            this.authAPI.saveToken(token.payload.data.accessToken, token.payload.data.refreshToken);
            this.refreshTokenSubject.next(token.payload.data.accessToken);

            return next.handle(this.addTokenHeader(request, token.payload.data.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.authAPI.logOut();
            return throwError(err);
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
  addTokenHeader(request: HttpRequest<any>, token: any): HttpRequest<any> {
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];
