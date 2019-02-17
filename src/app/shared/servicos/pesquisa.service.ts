import { Injectable } from '@angular/core';
import { AppService } from './app.service';
import { HttpClient,  } from '@angular/common/http';
import { Observable,  } from 'rxjs';
import { catchError, retry,  } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { Pesquisa } from '../modelos/pesquisa.model';
import { Artefato } from '../modelos/artefato.model';
import {  HandlersService } from './handlers.service';


@Injectable({
  providedIn: 'root'
})
export class PesquisaService {

  constructor(
    private handlers: HandlersService,
    private appService: AppService, private logger: LoggerService, private http: HttpClient) { }

  pesquisaAvancada(pesquisa: Pesquisa, offset: number, limit?: number): Observable<Artefato[]> {
    this.logger.log("Entrando em PesquisaService.pesquisaAvancada()");
    this.logger.log("Pesquisa:" );
    this.logger.log(pesquisa);

    if (!limit) {
      limit = this.appService.limitResultadoQuery;
    }
    
    var url: string = this.appService.baseServicoUrl + '/pesquisa/avancada?limit=' + limit + '&offset=' + offset;
    this.logger.log("Url: " + url );

    return this.http.post<Artefato[]>(
      url, pesquisa)
      .pipe(
        retry(0),
        catchError(e => this.handlers.tratarErro(e))
      );
  }

  pesquisarRapida(termo: string): Observable<Artefato[]> {
    var limit = this.appService.limitResultadoPesquisaRapida;

    var url: string = this.appService.baseServicoUrl + '/pesquisa/rapida?termo=' + termo + '&limit=' + limit;
    return this.http.get<Artefato[]>(url).pipe(
      retry(0),
      catchError(e => this.handlers.tratarErro(e))
    );
  }

}
