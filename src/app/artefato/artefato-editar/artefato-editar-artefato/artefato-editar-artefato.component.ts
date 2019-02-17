import { Component, OnInit, ElementRef } from '@angular/core';
import { AppService } from 'src/app/shared/servicos/app.service';
import { LoggerService } from 'src/app/shared/servicos/logger.service';
import { ArtefatoService } from 'src/app/shared/servicos/artefato.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Artefato } from 'src/app/shared/modelos/artefato.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Sistema } from 'src/app/shared/modelos/sistema.model';
import { Observable, of } from 'rxjs';
import { Tipo } from 'src/app/shared/modelos/tipo.model';

@Component({
  selector: 'app-artefato-editar-artefato',
  templateUrl: './artefato-editar-artefato.component.html',
  styleUrls: ['./artefato-editar-artefato.component.css']
})
export class ArtefatoEditarArtefatoComponent implements OnInit {

  artefato: Artefato;
  formArtefato: FormGroup;

  height: number;
  width: number;
  larguraContainer: number = 710;
  isLoading: boolean = false;

  tipos: Tipo[] = [];
  tipos$: Observable<Tipo[]>;

  sistemas: Sistema[] = [];
  sistemas$: Observable<Sistema[]>;

  checkedProcessoCritico: boolean = false;
  checkedInclusaoManual: boolean = false;
  statusAtualizacao: string;
  mensagemErro: string;

  constructor(private appService: AppService, private loggerService: LoggerService, private artefatoService: ArtefatoService,
    private route: ActivatedRoute) {

    this.height = window.innerHeight;
    this.width = window.innerWidth;

    this.appService.subjectWindowResize.subscribe(
      (resize: { height, width }) => {
        this.height = resize.height;
        this.width = resize.width;
      }
    )

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
    this.route.params.subscribe(
      (params: Params) => {
        var coArtefato: number = params['coArtefato'];
        if (coArtefato) {
          this.artefatoService.getArtefato(coArtefato).subscribe(
            (artefato: Artefato) => {
              this.artefato = new Artefato();
              this.artefato.inicializar(artefato);
              this._initFormArtefato();
            },
            (error: any) => {
              this.loggerService.error(error)
            },
            () => {
            }
          )
        }
      }
    );
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

  }

  private _initFormArtefato() {

    this.checkedProcessoCritico = this.artefato.icProcessoCritico;
    this.checkedInclusaoManual = this.artefato.icInclusaoManual;

    var disableCoSistema: boolean = false;

    this.formArtefato = new FormGroup(
      {
        'noNomeArtefato': new FormControl({ value: this.artefato.noNomeArtefato, disabled: true }),
        'noNomeExibicao': new FormControl({ value: this.artefato.noNomeExibicao, disabled: false,  }),
        'noNomeInterno': new FormControl({ value: this.artefato.noNomeInterno, disabled: true }),
        'coTipoArtefato': new FormControl({ value: this.artefato.tipoArtefato.coTipo, disabled: false }),
        'coSistema': new FormControl({ value: this.artefato.coSistema, disabled: false }),
        'deDescricaoArtefato': new FormControl({ value: this.artefato.deDescricaoArtefato, disabled: true }),
        'deDescricaoUsuario': new FormControl({ value: this.artefato.deDescricaoUsuario, disabled: false }),
        'icInclusaoManual': new FormControl({ value: this.artefato.icInclusaoManual, disabled: false }),
        'icProcessoCritico': new FormControl({ value: this.artefato.icProcessoCritico, disabled: false }),
      }
    )

      this.noNomeExibicao.setValidators([ Validators.required, Validators.minLength(5)]);
      this.coTipoArtefato.setValidators([ Validators.required]);
      this.coSistema.setValidators([ Validators.required]);

  }

  get noNomeArtefato() { return this.formArtefato.get('noNomeArtefato'); }
  get noNomeInterno() { return this.formArtefato.get('noNomeInterno'); }
  get noNomeExibicao() { return this.formArtefato.get('noNomeExibicao'); }
  get coTipoArtefato() { return this.formArtefato.get('coTipoArtefato'); }
  get coSistema() { return this.formArtefato.get('coSistema'); }
  get deDescricaoUsuario() { return this.formArtefato.get('deDescricaoUsuario'); }
  get deDescricaoArtefato() { return this.formArtefato.get('deDescricaoArtefato'); }
  get icInclusaoManual() { return this.formArtefato.get('icInclusaoManual'); }
  get icProcessoCritico() { return this.formArtefato.get('icProcessoCritico'); }

  onCancelar() {
    this._initFormArtefato();
    this.checkedProcessoCritico = this.artefato.icProcessoCritico;
  }

  onSubmit() {
    this.mensagemErro = null;
    this.statusAtualizacao = null;

    var formValue = this.formArtefato.value;

    var artefatoAtualizar: Artefato = new Artefato();
    artefatoAtualizar.inicializar(this.artefato);


    if (formValue.noNomeExibicao) {
      artefatoAtualizar.noNomeExibicao = formValue.noNomeExibicao;
    }

    if (formValue.coSistema) {
      artefatoAtualizar.coSistema = formValue.coSistema;
    }
    if (formValue.deDescricaoUsuario) {
      artefatoAtualizar.deDescricaoUsuario = formValue.deDescricaoUsuario;
    }
    if (formValue.icProcessoCritico) {
      artefatoAtualizar.icProcessoCritico = formValue.icProcessoCritico;
    }

    artefatoAtualizar.icProcessoCritico = this.checkedProcessoCritico;

    this.isLoading = true;
    this.artefatoService.atualizar(artefatoAtualizar).subscribe(
      (artefato: Artefato) => {
        this.statusAtualizacao = "Atualizado com sucesso."
        this.artefato.inicializar(artefato);
        this._initFormArtefato();
        this.appService.subjectArtefatoEditarRefresh.next( artefato.coArtefato );
      },
      (error: any) => {
        this.mensagemErro = error
       },
      () => { this.isLoading = false; }
    )
  }
}
