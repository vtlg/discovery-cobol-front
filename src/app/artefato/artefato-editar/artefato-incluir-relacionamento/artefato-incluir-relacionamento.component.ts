import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AppService } from 'src/app/shared/servicos/app.service';
import { LoggerService } from 'src/app/shared/servicos/logger.service';
import { of, Observable } from 'rxjs';
import { Sistema } from 'src/app/shared/modelos/sistema.model';
import { Tipo } from 'src/app/shared/modelos/tipo.model';
import { FormControl } from '@angular/forms';
import { Artefato } from 'src/app/shared/modelos/artefato.model';
import { skipWhile, debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { PesquisaService } from 'src/app/shared/servicos/pesquisa.service';
import { Pesquisa } from 'src/app/shared/modelos/pesquisa.model';
import { Relacionamento } from 'src/app/shared/modelos/relacionamento.model';
import { RelacionamentoService } from 'src/app/shared/servicos/relacionamento.service';


@Component({
  selector: 'app-artefato-incluir-relacionamento',
  templateUrl: './artefato-incluir-relacionamento.component.html',
  styleUrls: ['./artefato-incluir-relacionamento.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ArtefatoIncluirRelacionamentoComponent implements OnInit, OnDestroy {

  myControl = new FormControl();

  coTipoRelacionamentoSelecionado: string = 'NORMAL';
  tipoOrientacaoSelecionado: string = 'DESCENDENTE';
  coSistemaSelecionado: string = '';
  coTipoArtefatoSelecionado: string = '';
  coArtefatoSelecionado: number = 0;
  mensagemErro: string = null;

  tipos: Tipo[] = [];
  tipos$: Observable<Tipo[]>;

  sistemas: Sistema[] = [];
  sistemas$: Observable<Sistema[]>;

  artefatos$: Observable<Artefato[]>;

  tiposRelacionamento: { coTipo: string, deTipo: string }[] =
    [{ coTipo: 'INTERFACE', deTipo: 'Interface (Relacionamento entre sistemas diferentes)' },
    { coTipo: 'CONTROL-M', deTipo: 'Control-M (Relacionamento originado da malha de execução do Control-M)' },
    { coTipo: 'NORMAL', deTipo: 'Normal' }]

  tiposOrientacao: { coOrientacao: string, deOrientacao: string }[] =
    [{ coOrientacao: 'ASCENDENTE', deOrientacao: 'Ascendente' },
    { coOrientacao: 'DESCENDENTE', deOrientacao: 'Descendente' }]

  constructor(
    private appService: AppService,
    private loggerService: LoggerService,
    private relacionamentoService: RelacionamentoService,
    private pesquisaService: PesquisaService,
    public dialogRef: MatDialogRef<ArtefatoIncluirRelacionamentoComponent>,
    @Inject(MAT_DIALOG_DATA) public coArtefato: number
  ) {

    if (this.appService.listaTipo && this.appService.listaTipo.length > 0) {
      this.tipos = this.appService.listaTipo.slice().filter(tipo => tipo.coTabela == 'ARTEFATO' && tipo.icExibirGrafo == true);
      this.tipos$ = of(this.appService.listaTipo.slice().filter(tipo => tipo.coTabela == 'ARTEFATO' && tipo.icExibirGrafo == true));
    }

    if (this.appService.listaSistema && this.appService.listaSistema.length > 0) {
      this.sistemas = this.appService.listaSistema.slice();
      this.sistemas$ = of(this.appService.listaSistema.slice());
    }
  }

  ngOnInit() {

    this.appService.subjectListaTipoReady.subscribe(
      (valor: boolean) => {
        if (valor) {
          this.tipos = this.appService.listaTipo.slice().filter(tipo => tipo.coTabela == 'ARTEFATO' && tipo.icExibirGrafo == true);
          this.tipos$ = of(this.appService.listaTipo.slice().filter(tipo => tipo.coTabela == 'ARTEFATO' && tipo.icExibirGrafo == true));
        }
      }
    );

    this.appService.subjectListaSistemaReady.subscribe(
      (valor: boolean) => {
        if (valor) {
          this.sistemas = this.appService.listaSistema.slice();
          this.sistemas$ = of(this.appService.listaSistema.slice());
        }
      }
    );


    this.myControl.valueChanges.pipe(
      skipWhile((termo: string) => termo.length < 4),
      debounceTime(1000),
      distinctUntilChanged(),
      map((termo) => {
        this._pesquisar(termo);
      })
    ).subscribe();

  }

  private _pesquisar(termo: string): void {
    this.mensagemErro = null;

    var pesquisa: Pesquisa = new Pesquisa();

    if (!this.coSistemaSelecionado && this.coSistemaSelecionado.length == 0) {
      this.mensagemErro = 'Selecione um sistema.';
      return null;
    }

    if (!this.coTipoArtefatoSelecionado && this.coTipoArtefatoSelecionado.length == 0) {
      this.mensagemErro = 'Selecione um tipo de artefato.';
      return null;
    }

    if (this.coSistemaSelecionado && this.coSistemaSelecionado.length > 0) {
      pesquisa.listaSistema = []
      pesquisa.listaSistema.push(this.coSistemaSelecionado);
    }

    if (this.coTipoArtefatoSelecionado && this.coTipoArtefatoSelecionado.length > 0) {
      pesquisa.listaTipoArtefato = []
      pesquisa.listaTipoArtefato.push(this.coTipoArtefatoSelecionado);
    }

    pesquisa.expNome = termo;

    this.pesquisaService.pesquisaAvancada(pesquisa, 0, 5)
      .subscribe(
        (artefatos: Artefato[]) => {
          this.artefatos$ = of(artefatos);
        },
        (error: any) => {
          this.mensagemErro = error;
        },
        () => {

        }
      )
  }

  ngOnDestroy() { }

  onSelecionarArtefato(coArtefato) {
    this.coArtefatoSelecionado = coArtefato;
  }

  onSubmit() {
    this.mensagemErro = null;

    if (!this.coArtefatoSelecionado && this.coArtefatoSelecionado == 0) {
      this.mensagemErro = 'Selecione um artefato para relacionar.'
      return null;
    }

    if (!this.coArtefato && this.coArtefato == 0) {
      this.mensagemErro = 'Erro inesperado.'
      return null;
    }

    var relacionamento: Relacionamento = new Relacionamento();

    relacionamento.tipoRelacionamento = new Tipo();
    relacionamento.tipoRelacionamento.coTipo = this.coTipoRelacionamentoSelecionado

    relacionamento.ascendente = new Artefato();
    relacionamento.descendente = new Artefato();

    if (this.tipoOrientacaoSelecionado == 'ASCENDENTE') {
      relacionamento.ascendente.coArtefato = this.coArtefatoSelecionado;
      relacionamento.descendente.coArtefato = this.coArtefato;
    } else {
      relacionamento.ascendente.coArtefato = this.coArtefato;
      relacionamento.descendente.coArtefato = this.coArtefatoSelecionado;
    }

    relacionamento.icInclusaoMalha = false;
    relacionamento.icInclusaoManual = true;

    this.relacionamentoService.incluir(relacionamento).subscribe(
      (relacionamento: Relacionamento) => {
      },
      (error: any) => {
        this.mensagemErro = error;
      },
      () => {

      }
    );
  }

  onCancelar() {
    this.dialogRef.close();
  }
}
