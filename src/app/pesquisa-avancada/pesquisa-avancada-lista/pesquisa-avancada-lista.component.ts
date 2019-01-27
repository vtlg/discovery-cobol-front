import { Component, OnInit, Input } from '@angular/core';
import { ArtefatoView } from 'src/app/shared/modelos/artefato-view.model.';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pesquisa-avancada-lista',
  templateUrl: './pesquisa-avancada-lista.component.html',
  styleUrls: ['./pesquisa-avancada-lista.component.css']
})
export class PesquisaAvancadaListaComponent implements OnInit {

  @Input() listaResultado: Observable<ArtefatoView[]>

  constructor() { }

  ngOnInit() {
  }

}
