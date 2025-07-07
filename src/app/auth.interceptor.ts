import { HttpInterceptorFn, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHandlerFn } from "@angular/common/http";
import { inject, Injectable, Injector } from "@angular/core";
import { catchError, switchMap, throwError, filter, take, BehaviorSubject, Observable } from "rxjs";
import { TokenService } from "./services/token.service";
import { ApiService } from "./services/api.service";
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const injector = inject(Injector);
  const tokenService = injector.get(TokenService);
  const authService = injector.get(ApiService);

  const authToken = tokenService.getAuthToken();
  let authReq = req;

  if (authToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401 && !authReq.url.includes('/auth/login')) {
        return handle401Error(authReq, next, authService, tokenService, injector);
      }
      return throwError(() => error);
    })
  );
};

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: ApiService,
  tokenService: TokenService,
  injector: Injector
) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response: any) => {
        isRefreshing = false;
        tokenService.setAuthToken(response.authToken);
        refreshTokenSubject.next(response.authToken);
        return next(addToken(request, response.authToken));
      }),
      catchError(err => {
        isRefreshing = false;
        tokenService.clearTokens();
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next(addToken(request, token!)))
    );
  }
}

function addToken(req: HttpRequest<any>, token: string) {
  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });
}
