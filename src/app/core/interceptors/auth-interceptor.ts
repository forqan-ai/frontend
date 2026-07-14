import { HttpErrorResponse, HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const token = authService.getToken();
  const authorizedReq = token?req.clone({headers:new HttpHeaders({Authorization:`Bearer ${token}`})}):req;
console.log(authorizedReq.headers.get('Authorization'));
  return next(authorizedReq).pipe(
    catchError((error:HttpErrorResponse)=>{
      if(error.status === 401){
        // authService.logout();
        // router.navigate(['/login']);
      }
      return throwError(()=> error);
    })
  );
};

