import { Component, OnInit, } from '@angular/core';
import { AppService } from 'src/app/shared/servicos/app.service';
import { LoggerService } from 'src/app/shared/servicos/logger.service';
import { ArtefatoService } from 'src/app/shared/servicos/artefato.service';
import { Router,  } from '@angular/router';
import { Artefato } from 'src/app/shared/modelos/artefato.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Tipo } from 'src/app/shared/modelos/tipo.model';
import { Observable, of } from 'rxjs';
import { Sistema } from 'src/app/shared/modelos/sistema.model';


@Component({
  selector: 'app-artefato-incluir',
  templateUrl: './artefato-incluir.component.html',
  styleUrls: ['./artefato-incluir.component.css']
})
export class ArtefatoIncluirComponent implements OnInit {

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
  checkedInclusaoManual: boolean = true;
  statusAtualizacao: string;

  constructor(private appService: AppService, private loggerService: LoggerService, private artefatoService: ArtefatoService,
    private router: Router) {

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
    this._initFormArtefato();

    this.appService.subjectListaTipoReady.subscribe(
      (valor: boolean) => {
        if (valor) {
          this.tipos = this.appService.listaTipo.slice().filter(tipo => tipo.coTabela == 'ARTEFATO' && tipo.icExibirGrafo == true);
          this.tipos$ = of(this.appService.listaTipo.slice().filter(tipo => tipo.coTabela == 'ARTEFATO' && tipo.icExibirGrafo == true));
        }
      }
    )

    this.appService.subjectListaSistemaReady.subscribe(
      (valor: boolean) => {
        if (valor) {
          this.sistemas = this.appService.listaSistema.slice();
          this.sistemas$ = of(this.appService.listaSistema.slice());
        }
      }
    )

  }

  private _initFormArtefato() {

    this.checkedProcessoCritico = false;
    this.checkedInclusaoManual = true;

    var disableCoSistema: boolean = false;

    this.formArtefato = new FormGroup(
      {
        'noNomeArtefato': new FormControl( null, [Validators.required, Validators.minLength(5)] ),
        'noNomeExibicao': new FormControl( null, [Validators.required, Validators.minLength(5)] ),
        'coTipoArtefato': new FormControl( null, [Validators.required] ),
        'coSistema': new FormControl( null, [Validators.required] ),
        'deDescricaoUsuario': new FormControl( null ),
        'icInclusaoManual': new FormControl( true ),
        'icProcessoCritico': new FormControl( false ),
      }
    )
  }

  get noNomeArtefato() { return this.formArtefato.get('noNomeArtefato'); }
  get noNomeExibicao() { return this.formArtefato.get('noNomeExibicao'); }
  get coTipoArtefato() { return this.formArtefato.get('coTipoArtefato'); }
  get coSistema() { return this.formArtefato.get('coSistema'); }
  get deDescricaoUsuario() { return this.formArtefato.get('deDescricaoUsuario'); }
  get icInclusaoManual() { return this.formArtefato.get('icInclusaoManual'); }
  get icProcessoCritico() { return this.formArtefato.get('icProcessoCritico'); }


  onCancelar() {
    this._initFormArtefato();
    this.checkedProcessoCritico = false;
  }

  onSubmit() {
    if (!this.formArtefato.valid) {
      console.log(this.noNomeArtefato)
      return null;
    }

    var formValue = this.formArtefato.value;

    var artefatoIncluir: Artefato = new Artefato();

    artefatoIncluir.noNomeArtefato = formValue.noNomeArtefato;
    artefatoIncluir.noNomeExibicao = formValue.noNomeExibicao;
    artefatoIncluir.tipoArtefato = new Tipo();
    artefatoIncluir.tipoArtefato.coTipo = formValue.coTipoArtefato;
    artefatoIncluir.coSistema = formValue.coSistema;
    artefatoIncluir.deDescricaoUsuario = formValue.deDescricaoUsuario;
    artefatoIncluir.icProcessoCritico = this.checkedProcessoCritico;

    this.isLoading = true;
    this.artefatoService.incluir(artefatoIncluir).subscribe(
      (artefato: Artefato) => {
        this.statusAtualizacao = "Atualizado com sucesso."
        this.router.navigate(['/artefato', artefato.coArtefato, 'editar']);
      },
      (error: any) => {
        this.statusAtualizacao = "Erro ao incluir artefato."
        this.isLoading = false;
      },
      () => { this.isLoading = false; }
    )
  }
}
