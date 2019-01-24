import { Component, OnInit } from '@angular/core';
import { AppService } from '../../servicos/app.service';
import { LoggerService } from '../../servicos/logger.service';
import { ArtefatoService } from '../../servicos/artefato.service';

import { Subject, Observable, of } from 'rxjs';
import { Artefato } from '../../modelos/artefato.model';
import { debounceTime, distinctUntilChanged, map, startWith, skipWhile } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import 'rxjs';

export class Resultado {
  coTipoArtefato: String;
  noNomeArtefato: String[];
}


export const _filter = (opt: String[], value: String): String[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  pesquisaRapidaForm: FormGroup = this.fb.group({
    grupoArtefato: '',
  });

  resultados: Resultado[] = [];

  mapArtefatoOptions: Map<String, String[]> = new Map();
  listaResultadoOptions: Observable<Resultado[]>;

  constructor(private appService: AppService, private artefatoService: ArtefatoService, private logger: LoggerService, private fb: FormBuilder) {
  }


  _pesquisar(termo: string): void {

    this.artefatoService.pesquisarRapida(termo).subscribe(
      (artefatos: Artefato[]) => {
        this.mapArtefatoOptions.clear();
        artefatos.forEach(artefato => {
          if (this.mapArtefatoOptions.has(artefato.tipoArtefato.coTipoArtefato)) {
            this.mapArtefatoOptions.get(artefato.tipoArtefato.coTipoArtefato).push(artefato.noNomeExibicao);
          } else {
            this.mapArtefatoOptions.set(artefato.tipoArtefato.coTipoArtefato, [artefato.noNomeExibicao]);
          }
        });
        this.resultados = [];
        this.mapArtefatoOptions.forEach((valor, chave) => {

          var resultado: Resultado = new Resultado();
          resultado.coTipoArtefato = chave;
          resultado.noNomeArtefato = valor;

          this.resultados.push(resultado);
        });
        this.listaResultadoOptions = of(this.resultados);
      },
      (erro: Artefato[]) => {
        this.resultados = [];
        this.listaResultadoOptions = of();
      }
    );
  }

  ngOnInit() {
    this.pesquisaRapidaForm.get('grupoArtefato')!.valueChanges.pipe(
      startWith(''),
      skipWhile((termo: string) => termo.length < 4),
      map((termo) => {
        this._pesquisar(termo);
      })
    ).subscribe();
    ;
  }
}
