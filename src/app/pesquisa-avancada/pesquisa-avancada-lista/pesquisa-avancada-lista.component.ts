import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Artefato } from 'src/app/shared/modelos/artefato.model';

@Component({
  selector: 'app-pesquisa-avancada-lista',
  templateUrl: './pesquisa-avancada-lista.component.html',
  styleUrls: ['./pesquisa-avancada-lista.component.css']
})
export class PesquisaAvancadaListaComponent implements OnInit {

  @Input() listaResultado: Observable<Artefato[]>

  constructor() { }

  ngOnInit() {
  }

}
