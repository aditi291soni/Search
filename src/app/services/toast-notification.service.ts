import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Service to handle toast notifications using PrimeNG's `MessageService`.
 */
@Injectable({
   providedIn: 'root',
})
export class ToastNotificationService {
   /**
    * Creates an instance of ToastNotificationService.
    * @param {MessageService} messageService - The PrimeNG MessageService to display notifications.
    */
   constructor(private messageService: MessageService) { }

   /**
    * Displays a success toast notification.
    * @param {string} message - The message to display in the toast.
    */
   showSuccess(message: string): void {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
   }

   /**
    * Displays an error toast notification.
    * @param {string} message - The message to display in the toast.
    */
   showError(message: string): void {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
   }

   /**
    * Displays an info toast notification.
    * @param {string} message - The message to display in the toast.
    */
   showInfo(message: string): void {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
   }

   /**
    * Displays a warning toast notification.
    * @param {string} message - The message to display in the toast.
    */
   showWarn(message: string): void {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: message });
   }
}
