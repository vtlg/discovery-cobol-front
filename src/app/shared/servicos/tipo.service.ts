import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { LoggerService } from './logger.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Tipo } from '../modelos/tipo.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TipoService {
  private listaTipo: Tipo[];

  constructor(private appService: AppService, private logger: LoggerService, private http: HttpClient) {

  }


  getListaTipoLocal(): Tipo[] {
    if (this.listaTipo) {
      return this.listaTipo;
    }
    this.getListaTipo().subscribe(
      (tipos) => {
        this.listaTipo = tipos;
        return this.listaTipo;
      }
    );

  }

  getTipo(coTipo: string): Observable<Tipo> {
    var url: string = this.appService.baseServicoUrl + '/tipo/' + coTipo;

    return this.http.get<Tipo>(url)
      .pipe(
        retry(0),
        catchError(e => this.tratarErro(e))
      );
  }

  getListaTipo(coTabela?: string): Observable<Tipo[]> {
    var url: string = this.appService.baseServicoUrl + '/tipo';
    if (coTabela) {
      url = url + "?coTabela=" + coTabela;
    }

    return this.http.get<Tipo[]>(url)
      .pipe(
        retry(0),
        catchError(e => this.tratarErro(e))
      );
  }

  private tratarErro(erro: HttpErrorResponse) {
    if (erro.error instanceof ErrorEvent) {
      this.logger.error(erro);
    } else {
      this.logger.error(erro);
    }

    return throwError('Teste Erro');
  }
}