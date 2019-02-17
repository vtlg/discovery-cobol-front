import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from './logger.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HandlersService {

  constructor(private logger: LoggerService) { }

  public tratarErro(erro: HttpErrorResponse) {
      if (erro.error instanceof ErrorEvent) {
          this.logger.error(erro);
      } else {
          this.logger.error(erro);
      }
      return throwError(erro.error);
  }
}
