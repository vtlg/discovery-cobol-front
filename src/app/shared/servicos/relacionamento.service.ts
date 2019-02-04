import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, interval } from 'rxjs';
import { catchError, retry, debounce, finalize } from 'rxjs/operators';
import { Artefato } from '../modelos/artefato.model';
import { LoggerService } from './logger.service';
import { Relacionamento } from '../modelos/relacionamento.model';

@Injectable({
  providedIn: 'root'
})
export class RelacionamentoService {

  constructor(private appService: AppService, private logger: LoggerService, private http: HttpClient) { }
  lastCoArtefato: number = null;

  atualizar(relacionamento: Relacionamento): Observable<Relacionamento> {

    var url: string = this.appService.baseServicoUrl + '/relacionamento/' + relacionamento.coRelacionamento;

    return this.http.post<Relacionamento>(url, relacionamento);
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