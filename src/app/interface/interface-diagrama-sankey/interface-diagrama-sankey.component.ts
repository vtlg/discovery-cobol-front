import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as d3 from "d3";
import * as s3 from 'd3-sankey';
import { AppService } from 'src/app/shared/servicos/app.service';
import { RelacionamentoService } from 'src/app/shared/servicos/relacionamento.service';
import { InterfaceSistemaDiagramaSankey } from 'src/app/shared/modelos/interface-sistema.model';

@Component({
  selector: 'app-interface-diagrama-sankey',
  templateUrl: './interface-diagrama-sankey.component.html',
  styleUrls: ['./interface-diagrama-sankey.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InterfaceDiagramaSankeyComponent implements OnInit {

  constructor(private appService: AppService, private relacionamentoService: RelacionamentoService) { }

  ngOnInit() {

    this.relacionamentoService.getInterfaceDiagramaSankey('SIPCS').subscribe(
      (data: InterfaceSistemaDiagramaSankey) => {
        console.log(data)
        //data.nodes = data.nodes.sort ( (a,b) => a.node-b.node ).slice();
        this.data = data;
        this.initDiagrama();
      }
    )
   
  }

  svg;
  data;
/*
  data = {
    "nodes": [
      {
        "node": 0, "name": "SIPCS", 'color':'blue'
      },
      {
        "node": 1, "name": "SIFDL", 'color':'red'
      },
      {
        "node": 2, "name": "SIEPA", 'color':'yellow'
      },
      {
        "node": 3, "name": "PCS1C001"
      },
      {
        "node": 4, "name": "PCS7C003"
      },
      {
        "node": 5, "name": "SIDEC", 'color':'pink'
      },
      {
        "node": 6, "name": "SICLI", 'color':'black'
      },
      {
        "node": 7, "name": "DEC9C001"
      },
      {
        "node": 8, "name": "CLI9C001"
      },
      {
        "node": 9, "name": "DEC9C002"
      },
      {
        "node": 10, "name": "DEC9C003"
      }
    ],
    "links": [
      {
        "source": 9,
        "target": 0,
        "value": 1
      },
      {
        "source": 10,
        "target": 0,
        "value": 1
      },
      {
        "source": 7,
        "target": 0,
        "value": 1
      },
      {
        "source": 8,
        "target": 0,
        "value": 1
      },
      {
        "source": 5,
        "target": 7,
        "value": 1
      },
      {
        "source": 5,
        "target": 9,
        "value": 1
      },
      {
        "source": 5,
        "target": 10,
        "value": 1
      },
      {
        "source": 6,
        "target": 8,
        "value": 1
      },
      {
        "source": 0,
        "target": 3,
        "value": 1
      },
      {
        "source": 0,
        "target": 4,
        "value": 1
      },
      {
        "source": 3,
        "target": 1,
        "value": 1
      },
      {
        "source": 4,
        "target": 2,
        "value": 1
      }

    ]
  }
*/

  initDiagrama() {

    var qtdNodes: number = this.data['nodes'].length;

    var units = "Widgets";
    var margin = { top: 10, right: 10, bottom: 10, left: 10 };
    var width = 1200 - margin.left - margin.right;
    var height = (qtdNodes * 50) - margin.top - margin.bottom;

    var formatNumber = d3.format(",.0f");    // zero decimal places
    var format = function (d) { return formatNumber(d) + " " + units; };

    var svg = d3.select("#diagrama").append("svg")
      .attr("width", width + margin.left + margin.right)
      //.attr("height", height + margin.top + margin.bottom)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    var sankeyGraph = this.sankeyFunction()
      .nodeWidth(36)
      .nodePadding(40)
      .size([width, height]);

    var path = sankeyGraph.link();

    sankeyGraph
      .nodes(this.data['nodes'])
      .links(this.data['links'])
      .layout(32);

    var link = svg.append("g").selectAll(".link")
      .data(this.data['links'])
      .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function (d) { return Math.max(1, d.dy); })
      .sort(function (a, b) { return b.dy - a.dy; });

    link.append("title")
      .text(function (d) {
        return d.source.name + " → " + d.target.name;
      });

    var node = svg.append("g").selectAll(".node")
      .data(this.data['nodes'])
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
      })
      .call(d3.drag()
        .subject(function (d) {
          return d;
        })
        .on("start", function () {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove));

    node.append("rect")
      .attr("height", function (d) { return d.dy; })
      .attr("width", sankeyGraph.nodeWidth())
      .style("fill", function (d) {
        if (!d.color) {
          return "gray";
        }
        return d.color;
      })
      .style("stroke", function (d) {
        if (!d.color) {
          return "gray";
        }
        return d.color;
      })
      .append("title")
      .text(function (d) {
        return d.name;
      });

    node.append("text")
      .attr("x", -6)
      .attr("y", function (d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function (d) { return d.name; })
      .filter(function (d) { return d.x < width / 2; })
      .attr("x", 6 + sankeyGraph.nodeWidth())
      .attr("text-anchor", "start");

    function dragmove(d) {
      d3.select(this)
        .attr("transform",
          "translate("
          + d.x + ","
          + (d.y = Math.max(
            0, Math.min(height - d.dy, d3.event.y))
          ) + ")");
      sankeyGraph.relayout();
      link.attr("d", path);
    }
  }


  sankeyFunction = function () {
    var sankey = {
      nodeWidth: Function(),
      nodePadding: Function(),
      nodes: Function(),
      links: Function(),
      size: Function(),
      layout: Function(),
      relayout: Function(),
      link: Function(),
    },
      nodeWidth = 3,
      nodePadding = 2,
      size = [1, 1],
      nodes = [],
      links = [];

    sankey.nodeWidth = function (_) {
      if (!arguments.length) return nodeWidth;
      nodeWidth = +_;
      return sankey;
    };

    sankey.nodePadding = function (_) {
      if (!arguments.length) return nodePadding;
      nodePadding = +_;
      return sankey;
    };

    sankey.nodes = function (_) {
      if (!arguments.length) return nodes;
      nodes = _;
      return sankey;
    };

    sankey.links = function (_) {
      if (!arguments.length) return links;
      links = _;
      return sankey;
    };

    sankey.size = function (_) {
      if (!arguments.length) return size;
      size = _;
      return sankey;
    };

    sankey.layout = function (iterations) {
      computeNodeLinks();
      computeNodeValues();
      computeNodeBreadths();
      computeNodeDepths(iterations);
      computeLinkDepths();
      return sankey;
    };

    sankey.relayout = function () {
      computeLinkDepths();
      return sankey;
    };

    sankey.link = function () {
      var curvature = .3;

      function link(d) {
        var x0 = d.source.x + d.source.dx,
          x1 = d.target.x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = d.source.y + d.sy + d.dy  / 2,
          y1 = d.target.y + d.ty + d.dy  / 2 ;
        return "M" + x0 + "," + y0 
          + "C" + x2 + "," + y0 
          + " " + x3 + "," + y1
          + " " + x1 + "," + y1;
      }

      link.curvature = function (_) {
        if (!arguments.length) return curvature;
        curvature = +_;
        return link;
      };

      return link;
    };

    // Populate the sourceLinks and targetLinks for each node.
    // Also, if the source and target are not objects, assume they are indices.
    function computeNodeLinks() {
      nodes.forEach(function (node) {
        node.sourceLinks = [];
        node.targetLinks = [];
      });
      links.forEach(function (link) {
        var source = link.source,
          target = link.target;
        if (typeof source === "number") source = link.source = nodes[link.source];
        if (typeof target === "number") target = link.target = nodes[link.target];
        source.sourceLinks.push(link);
        target.targetLinks.push(link);
      });
    }

    // Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
      nodes.forEach(function (node) {
        node.value = Math.max(
          d3.sum(node.sourceLinks, value),
          d3.sum(node.targetLinks, value)
        );
      });
    }

    // Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
      var remainingNodes = nodes,
        nextNodes,
        x = 0;

      while (remainingNodes.length) {
        nextNodes = [];
        remainingNodes.forEach(function (node) {
          node.x = x;
          node.dx = nodeWidth;
          node.sourceLinks.forEach(function (link) {
            if (nextNodes.indexOf(link.target) < 0) {
              nextNodes.push(link.target);
            }
          });
        });
        remainingNodes = nextNodes;
        ++x;
      }

      //
      moveSinksRight(x);
      scaleNodeBreadths((size[0] - nodeWidth) / (x - 1));
    }

    function moveSourcesRight() {
      nodes.forEach(function (node) {
        if (!node.targetLinks.length) {
          node.x = d3.min(node.sourceLinks, function (d) { return d.target.x; }) - 1;
        }
      });
    }

    function moveSinksRight(x) {
      nodes.forEach(function (node) {
        if (!node.sourceLinks.length) {
          node.x = x - 1;
        }
      });
    }

    function scaleNodeBreadths(kx) {
      nodes.forEach(function (node) {
        node.x *= kx;
      });
    }

    function computeNodeDepths(iterations) {
      var nodesByBreadth = d3.nest()
        .key(function (d) { return d.x; })
        .sortKeys(d3.ascending)
        .entries(nodes)
        .map(function (d) { return d.values; });

      //
      initializeNodeDepth();
      resolveCollisions();
      for (var alpha = 1; iterations > 0; --iterations) {
        relaxRightToLeft(alpha *= .99);
        resolveCollisions();
        relaxLeftToRight(alpha);
        resolveCollisions();
      }

      function initializeNodeDepth() {
        var ky = d3.min(nodesByBreadth, function (nodes) {
          return (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value);
        });

        nodesByBreadth.forEach(function (nodes) {
          nodes.forEach(function (node, i) {
            node.y = i;
            node.dy = node.value * ky;
          });
        });

        links.forEach(function (link) {
          link.dy = link.value * ky;
        });
      }

      function relaxLeftToRight(alpha) {
        nodesByBreadth.forEach(function (nodes, breadth) {
          nodes.forEach(function (node) {
            if (node.targetLinks.length) {
              var y = d3.sum(node.targetLinks, weightedSource) / d3.sum(node.targetLinks, value);
              node.y += (y - center(node)) * alpha;
            }
          });
        });

        function weightedSource(link) {
          return center(link.source) * link.value ;
        }
      }

      function relaxRightToLeft(alpha) {
        nodesByBreadth.slice().reverse().forEach(function (nodes) {
          nodes.forEach(function (node) {
            if (node.sourceLinks.length) {
              var y = d3.sum(node.sourceLinks, weightedTarget) / d3.sum(node.sourceLinks, value);
              node.y += (y - center(node)) * alpha ;
            }
          });
        });

        function weightedTarget(link) {
          return center(link.target) * link.value;
        }
      }

      function resolveCollisions() {
        nodesByBreadth.forEach(function (nodes) {
          var node,
            dy,
            y0 = 0,
            n = nodes.length,
            i;

          // Push any overlapping nodes down.
          // calcula a distãncia entre os rects
          nodes.sort(ascendingDepth);
          for (i = 0; i < n; ++i) {
            node = nodes[i];
            dy = y0 - node.y;
            if (dy > 0) node.y += dy;
            y0 = (node.y + node.dy) + nodePadding;
          }

          // If the bottommost node goes outside the bounds, push it back up.
          dy = y0 - nodePadding - size[1];
          if (dy > 0) {
            y0 = node.y -= dy;

            // Push any overlapping nodes back up.
            for (i = n - 2; i >= 0; --i) {
              node = nodes[i];
              dy = node.y + node.dy + nodePadding - y0;
              if (dy > 0) node.y -= dy;
              y0 = node.y;
            }
          }
        });
      }

      function ascendingDepth(a, b) {
        return a.y - b.y;
      }
    }

    function computeLinkDepths() {
      nodes.forEach(function (node) {
        node.sourceLinks.sort(ascendingTargetDepth);
        node.targetLinks.sort(ascendingSourceDepth);
      });
      nodes.forEach(function (node) {
        var sy = 0, ty = 0;
        node.sourceLinks.forEach(function (link) {
          link.sy = sy;
          sy += link.dy;
        });
        node.targetLinks.forEach(function (link) {
          link.ty = ty;
          ty += link.dy;
        });
      });

      function ascendingSourceDepth(a, b) {
        return a.source.y - b.source.y;
      }

      function ascendingTargetDepth(a, b) {
        return a.target.y - b.target.y;
      }
    }

    function center(node) {
      return node.y + node.dy / 2;
    }

    function value(link) {
      return link.value;
    }

    return sankey;
  };









}
