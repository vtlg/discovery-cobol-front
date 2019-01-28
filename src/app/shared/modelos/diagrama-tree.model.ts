import { Artefato } from './artefato.model';
import { Relacionamento } from './relacionamento.model';

export class Node {
    id: number;
    name: string;
    artefato: Artefato;

    relacionamento: Relacionamento;
    tipoRelacionamento: string;

    descricaoRelacionamento: string;

    artefatosExibidos: Set<String> = new Set();

    children: Node[];

}