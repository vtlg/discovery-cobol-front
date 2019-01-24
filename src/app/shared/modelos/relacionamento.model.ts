import { Artefato } from './artefato.model';
import { Atributo } from './atributo.model';

export class Relacionamento {

    coRelacionamento: number;
    icInclusaoManual: boolean;
    icInclusaoMalha: boolean;

    descendente: Artefato;
    ascendente: Artefato;
    anterior: Artefato;
    posterior: Artefato;
    primeiro: Artefato;
    ultimo: Artefato;

    atributos: Atributo[];

}