import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AppService } from 'src/app/shared/servicos/app.service';
import { LoggerService } from 'src/app/shared/servicos/logger.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-artefato-incluir-relacionamento',
  templateUrl: './artefato-incluir-relacionamento.component.html',
  styleUrls: ['./artefato-incluir-relacionamento.component.css']
})
export class ArtefatoIncluirRelacionamentoComponent implements OnInit, OnDestroy {

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

  constructor(
    private appService: AppService,
    private loggerService: LoggerService,
    public dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit() { }

  ngOnDestroy() { }

}
