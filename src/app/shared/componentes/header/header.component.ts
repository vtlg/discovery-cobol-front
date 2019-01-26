import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { AppService } from '../../servicos/app.service';
import { LoggerService } from '../../servicos/logger.service';
import { ArtefatoService } from '../../servicos/artefato.service';

import { Subject, Observable, of } from 'rxjs';
import { Artefato } from '../../modelos/artefato.model';
import { debounceTime, distinctUntilChanged, skipWhile, map } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {


  //pesquisaRapidaForm: FormGroup = this.fb.group({grupoArtefato: '',});
  formPesquisaRapida: FormGroup = this.fb.group({ termPesquisaRapida: new FormControl(null) });

  resultados: Observable<Artefato[]>;
  exibirLista: boolean = false;

  constructor(private appService: AppService, private artefatoService: ArtefatoService, private logger: LoggerService, private fb: FormBuilder, private elRef: ElementRef) {
  }

  ngOnInit() {
    this.formPesquisaRapida.get('termPesquisaRapida').valueChanges.pipe(
      skipWhile((termo: string) => termo.length < 4),
      debounceTime(1000),
      distinctUntilChanged(),
      map((termo) => {
        this._pesquisar(termo);
      })
    ).subscribe();

  }

  private _pesquisar(termo: string): void {
    this.artefatoService.pesquisarRapida(termo)
      .subscribe(
        (artefatos: Artefato[]) => {
          this.exibirLista = true;
          this.resultados = of(artefatos);
        }
      )
  }

  @HostListener('document:click', ['$event'])
  onMouseClick(event) {
    if (this.elRef.nativeElement.contains(event.target)) {
      var id: string = event.target.id;
      if (id.startsWith('FORM-PESQUISA-RAPIDA')) {
        this.exibirLista = true;
      }
      if (!id.startsWith('FORM-PESQUISA-RAPIDA')) {
        this.exibirLista = false;
      }
    } else {
      this.exibirLista = false;
    }
  }


}
