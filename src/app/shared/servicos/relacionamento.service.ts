import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient, } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { Relacionamento } from '../modelos/relacionamento.model';
import { InterfaceSistema } from '../modelos/interface-sistema.model';
import { HandlersService } from './handlers.service';

@Injectable({
  providedIn: 'root'
})
export class RelacionamentoService {

  constructor(private handlers: HandlersService, private appService: AppService, private logger: LoggerService, private http: HttpClient) { }
  lastCoArtefato: number = null;



  incluir(relacionamento: Relacionamento): Observable<Relacionamento> {
    var url: string = this.appService.baseServicoUrl + '/relacionamento';
    return this.http.post<Relacionamento>(url, relacionamento).pipe(
      retry(0),
      catchError(e => this.handlers.tratarErro(e))
    );
  }

  atualizar(relacionamento: Relacionamento): Observable<Relacionamento> {

    var url: string = this.appService.baseServicoUrl + '/relacionamento/' + relacionamento.coRelacionamento;

    return this.http.post<Relacionamento>(url, relacionamento).pipe(
      retry(0),
      catchError(e => this.handlers.tratarErro(e))
    );
  }

  getInterfaceTabela(coSistema?: string): Observable<InterfaceSistema[]> {

    var url: string = this.appService.baseServicoUrl + '/relacionamento/interface//tabela';
    if (coSistema) {
      url = this.appService.baseServicoUrl + '/relacionamento/interface/' + coSistema + '/tabela';
    }
   

    return this.http.get<InterfaceSistema[]>(url).pipe(
      retry(0),
      catchError(e => this.handlers.tratarErro(e))
    );
  }



}
