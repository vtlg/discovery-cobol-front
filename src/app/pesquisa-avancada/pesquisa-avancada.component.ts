import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../shared/servicos/app.service';
import { LoggerService } from '../shared/servicos/logger.service';
import { Observable, of } from 'rxjs';
import { Tipo } from '../shared/modelos/tipo.model';
import { Pesquisa } from '../shared/modelos/pesquisa.model';
import { PesquisaService } from '../shared/servicos/pesquisa.service';
import { ArtefatoView } from '../shared/modelos/artefato-view.model.';
import { Sistema } from '../shared/modelos/sistema.model';
import { SistemaService } from '../shared/servicos/sistema.service';
import { TipoService } from '../shared/servicos/tipo.service';
import { filter } from 'rxjs/operators';

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

    listaTipos$: Observable<Tipo[]>;
    listaTiposSelecionados: string[] = [];

    listaSistemas$: Observable<Sistema[]>;
    listaSistemasSelecionados: string[] = [];

    pesquisaAnterior: Pesquisa;
    listaResultado: ArtefatoView[];
    listaResultado$: Observable<ArtefatoView[]>;

    offset: number = 0;

    height: number;
    width: number;
    larguraContainer: number = 830;

    isLoading: boolean = false;
    isPaginar: boolean = false;

    constructor(private appService: AppService,
        private loogerService: LoggerService,
        private tipoService: TipoService,
        private pesquisaService: PesquisaService,
        private sistemaService: SistemaService,
        private formBuilder: FormBuilder) {

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

        this.sistemaService.getListaSistema().subscribe(
            (sistemas) => {
                this.listaSistemas$ = of(sistemas);
                this.listaSistemasSelecionados = sistemas.map(o => { return o.coSistema; });
            }
        );

        this.tipoService.getListaTipo('ARTEFATO')
        .subscribe(
            (results: Tipo[]) => {
                this.listaTipos$ = of(results.filter( o => o.icPesquisavel));
                this.listaTiposSelecionados = results.filter( o => o.icPesquisavel).map(o => { return o.coTipo; });
            }
        )

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
    }

    onSistemaSelecionado(input: any) {
        var i = this.listaSistemasSelecionados.indexOf(input.value);

        this.loogerService.log("(Pesquisa Avançada) Index de " + input.value + " no array Sistemas Secionados : " + i);
        if (i == -1) {
            this.loogerService.log("(Pesquisa Avançada) Incluindo " + input.value + " no array Sistemas Secionados")
            this.listaSistemasSelecionados.push(input.value);
        } else {
            this.loogerService.log("(Pesquisa Avançada) Excluindo " + input.value + " no array Sistemas Secionados")
            this.listaSistemasSelecionados.splice(i, 1)
        }
    }

    onSubmit() {
        var formValue = this.formPesquisaAvancada.value;
        this.pesquisaAnterior = new Pesquisa();

        this.pesquisaAnterior.expNome = formValue.expNome;
        this.pesquisaAnterior.expDescricao = formValue.expDescricao;
        this.pesquisaAnterior.listaTipoArtefato = this.listaTiposSelecionados;
        this.pesquisaAnterior.listaSistema = this.listaSistemasSelecionados;
        this.pesquisaAnterior.icInterface = this.checkedInterface;
        this.pesquisaAnterior.icProcessoCritico = this.checkedProcessoCritico;

        this.offset = 0;
        this.isLoading = true;
        this.listaResultado = [];
        this.listaResultado$ = of(this.listaResultado);
        this.pesquisaService.pesquisaAvancada(this.pesquisaAnterior, this.offset).subscribe(
            (results: ArtefatoView[]) => {
                this.listaResultado = results;
                this.listaResultado$ = of(this.listaResultado);
                this.offset += this.appService.limitResultadoQuery;

                if (results && results.length >= this.appService.limitResultadoQuery) {
                    this.isPaginar = true;
                } else {
                    this.isPaginar = false;
                }
            },
            (error) => {
                this.isLoading = false;
                this.isPaginar = false;
            },
            () => {
                this.isLoading = false;
            }
        );
    }

    onPaginar() {
        this.isLoading = true;
        this.pesquisaService.pesquisaAvancada(this.pesquisaAnterior, this.offset).subscribe(
            (results: ArtefatoView[]) => {
                this.listaResultado = this.listaResultado.concat(results);
                this.listaResultado$ = of(this.listaResultado);
                this.offset += this.appService.limitResultadoQuery;

                if (results && results.length >= this.appService.limitResultadoQuery) {
                    this.isPaginar = true;
                } else {
                    this.isPaginar = false;
                }
            },
            (error) => { },
            () => {
                this.isLoading = false;
            }
        );
    }

}
