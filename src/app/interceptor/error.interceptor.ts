import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { catchError, Observable, throwError, tap, toArray } from "rxjs";

export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const toastr = inject(ToastrService);

  // Response
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        const erro = error.error;
        toastr.error(`ERRO - ${erro.status}`, erro.message, { timeOut: 3000 })
      }

      return throwError(error);
    })
  );
};
