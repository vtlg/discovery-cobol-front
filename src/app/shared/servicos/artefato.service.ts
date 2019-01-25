import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry, debounce } from 'rxjs/operators';
import { Artefato } from '../modelos/artefato.model';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ArtefatoService {

  constructor(private appService: AppService, private logger: LoggerService, private http: HttpClient) { }
  lastCoArtefato: number = null;

  getArtefato(coArtefato: number): Observable<Artefato> {
    var url: string = this.appService.baseServicoUrl + '/artefato/' + coArtefato;

    return this.http.get<Artefato>(
      url)
      .pipe(
        retry(0),
        catchError(e => this.tratarErro(e))
      );
  }

  getArtefatoRelacionamento(coArtefato: number): Observable<Artefato> {
    var url: string = this.appService.baseServicoUrl + '/artefato/' + coArtefato + '/relacionamento';

    return this.http.get<Artefato>(url)
      .pipe(
        retry(0),
        catchError(e => this.tratarErro(e))
      );
  }

  pesquisarRapida(termo: string): Observable<Artefato[]> {
    var url: string = this.appService.baseServicoUrl + '/artefato?termo=' + termo;
    return this.http.get<Artefato[]>(url);

    /*
    return this.http.get<Artefato>(
      url, { observe: 'response' })
      .pipe(
        retry(0),
        catchError( e => this.tratarErro(e))
      );
    */
  }


  /*
    getConfigResponse(): Observable<HttpResponse<Config>> {
      return this.http.get<Config>(
        this.configUrl, { observe: 'response' });
    }
    */

  private tratarErro(erro: HttpErrorResponse) {
    if (erro.error instanceof ErrorEvent) {
      this.logger.error(erro);
    } else {
      this.logger.error(erro);
    }

    return throwError('Teste Erro');
  }
}
