import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry, debounce } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { Pesquisa } from '../modelos/pesquisa.model';
import { ArtefatoView } from '../modelos/artefato-view.model.';

@Injectable({
  providedIn: 'root'
})
export class PesquisaService {

  constructor(private appService: AppService, private logger: LoggerService, private http: HttpClient) { }

  pesquisaAvancada(pesquisa: Pesquisa): Observable<ArtefatoView[]> {
    this.logger.log("Entrando em PesquisaService.pesquisaAvancada()");
    this.logger.log("Pesquisa:" );
    this.logger.log(pesquisa);

    var url: string = this.appService.baseServicoUrl + '/pesquisa/avancada';

    return this.http.post<ArtefatoView[]>(
      url, pesquisa)
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