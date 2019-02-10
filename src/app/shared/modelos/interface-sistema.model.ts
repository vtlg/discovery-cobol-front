export class InterfaceSistemaDiagramaSankey {

    nodes: Node[];
    links: Link[];

	coArtefato: number;
	noNomeArtefato: string;
	noNomeExibicao: string;
	noNomeInterno: string;
	coTipoArtefato: string;
	coAmbiente: string;
    coSistema: string;
    
    coArtefatoPai: number;
	noNomeArtefatoPai: string;
	noNomeExibicaoPai: string;
	noNomeInternoPai: string;
	coTipoArtefatoPai: string;
	coAmbientePai: string;
	coSistemaPai: string;

	coSistemaDestino: string;
	caminhoCoArtefato: string;
	coTipoRelacionamentoInicial: string;

}

export class Node {
    node: number;
    name: string;
}


export class Link {
    source: number;
    target: number;
    value: number;
}

export class InterfaceSistemaTabela {
    
}