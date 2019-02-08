import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry, debounce, finalize } from 'rxjs/operators';
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


  atualizar(artefato: Artefato): Observable<Artefato> {
    this.logger.log("Atualizar artefato")
    this.logger.log(artefato)
    var url: string = this.appService.baseServicoUrl + '/artefato/' + artefato.coArtefato;

    return this.http.post<Artefato>(url, artefato);
  }

  incluir(artefato: Artefato): Observable<Artefato> {
    this.logger.log("Incluir artefato")
    this.logger.log(artefato)
    var url: string = this.appService.baseServicoUrl + '/artefato';

    return this.http.post<Artefato>(url, artefato);
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
