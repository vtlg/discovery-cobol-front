import { Component, OnInit } from '@angular/core';
import { AppService, SwitchRelacionamento } from 'src/app/shared/servicos/app.service';
import { LoggerService } from 'src/app/shared/servicos/logger.service';
import { ArtefatoService } from 'src/app/shared/servicos/artefato.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ArtefatoIncluirRelacionamentoComponent } from './artefato-incluir-relacionamento/artefato-incluir-relacionamento.component';


@Component({
  selector: 'app-artefato-editar',
  templateUrl: './artefato-editar.component.html',
  styleUrls: ['./artefato-editar.component.css']
})
export class ArtefatoEditarComponent implements OnInit {

  height: number;
  width: number;
  larguraContainer: number = 710;
  isLoading: boolean = false;


  ascendenteCheck: boolean = true;
  descendenteCheck: boolean = true;


  constructor(private appService: AppService, private loggerService: LoggerService, private artefatoService: ArtefatoService,
    public dialog: MatDialog,
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

  ngOnInit(){}

  onSwitch(checkbox: string) {
    if (checkbox == 'ASCENDENTE') {
      this.ascendenteCheck = !this.ascendenteCheck;
    }

    if (checkbox == 'DESCENDENTE') {
      this.descendenteCheck = !this.descendenteCheck;
    }


    var send: SwitchRelacionamento = new SwitchRelacionamento();
    send.exibirAscendentes = this.ascendenteCheck;
    send.exibirDescendentes = this.descendenteCheck;

    this.appService.subjectArtefatoEditarExibirSwitch.next(send);

  }

  openDialogIncluirRelacionamento(): void {
    const dialogRef = this.dialog.open(ArtefatoIncluirRelacionamentoComponent, {
      width: '500px',
      data: null,
    });

    dialogRef.afterClosed().subscribe(
      (result: string[]) => {
      if (result) {
      }
    });
  }

}
