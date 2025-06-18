import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError, filter, take } from "rxjs";
import { TokenService } from "./services/token.service";
import { ApiService } from "./services/api.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const apiService = inject(ApiService);
  const token = tokenService.getToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (!tokenService.isRefreshingToken()) {
          tokenService.setRefreshing(true);
          return apiService.refresh_token().pipe(
            switchMap((data) => {
              console.log("refre",data)
              tokenService.setToken(data.token);
              tokenService.setRefreshing(false);

              const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${data.token}` },
              });
              return next(cloned);
            }),
            catchError((err) => {
              tokenService.setRefreshing(false);
              return throwError(() => err);
            })
          );
        } else {
          return tokenService.getRefreshTokenSubject().pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
              const cloned = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` },
              });
              return next(cloned);
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};
