import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../shared/servicos/app.service';
import { LoggerService } from '../shared/servicos/logger.service';
import { ArtefatoService } from '../shared/servicos/artefato.service';
import { TipoService } from '../shared/servicos/tipo.service';
import { Observable, of } from 'rxjs';
import { Tipo } from '../shared/modelos/tipo.model';
import { Pesquisa } from '../shared/modelos/pesquisa.model';
import { PesquisaService } from '../shared/servicos/pesquisa.service';
import { ArtefatoView } from '../shared/modelos/artefato-view.model.';

@Component({
    selector: 'app-pesquisa-avancada',
    templateUrl: './pesquisa-avancada.component.html',
    styleUrls: ['./pesquisa-avancada.component.css']
})
export class PesquisaAvancadaComponent implements OnInit {
    formPesquisaAvancada: FormGroup;
    submitted = false;

    checkedProcessoCritico: boolean = false;
    checkedInterface: boolean = false;

    listaTipos: Observable<Tipo[]>;
    listaTiposSelecionados: string[] = [];

    listaResultado: Observable<ArtefatoView[]>;

    constructor(private appService: AppService,
        private loogerService: LoggerService,
        private pesquisaService: PesquisaService,
        private tipoService: TipoService,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.tipoService.getListaTipo('ARTEFATO').subscribe(
            (tiposArtefato) => {
                this.listaTipos = of(tiposArtefato.filter(p => p.icPesquisavel == true));
            }
        );
        this._initFormPesquisaAvancada();
    }

    _initFormPesquisaAvancada() {
        this.formPesquisaAvancada = this.formBuilder.group({
            expNome: null,
            expDescricao: null
        });
    }

    onTipoSelecionado(input: any) {
        var i = this.listaTiposSelecionados.indexOf(input.value);

        this.loogerService.log("(Pesquisa Avançada) Index de " + input.value + " no array Tipos Secionados : " + i);
        if (i == -1) {
            this.loogerService.log("(Pesquisa Avançada) Incluindo " + input.value + " no array Tipos Secionados")
            this.listaTiposSelecionados.push(input.value);
        } else {
            this.loogerService.log("(Pesquisa Avançada) Excluindo " + input.value + " no array Tipos Secionados")
            this.listaTiposSelecionados.splice(i, 1)
        }

        console.log(this.listaTiposSelecionados);
    }

    onSubmit() {
        var formValue = this.formPesquisaAvancada.value;

        var pesquisa: Pesquisa = new Pesquisa();

        pesquisa.expNome = formValue.expNome;
        pesquisa.expDescricao = formValue.expDescricao;
        pesquisa.listaTipoArtefato = this.listaTiposSelecionados;
        pesquisa.icInterface = this.checkedInterface;
        pesquisa.icProcessoCritico = this.checkedProcessoCritico;


        this.pesquisaService.pesquisaAvancada(pesquisa).subscribe(
            (results: ArtefatoView[] ) => {
                this.listaResultado = of(results);
            }
        );


    }

}
