import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subject, Observable, of } from 'rxjs';
import { Tipo } from '../modelos/tipo.model';
import { TipoService } from './tipo.service';
import { Sistema } from '../modelos/sistema.model';

export class SwitchRelacionamento {
  exibirAscendentes: boolean; 
  exibirDescendentes: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AppService {

  limitResultadoQuery: number = 30;
  limitResultadoPesquisaRapida: number = 10;

  baseServicoUrl: string = environment.api;
  isLog: boolean = environment.log;
  isLoading: Subject<boolean> = new Subject<boolean>();

  // MÉTODOS DO SISTEMA
  subjectMouseover: Subject<string> = new Subject<string>();
  subjectMouseclick: Subject<string> = new Subject<string>();
  subjectWindowSize: Subject<{ height: number, width: number }> = new Subject<{ height: number, width: number }>();
  subjectWindowResize: Subject<{ height: number, width: number }> = new Subject<{ height: number, width: number }>();
  subjectWindowScroll: Subject<{ x: number, y: number }> = new Subject<{ x: number, y: number }>();

  //PARÂMETROS DO DIAGRAMA DE RASTREABILIDADE
  public alturaMinimaDiagrama: number = 659;
  public espacamentoNodeDiagrama: number = 40;
  public larguraLetraDiagrama: number = 13;
  public espacamentoHorizontalDiagrama: number = 30;

  //PARÂMETROS E LISTAS GLOBAIS
  listaTipo: Tipo[] = [];
  subjectListaTipoReady: Subject<boolean> = new Subject<boolean>();

    //PARÂMETROS E LISTAS GLOBAIS
    listaSistema: Sistema[] = [];
    subjectListaSistemaReady: Subject<boolean> = new Subject<boolean>();

  //SUBJECT PARA ATUALIZAR INTERFACE
  subjectArtefatoEditarRefresh: Subject<number> = new Subject<number>();
  subjectArtefatoEditarExibirSwitch: Subject<SwitchRelacionamento> = new Subject<SwitchRelacionamento>();

  constructor() {
    this.isLoading.next(false);
   }
}
