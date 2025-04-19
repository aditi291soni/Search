import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   // Retrieve token from localStorage (or a more secure storage)
   const token = localStorage.getItem('authToken');
   // Clone the request and add the Authorization header if token exists
   const authReq = token
      ? req.clone({
         setHeaders: {
            Authorization: `Bearer ${token}`,

         },
      })
      : req;

   // Pass the modified or original request to the next handler
   return next(authReq);
};
