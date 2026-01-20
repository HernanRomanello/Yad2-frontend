import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authRequest = request.clone({
    withCredentials: true,
  });

  return next(authRequest);
};
