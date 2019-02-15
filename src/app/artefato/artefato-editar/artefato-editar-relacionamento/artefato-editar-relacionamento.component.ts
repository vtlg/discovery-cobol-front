import { Component, OnInit } from '@angular/core';
import { AppService, SwitchRelacionamento } from 'src/app/shared/servicos/app.service';
import { ActivatedRoute, Params } from '@angular/router';
import { LoggerService } from 'src/app/shared/servicos/logger.service';
import { ArtefatoService } from 'src/app/shared/servicos/artefato.service';
import { Artefato } from 'src/app/shared/modelos/artefato.model';
import { Relacionamento } from 'src/app/shared/modelos/relacionamento.model';
import { Observable, of } from 'rxjs';
import { Tipo } from 'src/app/shared/modelos/tipo.model';
import { RelacionamentoService } from 'src/app/shared/servicos/relacionamento.service';


class RelacionamentoCard {
  coRelacionamento: number;
  icInclusaoManual: boolean;
  icInclusaoMalha: boolean;
  coTipoRelacionamentoAnterior: string;
  coTipoRelacionamentoAtual: string;
  descendente: Artefato;
  ascendente: Artefato;
}

@Component({
  selector: 'app-artefato-editar-relacionamento',
  templateUrl: './artefato-editar-relacionamento.component.html',
  styleUrls: ['./artefato-editar-relacionamento.component.css']
})
export class ArtefatoEditarRelacionamentoComponent implements OnInit {

  height: number;
  width: number;
  larguraContainer: number = 710;
  isLoading: boolean = false;

  artefato: Artefato;
  statusAtualizacao: string;

  coArtefato: number;

  exibirAscendentes: boolean = true;
  exibirDescendentes: boolean = true;

  tiposRelacionamento: { coTipo: string, deTipo: string }[] =
    [{ coTipo: 'INTERFACE', deTipo: 'Interface (Relacionamento entre sistemas diferentes)' }, { coTipo: 'CONTROL-M', deTipo: 'Control-M (Relacionamento originado da malha de execução do Control-M)' }, { coTipo: 'NORMAL', deTipo: 'Normal' }, { coTipo: 'DESATIVADO', deTipo: 'Desativado (O relacionamento não será exibido no grafo)' },]

  listaRelacionamentos: RelacionamentoCard[] = [];
  listaRelacionamentos$: Observable<RelacionamentoCard[]>;

  constructor(private appService: AppService, private loggerService: LoggerService, private artefatoService: ArtefatoService,
    private route: ActivatedRoute, private relacionamentoService: RelacionamentoService) {

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
          this.coArtefato = coArtefato;
          this._getListaRelacionamentos(coArtefato);
        }
      }
    );


    this.appService.subjectArtefatoEditarRefresh.subscribe(
      ( coArtefato: number) => {

        if (coArtefato) {
          this.coArtefato = coArtefato;
          this._getListaRelacionamentos(coArtefato);
        }

      }
    )

    this.appService.subjectArtefatoEditarExibirSwitch.subscribe(
      ( result: SwitchRelacionamento) => {
        this.exibirAscendentes = result.exibirAscendentes;
        this.exibirDescendentes = result.exibirDescendentes;

        this._getListaRelacionamentos(this.coArtefato);
      }
    )
  }

  _getListaRelacionamentos(coArtefato: number) {
    this.artefatoService.getArtefatoRelacionamento(coArtefato).subscribe(
      (artefato: Artefato) => {
        this.listaRelacionamentos = [];
        this.artefato = new Artefato();
        this.artefato.inicializar(artefato);

        if (this.artefato.descendentes && this.exibirDescendentes) {
          this.artefato.descendentes.forEach(r => {
            var card: RelacionamentoCard = new RelacionamentoCard();
            card.coRelacionamento = r.coRelacionamento;
            card.ascendente = r.ascendente;
            card.descendente = r.descendente;
            card.coTipoRelacionamentoAnterior = r.tipoRelacionamento.coTipo;
            card.coTipoRelacionamentoAtual = r.tipoRelacionamento.coTipo;
            card.icInclusaoMalha = r.icInclusaoMalha;
            card.icInclusaoManual = r.icInclusaoManual;
            this.listaRelacionamentos.push(card);
          });
        }
        if (this.artefato.ascendentes && this.exibirAscendentes) {
          this.artefato.ascendentes.forEach(r => {
            var card: RelacionamentoCard = new RelacionamentoCard();
            card.coRelacionamento = r.coRelacionamento;
            card.ascendente = r.ascendente;
            card.descendente = r.descendente;
            card.coTipoRelacionamentoAnterior = r.tipoRelacionamento.coTipo;
            card.coTipoRelacionamentoAtual = r.tipoRelacionamento.coTipo;
            card.icInclusaoMalha = r.icInclusaoMalha;
            card.icInclusaoManual = r.icInclusaoManual;
            this.listaRelacionamentos.push(card);
          });
        }
        this.listaRelacionamentos$ = of(this.listaRelacionamentos);
      },
      (error: any) => {
        this.loggerService.error(error)
      },
      () => {
      }
    )
  }


  onTipoRelacionamentoChange(f, relacionamentoCard: RelacionamentoCard) {
    if (confirm("Tem certeza que deseja alterar o tipo do relacionamento? ")) {

      var relacionamento: Relacionamento = new Relacionamento;
      relacionamento.coRelacionamento = relacionamentoCard.coRelacionamento;
      relacionamento.ascendente = relacionamentoCard.ascendente;
      relacionamento.descendente = relacionamentoCard.descendente;
      relacionamento.tipoRelacionamento = new Tipo();
      relacionamento.tipoRelacionamento.coTipo = relacionamentoCard.coTipoRelacionamentoAtual

      this.relacionamentoService.atualizar(relacionamento).subscribe(
        (result: Relacionamento) => {
          relacionamentoCard.coTipoRelacionamentoAnterior = relacionamentoCard.coTipoRelacionamentoAtual;
        },
        (error: any) => {
          relacionamentoCard.coTipoRelacionamentoAtual = relacionamentoCard.coTipoRelacionamentoAnterior;
          f.value = relacionamentoCard.coTipoRelacionamentoAnterior;
        }
      );

    } else {
      relacionamentoCard.coTipoRelacionamentoAtual = relacionamentoCard.coTipoRelacionamentoAnterior;
      f.value = relacionamentoCard.coTipoRelacionamentoAnterior;
    }
  }

}
