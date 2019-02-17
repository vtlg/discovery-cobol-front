import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { LoggerService } from './logger.service';
import { HttpClient, } from '@angular/common/http';
import { Tipo } from '../modelos/tipo.model';
import { Observable, } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {  HandlersService } from './handlers.service';

@Injectable({
  providedIn: 'root'
})
export class TipoService {

  constructor(private handlers: HandlersService, private appService: AppService, private logger: LoggerService, private http: HttpClient) {  }

  getTipo(coTipo: string): Observable<Tipo> {
    var url: string = this.appService.baseServicoUrl + '/tipo/' + coTipo;

    return this.http.get<Tipo>(url).pipe(
      retry(0),
      catchError(e => this.handlers.tratarErro(e))
    );
  }

  getListaTipo(coTabela?: string): Observable<Tipo[]> {
    var url: string = this.appService.baseServicoUrl + '/tipo';
    if (coTabela) {
      url = url + "?coTabela=" + coTabela;
    }

    return this.http.get<Tipo[]>(url).pipe(
      retry(0),
      catchError(e => this.handlers.tratarErro(e))
    );
  }

}
