import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/shared/servicos/app.service';
import { TipoService } from 'src/app/shared/servicos/tipo.service';
import { Tipo } from 'src/app/shared/modelos/tipo.model';
import { Observable, of } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-artefato-diagrama-filtrar',
  templateUrl: './artefato-diagrama-filtrar.component.html',
  styleUrls: ['./artefato-diagrama-filtrar.component.css']
})
export class ArtefatoDiagramaFiltrarComponent implements OnInit {

  listaTipos$: Observable<Tipo[]>;
  matrizTipos: Tipo[] = [];
  listaTiposSelecionados: string[] = [];

  checkCopybook: boolean = false;
  checkProgramaCobol: boolean = false;
  checkTabela: boolean = false;
  checkJcl: boolean = false;
  checkJclStep: boolean = false;
  checkDsn: boolean = false;
  checkDdname: boolean = false;
  checkFileDescription: boolean = false;
  checkUtilitario: boolean = false;
  checkTabelaCampo: boolean = false;
  checkCicsTransaction: boolean = false;

  constructor(
    private appService: AppService,
    private tipoService: TipoService,
    public dialogRef: MatDialogRef<ArtefatoDiagramaFiltrarComponent>,
    @Inject(MAT_DIALOG_DATA) public listaTiposFiltroAplicado: string[]) { }

  ngOnInit() {
    this.listaTiposSelecionados = [];

    this.tipoService.getListaTipo().subscribe(
      (tipos: Tipo[]) => {
        this.listaTipos$ = of(tipos.filter(o => o.icExibirGrafo && o.coTabela == 'ARTEFATO'));
      }
    )

    this.listaTiposFiltroAplicado.forEach(strTipo => {
      switch (strTipo) {
        case 'COPYBOOK': { this.checkCopybook = true; break; }
        case 'PROGRAMA-COBOL': { this.checkProgramaCobol = true; break; }
        case 'TABELA': { this.checkTabela = true; break; }
        case 'JCL': { this.checkJcl = true; break; }
        case 'JCL-STEP': { this.checkJclStep = true; break; }
        case 'DSN': { this.checkDsn = true; break; }
        case 'DDNAME': { this.checkDdname = true; break; }
        case 'FILE-DESCRIPTION': { this.checkFileDescription = true; break; }
        case 'UTILITARIO': { this.checkUtilitario = true; break; }
        case 'TABELA-CAMPO': { this.checkTabelaCampo = true; break; }
        case 'CICS-TRANSACTION': { this.checkCicsTransaction = true; break; }
      }
    }
    )
  }

  onAplicar() {
    this.listaTiposSelecionados = [];
    if (this.checkCopybook) {   this.listaTiposSelecionados.push('COPYBOOK');         }
    if (this.checkProgramaCobol) {   this.listaTiposSelecionados.push('PROGRAMA-COBOL');         }
    if (this.checkTabela) {   this.listaTiposSelecionados.push('TABELA');         }
    if (this.checkJcl) {   this.listaTiposSelecionados.push('JCL');         }
    if (this.checkJclStep) {   this.listaTiposSelecionados.push('JCL-STEP');         }
    if (this.checkDsn) {   this.listaTiposSelecionados.push('DSN');         }
    if (this.checkDdname) {   this.listaTiposSelecionados.push('DDNAME');         }
    if (this.checkFileDescription) {   this.listaTiposSelecionados.push('FILE-DESCRIPTION');         }
    if (this.checkUtilitario) {   this.listaTiposSelecionados.push('UTILITARIO');         }
    if (this.checkTabelaCampo) {   this.listaTiposSelecionados.push('TABELA-CAMPO');         }
    if (this.checkCicsTransaction) {   this.listaTiposSelecionados.push('CICS-TRANSACTION');         }

    this.dialogRef.close(this.listaTiposSelecionados);
  }

  onCancelar() {
    this.dialogRef.close();
  }

  onCheckTipo(f: any): boolean {
    if (this.listaTiposSelecionados.find(p => f.value)) {
      return true;
    }
    return false;
  }

  onTipoSelecionado(input: any) {
    var i = this.listaTiposSelecionados.indexOf(input.value);

    if (i == -1) {
      this.listaTiposSelecionados.push(input.value);
    } else {
      this.listaTiposSelecionados.splice(i, 1)
    }
  }
}
