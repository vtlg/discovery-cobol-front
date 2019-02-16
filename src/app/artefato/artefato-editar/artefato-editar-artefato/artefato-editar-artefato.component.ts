import { Component, OnInit, ElementRef } from '@angular/core';
import { AppService } from 'src/app/shared/servicos/app.service';
import { LoggerService } from 'src/app/shared/servicos/logger.service';
import { ArtefatoService } from 'src/app/shared/servicos/artefato.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Artefato } from 'src/app/shared/modelos/artefato.model';
import { FormGroup, FormControl } from '@angular/forms';

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

  checkedProcessoCritico: boolean = false;
  checkedInclusaoManual: boolean = false;
  statusAtualizacao: string;

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
  }

  private _initFormArtefato() {

    this.checkedProcessoCritico = this.artefato.icProcessoCritico;
    this.checkedInclusaoManual = this.artefato.icInclusaoManual;

    var disableCoSistema: boolean = false;

    this.formArtefato = new FormGroup(
      {
        'noNomeArtefato': new FormControl({ value: this.artefato.noNomeArtefato, disabled: true }),
        'noNomeExibicao': new FormControl({ value: this.artefato.noNomeExibicao, disabled: false }),
        'noNomeInterno': new FormControl({ value: this.artefato.noNomeInterno, disabled: true }),
        'coTipoArtefato': new FormControl({ value: this.artefato.tipoArtefato.coTipo, disabled: false }),
        'coAmbiente': new FormControl({ value: this.artefato.coAmbiente, disabled: false }),
        'coSistema': new FormControl({ value: this.artefato.coSistema, disabled: false }),
        'deDescricaoArtefato': new FormControl({ value: this.artefato.deDescricaoArtefato, disabled: true }),
        'deDescricaoUsuario': new FormControl({ value: this.artefato.deDescricaoUsuario, disabled: false }),
        'icInclusaoManual': new FormControl({ value: this.artefato.icInclusaoManual, disabled: false }),
        'icProcessoCritico': new FormControl({ value: this.artefato.icProcessoCritico, disabled: false }),
      }
    )
  }

  onCancelar() {
    this._initFormArtefato();
    this.checkedProcessoCritico = this.artefato.icProcessoCritico;
  }

  onSubmit() {
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
        this.statusAtualizacao = "Erro ao atualizar artefato."
       },
      () => { this.isLoading = false; }
    )
  }
}
