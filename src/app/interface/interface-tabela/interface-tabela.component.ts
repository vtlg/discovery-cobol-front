import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/shared/servicos/app.service';
import { RelacionamentoService } from 'src/app/shared/servicos/relacionamento.service';
import { InterfaceSistema } from 'src/app/shared/modelos/interface-sistema.model';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-interface-tabela',
  templateUrl: './interface-tabela.component.html',
  styleUrls: ['./interface-tabela.component.css']
})
export class InterfaceTabelaComponent implements OnInit {

  height: number;
  width: number;
  larguraContainer: number = 900;

  inputFiltroSistemaOrigem: string = '';
  inputFiltroSistemaDestino: string = '';
  inputFiltroRotina: string = '';

  listaInterfaceSistema$: Observable<InterfaceSistema[]>;
  listaInterfaceSistemaCompleta: InterfaceSistema[] = [];

  listaSistemas: string [];
  listaSistemas$: Observable<string> [];

  constructor(private appService: AppService, private relacionamentoService: RelacionamentoService) {

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
    this.relacionamentoService.getInterfaceTabela().subscribe(
      (data: InterfaceSistema[]) => {
        this.listaInterfaceSistemaCompleta = data;
        this.listaInterfaceSistema$ = of(data);


        this.listaSistemas = this.listaInterfaceSistemaCompleta.map( p => {  return p.coSistema;  }  );

      }
    )
  }

  onFiltrar(input: any) {

    if (this.listaInterfaceSistemaCompleta) {
      var novaListaFiltro = this.listaInterfaceSistemaCompleta.slice().filter((obj) => {
        var isFiltroSistemaOrigem: boolean = false;
        var isFiltroSistemaDestino: boolean = false;
        var isFiltroRotina: boolean = false;

        if (this.inputFiltroSistemaOrigem && this.inputFiltroSistemaOrigem.trim().length > 0) {
          var texto: string = obj['coSistema']
          this.inputFiltroSistemaOrigem.slice().split(';').forEach(
            f => {
              if (f && f.trim().length > 0 && texto.trim().toUpperCase().includes(f.trim().toUpperCase())) {
                isFiltroSistemaOrigem = true;
                return 0;
              }
            }
          )
        } else {
          isFiltroSistemaOrigem = true;
        }


        if (this.inputFiltroSistemaDestino && this.inputFiltroSistemaDestino.trim().length > 0) {
          var texto: string = obj['coSistemaDestino'];

          if (!texto || texto.trim().length == 0) {
            texto = obj['coSistemaPai'];
          }

          this.inputFiltroSistemaDestino.slice().split(';').forEach(
            f => {
              if (f && f.trim().length > 0 && (
                ( texto && texto.trim().toUpperCase().includes(f.trim().toUpperCase())) 
//                ( texto2 &&  texto2.trim().toUpperCase().includes(f.trim().toUpperCase()))
              )
              ) {
                isFiltroSistemaDestino = true;
                return 0;
              }
            }
          )
        } else {
          isFiltroSistemaDestino = true;
        }

        if (this.inputFiltroRotina && this.inputFiltroRotina.trim().length > 0) {
          var texto: string = obj['noNomeExibicao'];
          var texto2: string = obj['noNomeExibicaoPai'];
          //var texto3: string = obj['coTipoArtefato'];
          //var texto4: string = obj['coTipoArtefatoPai'];

          this.inputFiltroRotina.slice().split(';').forEach(
            f => {
              if (f && f.trim().length > 0 && (
                ( texto && texto.trim().toUpperCase().includes(f.trim().toUpperCase())) || 
                ( texto2 &&  texto2.trim().toUpperCase().includes(f.trim().toUpperCase()))
//                ( texto3 &&  texto3.trim().toUpperCase().includes(f.trim().toUpperCase())) ||
//                ( texto4 &&  texto4.trim().toUpperCase().includes(f.trim().toUpperCase()))
              )
              ) {
                isFiltroRotina = true;
                return 0;
              }
            }
          )
        } else {
          isFiltroRotina = true;
        }


        if (isFiltroSistemaOrigem && isFiltroSistemaDestino && isFiltroRotina) {
          return true;
        } else {
          return false;
        }
      });

      this.listaInterfaceSistema$ = of(novaListaFiltro);

    }

  }

}
