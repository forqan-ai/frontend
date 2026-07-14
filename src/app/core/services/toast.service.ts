import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';

@Injectable({
  providedIn:'root'
})
export class ToastService {


  message = signal<string | null>(null);

  type = signal<ToastType>('success');


  show(message:string, type:ToastType='success'){

    this.message.set(message);

    this.type.set(type);


    setTimeout(()=>{

      this.message.set(null);

    },3000);

  }

}