import { Artefato } from './artefato.model';
import { Atributo } from './atributo.model';
import { Tipo } from './tipo.model';

export class Relacionamento {

    coRelacionamento: number;
    icInclusaoManual: boolean;
    icInclusaoMalha: boolean;

    tipoRelacionamento: Tipo;
    descendente: Artefato;
    ascendente: Artefato;
    anterior: Artefato;
    posterior: Artefato;
    primeiro: Artefato;
    ultimo: Artefato;

    atributos: Atributo[];

    inicializar(obj: Relacionamento) {
        this.coRelacionamento = obj.coRelacionamento;
        this.icInclusaoManual = obj.icInclusaoManual;
        this.icInclusaoMalha = obj.icInclusaoMalha;
        this.tipoRelacionamento = obj.tipoRelacionamento;
    }

}