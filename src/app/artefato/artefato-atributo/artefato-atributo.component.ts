import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/shared/servicos/app.service';
import { ActivatedRoute, Params } from '@angular/router';
import { LoggerService } from 'src/app/shared/servicos/logger.service';
import { ArtefatoService } from 'src/app/shared/servicos/artefato.service';
import { Artefato } from 'src/app/shared/modelos/artefato.model';

@Component({
  selector: 'app-artefato-atributo',
  templateUrl: './artefato-atributo.component.html',
  styleUrls: ['./artefato-atributo.component.css']
})
export class ArtefatoAtributoComponent implements OnInit {

  @Input("coArtefato") coArtefato: number;

  artefato: Artefato;

  constructor(private appService: AppService, private loggerService: LoggerService, private artefatoService: ArtefatoService,
    private route: ActivatedRoute) {}

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        var coArtefato: number = params['coArtefato'];
        if (coArtefato) {
          this.artefatoService.getArtefato(coArtefato).subscribe(
            (artefato: Artefato) => {
              this.artefato = new Artefato();
              this.artefato.inicializar(artefato);
            },
            (error: any) => {
              console.log(error)
            },
            () => {
            }
          )
        }
      }
    );
  }

}
