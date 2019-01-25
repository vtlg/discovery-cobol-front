import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { AppService } from 'src/app/shared/servicos/app.service';
import { ArtefatoService } from 'src/app/shared/servicos/artefato.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Artefato } from 'src/app/shared/modelos/artefato.model';

@Component({
  selector: 'app-artefato-visualizar',
  templateUrl: './artefato-visualizar.component.html',
  styleUrls: ['./artefato-visualizar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ArtefatoVisualizarComponent implements OnInit {

  artefato: Artefato;
  artefatoGrafo: Artefato;


  windowHeight: number = 0;
  windowWidth: number = 0;
  alturaSideBar = "100%";
  isSideBarVisible: boolean = true;

  constructor(
    private appService: AppService,
    private artefatoService: ArtefatoService,
    private router: Router,
    private route: ActivatedRoute,
    private el: ElementRef
  ) {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
    this.alturaSideBar = (this.windowHeight - 64) + 'px'

  }

  ngOnInit() {

    this.appService.subjectWindowResize.subscribe(
      (obj: any) => {
        this.windowHeight = obj.height;
        this.windowWidth = obj.width;
        this.alturaSideBar = (this.windowHeight - 64) + 'px'
        this._validacaoLarguraJanela();
      }
    );

    this.route.params.subscribe(
      (parametros: any) => {
        if (parametros['coArtefato'] && +parametros['coArtefato'] && parametros['coArtefato'] != 0) {
          this.artefatoService.getArtefatoRelacionamento(+parametros['coArtefato']).subscribe(
            (artefato: Artefato) => {
              this.artefato = artefato;
              this.artefatoGrafo = artefato;
            }
          )
        }
      }
    )
  }

  private _validacaoLarguraJanela() {
    if (this.windowWidth < 993) {
      this.isSideBarVisible = false;
    } else {
      this.isSideBarVisible = true;
    }
  }

  detalharArtefato(coArtefato: number) {
    if (coArtefato != this.artefato.coArtefato) {
      this.artefatoService.getArtefato(coArtefato)
        .subscribe(
          (artefato: Artefato) => {
            this.artefato = artefato;
          }
        );
    }
  }

}
