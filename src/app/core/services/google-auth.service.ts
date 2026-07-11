import { Injectable } from '@angular/core';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  initialize(clientId: string, callback: (response: any) => void) {
    google.accounts.id.initialize({
      client_id: clientId,
      callback: callback,
    });
  }

  renderButton(element: HTMLElement) {
    google.accounts.id.renderButton(element, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: 340,
      text: 'signin_with',
      shape: 'pill',
      locale: 'ar',
      logo_alignment: 'center', 
    });
  }

  prompt() {
    google.accounts.id.prompt();
  }
}
