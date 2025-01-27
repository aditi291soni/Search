import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);

   // Replace this with your actual authentication check logic
   const isAuthenticated = checkAuthentication();

   if (!isAuthenticated) {
      // Redirect to the login page
      router.navigate(['/auth/sign-in'], {
         queryParams: { returnUrl: state.url }, // Optionally pass the return URL
      });
      return false;
   }

   return true;
};

function checkAuthentication(): boolean {
   // Example: Check for a token in localStorage (customize as needed)
   const token = localStorage.getItem('authToken');
   return !!token; // Return true if the token exists
}
