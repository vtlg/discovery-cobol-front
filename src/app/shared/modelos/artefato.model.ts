import { Atributo } from './atributo.model';
import { Relacionamento } from './relacionamento.model';
import { TipoArtefato } from './tipo-artefato.model';

export class Artefato {

	coArtefato: number;
	noNomeArtefato: string;
	noNomeExibicao: string;
	noNomeInterno: string;
	coAmbiente: string;
	coSistema: string;
	deIdentificador: string;
	deHash : string;
	deDescricaoUsuario : string;
	deDescricaoArtefato : string;
	icInclusaoManual : string;
	tsInicioVigencia: string;
	tsUltimaModificacao: string;
	tsFimVigencia: string;

	tipoArtefato: TipoArtefato;

	descendentes : Relacionamento[];
	ascendentes : Relacionamento[];
	anteriores : Relacionamento[];
	posteriores : Relacionamento[];
	primeiros : Relacionamento[];
    ultimos : Relacionamento[];

    atributos: Atributo[];
}