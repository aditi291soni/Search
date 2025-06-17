import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   // Retrieve token from localStorage (or a more secure storage)
   const token = localStorage.getItem('authToken');
   const refreshToken = localStorage.getItem('refreshToken');
   // Clone the request and add the Authorization header if token exists

   let authReq = req;

  //  if (token && refreshToken == token) {
     authReq = req.clone({
       setHeaders: {
         Authorization: `Bearer ${token}`,
       },
     });
  //  }else{
  //     authReq = req.clone({
  //        setHeaders: {
  //          Authorization: `Bearer ${refreshToken}`,
  //        },
  //      });
  //  }
 
   return next(authReq);
};

