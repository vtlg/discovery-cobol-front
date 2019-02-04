import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { LoggerService } from './logger.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Tipo } from '../modelos/tipo.model';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Sistema } from '../modelos/sistema.model';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {
  private listaSistema: Sistema[];

  constructor(private appService: AppService, private logger: LoggerService, private http: HttpClient) {

  }


  getListaTipoLocal(): Sistema[] {
    if (this.listaSistema) {
      return this.listaSistema;
    }
    this.getListaSistema().subscribe(
      (sistemas) => {
        this.listaSistema = sistemas;
        return this.listaSistema;
      }
    );

  }

  getSistema(coSistema: string): Observable<Sistema> {
    var url: string = this.appService.baseServicoUrl + '/sistema/' + coSistema;

    return this.http.get<Sistema>(url)
      .pipe(
        retry(0),
        catchError(e => this.tratarErro(e))
      );
  }

  getListaSistema(): Observable<Sistema[]> {
    var url: string = this.appService.baseServicoUrl + '/sistema';

    return this.http.get<Sistema[]>(url)
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
