import { Component, OnInit, OnDestroy, Input, ElementRef, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { Artefato } from 'src/app/shared/modelos/artefato.model';
import { AppService } from 'src/app/shared/servicos/app.service';
import { ArtefatoService } from 'src/app/shared/servicos/artefato.service';
import { LoggerService } from 'src/app/shared/servicos/logger.service';
import * as d3 from "d3";
import { Relacionamento } from 'src/app/shared/modelos/relacionamento.model';
import { TipoService } from 'src/app/shared/servicos/tipo.service';
import { Tipo } from 'src/app/shared/modelos/tipo.model';
import { Node } from 'src/app/shared/modelos/diagrama-tree.model';
import { Observable, of } from 'rxjs';
import { Atributo } from 'src/app/shared/modelos/atributo.model';

import { MatDialog } from '@angular/material';
import { ArtefatoDiagramaAjudaComponent } from '../artefato-diagrama-ajuda/artefato-diagrama-ajuda.component';
import { ArtefatoDiagramaFiltrarComponent } from '../artefato-diagrama-filtrar/artefato-diagrama-filtrar.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-artefato-diagrama-tree',
  templateUrl: './artefato-diagrama-tree.component.html',
  styleUrls: ['./artefato-diagrama-tree.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ArtefatoDiagramaTreeComponent implements OnInit, OnDestroy {

  /*
   * MODAL AJUDA E FILTRO
   */

  openDialogAjuda(): void {
    const dialogRef = this.dialog.open(ArtefatoDiagramaAjudaComponent, {
      width: '500px'
    });
  }

  openDialogFiltrar(): void {
    const dialogRef = this.dialog.open(ArtefatoDiagramaFiltrarComponent, {
      width: '500px',
      data: this.listaTipoFiltroAplicado,
    });

    dialogRef.afterClosed().subscribe(
      (result: string[]) => {
      //this.listaTipoFiltroAplicado = [];
      if (result) {
        this.isFiltroAplicado = true;
        this.listaTipoFiltroAplicado = result.slice();
        //this.initDiagrama();
        this.artefatoGrafo = this.artefato;
      }
    });
  }
  /*
   * INÍCIO LÓGICA DO GRAFO
   */

  private artefato: Artefato;

  private scrollX: number = 0;
  private scrollY: number = 0;
  private windowWidth: number = 0;
  private windowHeight: number = 0;
  private isSidebarVisible: boolean = true;

  height;
  diagramaHeight: number;
  width;
  margin: { top: number, right: number, bottom: number, left: number };
  i: number = 0;
  duration: number;
  orientacao: string = 'DESCENDENTE';
  listaTipoFiltroAplicado: string[] = [];
  listaTipo: Tipo[] = this.appService.listaTipo;
  listaTipo$: Observable<Tipo[]>;
  relacionamentoOriginal: Relacionamento = new Relacionamento();
  @Output("artefatoSelecionadoDiagrama") artefatoSelecionado: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  set artefatoGrafo(val: Artefato) {
    //this.loggerService.log("Recebendo artefato para criar diagrama. Orientação " + this.orientacao)
    //this.loggerService.log(val)
    this.artefato = new Artefato();
    this.artefato.inicializar(val);

    var relacionamentoSemPaiOuSemFilho: Relacionamento = new Relacionamento();

    this.ordernarRelacionamento(this.artefato);

    if (this.orientacao == 'DESCENDENTE') {
      relacionamentoSemPaiOuSemFilho.descendente = new Artefato;
      relacionamentoSemPaiOuSemFilho.descendente.inicializar(this.artefato);
      relacionamentoSemPaiOuSemFilho.coRelacionamento = 0;
    } else {
      relacionamentoSemPaiOuSemFilho.ascendente = new Artefato;
      relacionamentoSemPaiOuSemFilho.ascendente.inicializar(this.artefato);
      relacionamentoSemPaiOuSemFilho.coRelacionamento = 0;
    }

    this.initParametrosDiagrama();
    this.node_data = this.converterRelacionamento2Node(relacionamentoSemPaiOuSemFilho, null);
    //this.node_data = this.converterArtefato2Node(this.artefato, null);
    this.initDiagrama();
  }

  isFiltroAplicado: boolean = false;

  get artefatoGrafo(): Artefato { return this.artefato; }

  constructor(
    private appService: AppService,
    private artefatoService: ArtefatoService,
    private loggerService: LoggerService,
    private tipoService: TipoService,
    public dialog: MatDialog,
    private router: Router
  ) {

    this.windowHeight = window.innerHeight; //altura inicial da janela
    this.windowWidth = window.innerWidth; //largura inicial da janela

    this.tipoService.getListaTipo().subscribe(
      (tipos: Tipo[]) => {
        this.listaTipo$ = of(tipos.filter(o => o.icExibirGrafo));
        this.listaTipoFiltroAplicado = tipos.filter(o => o.icExibirGrafo).map(o => o.coTipo);
        this.listaTipo = tipos;
      }
    )

    // Verifica alterações no Scroll da janela
    this.appService.subjectWindowScroll.subscribe(
      (obj: { x: number, y: number }) => {
        this.scrollX = obj.x;
        this.scrollY = obj.y;
      }
    );

    // Verifica alterações no tamanho da janela
    this.appService.subjectWindowResize.subscribe(
      (obj: { height: number, width: number }) => {
        this.windowWidth = obj.width;
        this.windowHeight = obj.height;
      }
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() { }


  onInverterOrientacao() {
    var relacionamentoSemPaiOuSemFilho: Relacionamento = new Relacionamento();

    if (this.orientacao == 'DESCENDENTE') {
      this.orientacao = 'ASCENDENTE';
      relacionamentoSemPaiOuSemFilho.ascendente = new Artefato();
      relacionamentoSemPaiOuSemFilho.ascendente.inicializar(this.artefato);
      relacionamentoSemPaiOuSemFilho.coRelacionamento = 0;
    } else {
      this.orientacao = 'DESCENDENTE';
      relacionamentoSemPaiOuSemFilho.descendente = new Artefato();
      relacionamentoSemPaiOuSemFilho.descendente.inicializar(this.artefato);
      relacionamentoSemPaiOuSemFilho.coRelacionamento = 0;
    }

    this.initParametrosDiagrama();
    this.node_data = this.converterRelacionamento2Node(relacionamentoSemPaiOuSemFilho, null);
    this.initDiagrama();
  }

  initParametrosDiagrama() {
    this.margin = { top: 20, right: 90, bottom: 30, left: 50 };
    this.i = 0;
    this.duration = 750;
    this.isSidebarVisible = true;

    var tempWidth = this.windowWidth - 300 - 17;
    if (tempWidth < 676) {
      tempWidth += 300;
      this.isSidebarVisible = false;
    }

    this.width = tempWidth - this.margin.left - this.margin.right;
    this.initDiagramaHeight();
    this.height = this.diagramaHeight - this.margin.top - this.margin.bottom;
  }

  //Calcula a altura do diagrama, conforme a quantidade de relacionamentos a serem exibidos
  initDiagramaHeight(quantidadeNode?: number) {
    var alturaTemp: number = this.appService.alturaMinimaDiagrama;
    var somaNodes: number = 0;

    if (quantidadeNode) {
      quantidadeNode = quantidadeNode;
      alturaTemp = quantidadeNode * this.appService.espacamentoNodeDiagrama;

    } else if (!quantidadeNode) {
      if (this.orientacao == 'DESCENDENTE' && this.artefato.descendentes) {
        somaNodes = somaNodes + this.artefato.descendentes.slice().filter(  p => {
          if (this.isFiltroAplicado) {
            return this.listaTipoFiltroAplicado.includes(p.descendente.tipoArtefato.coTipo)
          } else {
            return p;
          }
        }).length;
      }
      if (this.orientacao == 'DESCENDENTE' && this.artefato.posteriores) {
        somaNodes = somaNodes + this.artefato.posteriores.slice().filter(  p => {
          if (this.isFiltroAplicado) {
            return this.listaTipoFiltroAplicado.includes(p.posterior.tipoArtefato.coTipo)
          } else {
            return p;
          }
        }).length;
      }

      if (this.orientacao == 'ASCENDENTE' && this.artefato.ascendentes) {
        somaNodes = somaNodes + this.artefato.ascendentes.slice().filter(  p => {
          if (this.isFiltroAplicado) {
            return this.listaTipoFiltroAplicado.includes(p.ascendente.tipoArtefato.coTipo)
          } else {
            return p;
          }
        }).length;
      }
      if (this.orientacao == 'ASCENDENTE' && this.artefato.anteriores) {
        somaNodes = somaNodes + this.artefato.anteriores.slice().filter(  p => {
          if (this.isFiltroAplicado) {
            return this.listaTipoFiltroAplicado.includes(p.anterior.tipoArtefato.coTipo)
          } else {
            return p;
          }
        }).length;

      }

      alturaTemp = somaNodes * this.appService.espacamentoNodeDiagrama;
    }

    if (alturaTemp < this.appService.alturaMinimaDiagrama) {
      this.diagramaHeight = this.appService.alturaMinimaDiagrama;
    } else {
      this.diagramaHeight = alturaTemp;
    }
  }

  converterRelacionamento2Node(relacionamentoEntrada: Relacionamento, node?: any): Node {
    //this.loggerService.log("Convertendo Relacionamento para Node.")
    //this.loggerService.log(relacionamentoEntrada)
    if (!node) {
      node = null;
    }

    var artefato: Artefato = null;

    if (this.orientacao == 'DESCENDENTE') {
      artefato = relacionamentoEntrada.descendente;
    } else {
      artefato = relacionamentoEntrada.ascendente;
    }

    var output: Node = new Node();
    output.id = artefato.coArtefato;
    output.relacionamento = relacionamentoEntrada;

    if (artefato.noNomeExibicao) {
      output.name = artefato.noNomeExibicao;
    } else {
      output.name = artefato.noNomeInterno;
    }
    output.artefato = artefato;

    //output.descricaoRelacionamento = " Teste "

    if (this.orientacao == 'DESCENDENTE') {
      output.children = [];
      if (artefato.descendentes) {
        for (let relacionamento of artefato.descendentes) {
          if (relacionamento.descendente) {
            var descendente: Artefato = new Artefato();
            descendente.inicializar(relacionamento.descendente);
            var tipo = this.listaTipo.find(p => p.coTipo == descendente.tipoArtefato.coTipo)
            if (tipo.icExibirGrafo == true 
              && (this.isFiltroAplicado == false ||  this.listaTipoFiltroAplicado.includes(  descendente.tipoArtefato.coTipo  )) ) {
              output.children.push(this.converterRelacionamento2Node(relacionamento, node));
            }
          }
        }
      }
    }

    if (this.orientacao == 'ASCENDENTE') {
      output.children = [];
      if (artefato.ascendentes) {
        for (let relacionamento of artefato.ascendentes) {
          if (relacionamento.ascendente) {
            var ascendente: Artefato = new Artefato();
            ascendente.inicializar(relacionamento.ascendente);
            var tipo = this.listaTipo.find(p => p.coTipo == ascendente.tipoArtefato.coTipo)
            if (tipo.icExibirGrafo == true) {
              output.children.push(this.converterRelacionamento2Node(relacionamento, node));
            }
          }
        }
      }
    }

    return output;

  }

  svg;
  root;
  treemap;
  node_data;
  nodes;
  treeData;
  initDiagrama() {
    d3.select("#diagrama").selectAll("*").remove();

    this.svg = d3.select("#diagrama").append("svg")
      .attr("width", this.width + this.margin.right + this.margin.left)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
      .attr("transform", "translate("
        + this.margin.left + "," + this.margin.top + ")");

    // declares a tree layout and assigns the size
    this.treemap = d3.tree().size([this.height, this.width]);

    // Assigns parent, children, height, depth
    this.root = d3.hierarchy(this.node_data, function (d) { return d.children; });
    this.root.x0 = this.height / 2;

    this.root.y0 = 0;
    this.root.loaded = true;

    if (this.root.children) {
      this.root.children.forEach(this.toggleAll);
    }
    this.update(this.root);
  }

  update = (source) => {
    var i = this.i;

    // Assigns the x and y position for the nodes
    this.treeData = this.treemap(this.root);

    // Compute the new tree layout.
    this.nodes = this.treeData.descendants().reverse();
    var links = this.treeData.descendants().slice(1);

    var mapLarguraPorNivel: Map<number, number> = new Map<number, number>();

    this.nodes.forEach(function (d) {
      if (mapLarguraPorNivel.has(d.depth)) {
        if (d.data.name.length > mapLarguraPorNivel.get(d.depth)) {
          mapLarguraPorNivel.set(d.depth, d.data.name.length);
        }
      } else {
        mapLarguraPorNivel.set(d.depth, d.data.name.length);
      }
    });

    var espacamentoHorizontalDiagrama: number = this.appService.espacamentoHorizontalDiagrama;
    var larguraLetraDiagrama: number = this.appService.larguraLetraDiagrama;

    // Normalize for fixed-depth.
    this.nodes.forEach(function (d, width, height) {
      var offsetRoot = 0;
      if (d.depth == 0) {
        d.y = offsetRoot;
      } else {
        var somaCaracteres: number = 0;
        mapLarguraPorNivel.forEach((valor, depth) => {
          if (depth < d.depth) {
            somaCaracteres += valor;
          }
        });
        d.y = (((somaCaracteres) * larguraLetraDiagrama) + (d.depth * espacamentoHorizontalDiagrama));
      }
    });

    var node = this.svg.selectAll('g.node')
      .data(this.nodes, function (d) {
        return d.id || (d.id = ++i);
      });


    this.i = i;

    var nodeEnter = node.enter().append('g')
      .attr('class', 'node')
      .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on('click', this.click)
      .on('dblclick', this.doubleClick)
      .on('contextmenu', this.contextMenu)
      .on("mouseover", function (d) {
        colorNode(d.data.name)
      })
      .on("mouseout", function (d) {
        d3.selectAll(".node").style("fill", "black");
        //color the node which is hovered.
        colorNode(d.name);
        //iterate over the imports which is the targets of the node(on which it is hovered) and color them.
      });

    function colorNode(name) {
      //iterate through all the dom and get the DOM which has the data
      var node = d3.selectAll(".node").filter(function (d) {
        if (d.data && d.data.name) {
          return d.data.name == name;
        }
      });

      //for the matching node DOM set the fill to be red
      node.style("fill", "red");

      //d3.selectAll(node).style("fill", "red");
    }
    var listaTipo: Tipo[] = this.listaTipo;
    nodeEnter.append('circle')
      .attr('class', 'node')
      .attr('fill', function (d) {
        var tipo = null;
        if (d.data.artefato.icProcessoCritico) {

          tipo = listaTipo.find(p => p.coTipo == 'PROCESSO-CRITICO')
        } else {
          tipo = listaTipo.find(p => p.coTipo == d.data.artefato.tipoArtefato.coTipo)
        }
        if (tipo) {
          return tipo.coCor;
        } else {
          return 'red'
        }
      })
      .attr('stroke', function (d) {
        var tipo = listaTipo.find(p => p.coTipo == d.data.artefato.tipoArtefato.coTipo)
        if (tipo) {
          return tipo.coCorBorda;
        } else {
          return 'red'
        }
      })
      .attr('r', 1e-6)

    nodeEnter.append('text')
      .attr("dy", ".35em")
      .attr("x", function (d) {
        var val = 13;
        if (d.depth == 0 && (d.children || d._children)) {
          //ROOT
          val = 13;
        }
        return val;
      })
      .attr("text-anchor", function (d) { return d.children || d._children ? "start" : "start"; })
      .text(function (d) { return d.data.name; });

    var nodeUpdate = nodeEnter.merge(node);

    nodeUpdate.transition()
      .duration(this.duration)
      .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

    // Update the node attributes and style
    nodeUpdate.select('circle.node')
      .attr('r', 10)
      .attr('class', function (d) { return d.data.artefato.coTipoArtefato })
      .attr('cursor', 'pointer')
      .on("mouseover", function (d) {

        if (d.data && d.data.relacionamento && d.data.relacionamento.atributos) {
          var textoTooltip: string;
          for (let atributo of d.data.relacionamento.atributos) {
            var tipo: Tipo = listaTipo.find(obj => obj.coTipo == atributo.coTipoAtributo);

            if (tipo && tipo.icExibirGrafo) {
              console.log(atributo)
              if (textoTooltip === undefined) {
                textoTooltip = tipo.deTipo + " : " + atributo.deValor + "<br/>"
              } else {
                textoTooltip += tipo.deTipo + " : " + atributo.deValor + "<br/>"
              }
            }
          }

          if (textoTooltip && textoTooltip.trim() != '') {
            div.transition()
              .duration(200)
              .style("opacity", 1.9);
            div.html(textoTooltip)
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY + 5) + "px");
          }
        }



      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
      });

    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('circle').attr('r', 1e-6);

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);


    // ****************** links section ***************************

    // Update the links...
    var link = this.svg.selectAll(
      'path.link')
      .data(links, function (d) { return d.id; });

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
      .attr("stroke", function (d) {
        if (d.data.relacionamento && d.data.relacionamento.tipoRelacionamento && d.data.relacionamento.tipoRelacionamento.coTipo) {
          var tipo: Tipo = listaTipo.find(p => p.coTipo == d.data.relacionamento.tipoRelacionamento.coTipo);
          return tipo.coCorBorda;
        } else {
          return '#cecece';
        }
      })
      .attr("stroke-width", function (d) {
        if (d.data.relacionamento && d.data.relacionamento.tipoRelacionamento && d.data.relacionamento.tipoRelacionamento.coTipo) {
          var tipo: Tipo = listaTipo.find(p => p.coTipo == d.data.relacionamento.tipoRelacionamento.coTipo);
          return tipo.nuLarguraBorda + 'px';
        } else {
          return '1px';
        }
      })
      .attr("fill", function (d) {
        if (d.data.relacionamento && d.data.relacionamento.tipoRelacionamento && d.data.relacionamento.tipoRelacionamento.coTipo) {
          var tipo: Tipo = listaTipo.find(p => p.coTipo == d.data.relacionamento.tipoRelacionamento.coTipo);
          return tipo.coCor;
        } else {
          return 'none';
        }
      })
      .attr("class", function (d) {
        return 'link'
      })
      .attr('d', function (d) {
        var o = { x: source.x0, y: source.y0 }
        return diagonal(o, o)
      });


    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', function (d) { return diagonal(d, d.parent) });

    // Remove any exiting links
    var linkExit = link.exit().transition()
      .duration(this.duration)
      .attr('d', function (d) {
        var o = { x: source.x, y: source.y }
        return diagonal(o, o)
      })
      .remove();

    // Store the old positions for transition.
    this.nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
    //this.nodes = nodes;
    // Creates a curved (diagonal) path from parent to the child nodes
    function diagonal(s, d) {
      if (d.data) {

        var offsetYRect = d.data.name.length * 10;

        if (d.data.name.length > 15) {
          offsetYRect = (d.data.name.length * larguraLetraDiagrama) / 1.5;
        } else {
          offsetYRect = d.data.name.length * 11;
        }

        //offsetYRect = d.data.name.length * 15;
        //var offsetYRect = 0;
        var offsetXRect = 0;
        var path = `M ${s.y - 13} ${s.x}
                C ${(s.y + d.y + offsetYRect) / 2} ${s.x + offsetXRect},
                ${(s.y + d.y + offsetYRect) / 2} ${d.x + offsetXRect},
                ${d.y + offsetYRect} ${d.x}`
      }
      else {
        var path = `M ${s.y} ${s.x}
                  C ${(s.y + d.y) / 2} ${s.x},
                    ${(s.y + d.y) / 2} ${d.x},
                    ${d.y} ${d.x}`
      }
      return path
    }
  }

  toggle = (d) => {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  }
  toggleAll = (d) => {
    if (d.children) {
      d.children.forEach(this.toggleAll);
      this.toggle(d);
    }
  }

  getWidth = () => {
    return this.width;
  }

  getHeight = () => {
    return this.width;
  }

  click = (d) => {
    if (d.data.artefato.coArtefato) {
      this.artefatoSelecionado.emit(d.data.artefato.coArtefato);
    }
  }

  // Toggle children on click.
  doubleClick = (d) => {
    d3.event.preventDefault();


    this.artefatoSelecionado.emit(d.data.artefato.coArtefato);
    if (d.loaded === undefined) {
      this.adicionarNode(d);
      d.loaded = true;
      if (d.empty) {
      }
    }
    else {
      this.toggle(d);
      this.update(d);
    }
  }

  adicionarNode = (d) => {
    this.artefatoService.getArtefatoRelacionamento(d.data.artefato.coArtefato).subscribe(
      (artefatoResult: Artefato) => {
        var artefato: Artefato = new Artefato();
        artefato.inicializar(artefatoResult);

        this.ordernarRelacionamento(artefato);

        if ((artefato.ascendentes && artefato.ascendentes.length > 0) || (artefato.descendentes && artefato.descendentes.length > 0)) {
          var relacionamentoSemPaiOuSemFilho: Relacionamento = new Relacionamento();
          if (this.orientacao == 'DESCENDENTE') {
            relacionamentoSemPaiOuSemFilho.descendente = new Artefato;
            relacionamentoSemPaiOuSemFilho.descendente.inicializar(artefato);
            relacionamentoSemPaiOuSemFilho.coRelacionamento = 0;
          } else {
            relacionamentoSemPaiOuSemFilho.ascendente = new Artefato;
            relacionamentoSemPaiOuSemFilho.ascendente.inicializar(artefato);
            relacionamentoSemPaiOuSemFilho.coRelacionamento = 0;
          }

          //TODO: INCLUIR SORT DOS ELEMENTOS
          //TODO: INCLUIR FILTRO DOS ELEMENTOS
          var newNodeParent: Node = this.converterRelacionamento2Node(relacionamentoSemPaiOuSemFilho, d)
          var newChildren: Node[] = newNodeParent['children'];

          if (newChildren && newChildren.length > 0) {
            d.children = [];
          }

          if (newChildren) {
            for (let newChild of newChildren) {
              var newNode = d3.hierarchy(newChild, function (d) { return d.children; });
              newNode.depth = d.depth + 1;
              newNode.height = d.height - 1;
              newNode.parent = d;

              if (d._children) {
                d._children.push(newNode)
              }
              else {
                d.children.push(newNode)
              }
            }
          }

          var mapLarguraPorNivel: Map<number, number> = new Map<number, number>();

          var qtdNodesPorNivel: number[] = [];
          this.nodes.forEach(node => {
            if (mapLarguraPorNivel.has(node.depth)) {
              if (node.data.name.length > mapLarguraPorNivel.get(node.depth)) {
                mapLarguraPorNivel.set(node.depth, node.data.name.length)
              }
            } else {
              mapLarguraPorNivel.set(node.depth, node.data.name.length)
            }

            if (!qtdNodesPorNivel[node.depth]) {
              qtdNodesPorNivel[node.depth] = 0;
            }
            qtdNodesPorNivel[node.depth] += 1;
          });

          var depthOfNodes: number = mapLarguraPorNivel.size;

          newChildren.forEach((child) => {
            if (mapLarguraPorNivel.has(depthOfNodes)) {
              if (child['name'].length > mapLarguraPorNivel.get(depthOfNodes)) {
                mapLarguraPorNivel.set(depthOfNodes, child['name'].length)
              }
            } else {
              mapLarguraPorNivel.set(depthOfNodes, child['name'].length)
            }

          });
          if (!qtdNodesPorNivel[d.depth + 1]) {
            qtdNodesPorNivel[d.depth + 1] = 0;
          }
          if (d.children) {
            qtdNodesPorNivel[d.depth + 1] += d.children.length;
          }
          qtdNodesPorNivel = qtdNodesPorNivel.sort((n1, n2) => n2 - n1);

          var novaAltura: number = (qtdNodesPorNivel[0] * this.appService.espacamentoNodeDiagrama) + (qtdNodesPorNivel.length * 10);
          if (novaAltura < this.appService.alturaMinimaDiagrama) {
            novaAltura = this.appService.alturaMinimaDiagrama;
          }

          var novaLargura: number = 0;

          mapLarguraPorNivel.forEach((valor) => {
            novaLargura = novaLargura + (valor * this.appService.larguraLetraDiagrama) + this.appService.espacamentoHorizontalDiagrama;
          });

          d3.select("#diagrama").select("svg").attr('height', (novaAltura + this.margin.top + this.margin.bottom));
          d3.select("#diagrama").select("svg").attr('width', (novaLargura + this.margin.left + this.margin.right));

          this.height = novaAltura;
          this.treemap = d3.tree().size([novaAltura, this.width]);
          this.update(d);
        } else {
          d.empty = true;
        }
      }
    ); //FIM this.artefatoService.getArtefatoRelacionamento
  }

  ordernarRelacionamento(artefato: Artefato) {
    if (artefato.ascendentes) {

      try {
        artefato.ascendentes.sort((a, b) => {
          var aInt: number = 0;
          var bInt: number = 0;
          var aPosicao: Atributo = a.atributos.find(atributo => atributo.coTipoAtributo == 'POSICAO');
          var bPosicao: Atributo = b.atributos.find(atributo => atributo.coTipoAtributo == 'POSICAO');

          if (aPosicao != null) {
            aInt = +aPosicao.deValor;
          }
          if (bPosicao != null) {
            bInt = +bPosicao.deValor;
          }
          return aInt - bInt;
        });
      } catch (error) {
        this.loggerService.error('Ordenação de elementos ascendentes')
        this.loggerService.error('Valor de artefato : ')
        this.loggerService.error(artefato)
      }
    }

    if (artefato.descendentes) {
      try {
        artefato.descendentes.sort((a, b) => {
          var aInt: number = 0;
          var bInt: number = 0;

          var aPosicao: Atributo = a.atributos.find(atributo => atributo.coTipoAtributo == 'POSICAO');
          var bPosicao: Atributo = b.atributos.find(atributo => atributo.coTipoAtributo == 'POSICAO');

          if (aPosicao != null) {
            aInt = +aPosicao.deValor;
          }
          if (bPosicao != null) {
            bInt = +bPosicao.deValor;
          }

          return aInt - bInt;
        });
      } catch (error) {
        this.loggerService.error('Ordenação de elementos descendentes')
        this.loggerService.error('Valor de artefato : ')
        this.loggerService.error(artefato)
      }
    }
  }


  contextMenu = (node) => {
    //var xywh = this.svg
    d3.event.preventDefault();


    if (d3.event.clientY) {
      var x = d3.event.clientX - 0 + this.scrollX;
      var y = d3.event.clientY - 125 + this.scrollY; //era 115
    } else {
      var x = d3.event.x - 0 + this.scrollX;
      var y = d3.event.y - 125 + this.scrollY; //era 115
    }

    if (this.isSidebarVisible) {
      x = x - 300;
    }

    var height = 30;
    var width = 120; //era 120
    var margin = 2; // fraction of width
    var direcaoContextMenu = 1; // 1 = baixo   -1 = cima

    var items = [
      { id: 1, acao: 'ATUALIZAR', nome: 'Atualizar', node: node },
      { id: 2, acao: 'CENTRALIZAR', nome: 'Centralizar', node: node },
    ];

    if ((((items.length + 1) * height) + y) >= this.height) {
      items = [
        { id: 2, acao: 'ATUALIZAR', nome: 'Atualizar', node: node },
        { id: 1, acao: 'CENTRALIZAR', nome: 'Centralizar', node: node },
      ];
      direcaoContextMenu = -1;
    } else {
      direcaoContextMenu = 1;
    }

    d3.select('.context-menu').remove();
    // Draw the menu
    d3.select("#diagrama").select('svg')
      .append('g')
      .attr('class', 'context-menu')
      .selectAll('tmp')
      .data(items).enter()
      .append('g').attr('class', 'menu-entry')
      .on('click', this.clickContextMenuItem)
    d3.selectAll('.menu-entry')
      .append('rect')
      .attr('x', x)
      .attr('y', function (d) { return ((d.id * height) * direcaoContextMenu) + y })
      .attr('width', width + margin)
      .attr('height', height + margin)
      .on('mouseover', function () { d3.select(this).classed('mouse-hover', true) })
      .on('mouseout', function () { d3.select(this).classed('mouse-hover', false) })

    d3.selectAll('.menu-entry')
      .append('text')
      .text(function (d) {
        return d.nome;
       }
      )
      .attr('x', x + (margin * 4))
      .attr('y', function (d) { return ((d.id * height) * direcaoContextMenu) + y + 4 })
      .attr('dy', height / 2 + margin)
      .attr('dx', margin)
      .on('mouseover', function () { d3.select(this.previousSibling).classed('mouse-hover', true) })
      .on('mouseout', function () { d3.select(this.previousSibling).classed('mouse-hover', false) })

    d3.select('body')
      .on('click', function () {
        d3.select('.context-menu').remove();
      });

  }

  clickContextMenuItem = (d) => {
    if (d.acao == 'CENTRALIZAR') {
      this.artefatoService.getArtefatoRelacionamento(d.node.data.id).subscribe(
        (artefato: Artefato) => {

          this.router.navigate(['/artefato/', artefato.coArtefato])
          //this.artefatoSelecionado.emit(artefato.coArtefato);
          //this.artefato = artefato;
        },
        (error: any) => { }
      )
    }
    else if (d.acao == 'ATUALIZAR') {
      d.node.children = null;
      d.node._children = null;
      this.adicionarNode(d.node)
    }
  }

}

