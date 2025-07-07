import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SearchService } from './search.service';
import { ApiService } from './services/api.service';

export const authGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);
   const authService = inject(ApiService);
   authService.getLocalValueInJSON(localStorage.getItem('userData'));

   // Replace this with your actual authentication check logic
   const isAuthenticated = checkAuthentication();
   const userRoleId = authService.getLocalValueInJSON(localStorage.getItem('userData')); // Fetch role ID from the service
   const allowedRoles = route.data?.['roles'];
   if (!isAuthenticated) {
      // Redirect to the login page
      router.navigate(['/auth/sign-in'], {
         queryParams: { returnUrl: state.url }, // Optionally pass the return URL
      });
      return false;
   }

   if (allowedRoles && !allowedRoles.includes(userRoleId)) {
      router.navigate(['/access-denied']); // Or redirect elsewhere
      return false;
    }
  
    return true;
  };
  


function checkAuthentication(): boolean {
   // Example: Check for a token in localStorage (customize as needed)
   const token = localStorage.getItem('authToken');
   return !!token; // Return true if the token exists
}
