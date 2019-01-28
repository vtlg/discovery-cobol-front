import { Atributo } from './atributo.model';
import { Relacionamento } from './relacionamento.model';
import { Tipo } from './tipo.model';

export class Artefato {

	coArtefato: number;
	noNomeArtefato: string;
	noNomeExibicao: string;
	noNomeInterno: string;
	coAmbiente: string;
	coSistema: string;
	deIdentificador: string;
	deHash: string;
	deDescricaoUsuario: string;
	deDescricaoArtefato: string;
	icInclusaoManual: boolean;
	icProcessoCritico: boolean;
	tsInicioVigencia: string;
	tsUltimaModificacao: string;
	tsFimVigencia: string;

	tipoArtefato: Tipo;

	descendentes: Relacionamento[];
	ascendentes: Relacionamento[];
	anteriores: Relacionamento[];
	posteriores: Relacionamento[];
	primeiros: Relacionamento[];
	ultimos: Relacionamento[];

	atributos: Atributo[];


	inicializar(val: Artefato) {


		this.coArtefato = val.coArtefato;
		this.noNomeArtefato = val.noNomeArtefato;
		this.noNomeExibicao = val.noNomeExibicao;
		this.noNomeInterno = val.noNomeInterno;
		this.coAmbiente = val.coAmbiente;
		this.coSistema = val.coSistema;
		this.deIdentificador = val.deIdentificador;
		this.deHash = val.deHash;
		this.deDescricaoUsuario = val.deDescricaoUsuario;
		this.deDescricaoArtefato = val.deDescricaoArtefato;
		this.icInclusaoManual = val.icInclusaoManual;
		this.icProcessoCritico = val.icProcessoCritico;
		this.tsInicioVigencia = val.tsInicioVigencia;
		this.tsUltimaModificacao = val.tsUltimaModificacao;
		this.tsFimVigencia = val.tsFimVigencia;
		this.tipoArtefato = val.tipoArtefato;

		if (val.descendentes) {
			this.descendentes = val.descendentes.slice();
		}
		if (val.ascendentes) {
			this.ascendentes = val.ascendentes.slice();
		}
		if (val.anteriores) {
			this.anteriores = val.anteriores.slice();
		}
		if (val.posteriores) {
			this.posteriores = val.posteriores.slice();
		}
		if (val.primeiros) {
			this.primeiros = val.primeiros.slice();
		}
		if (val.ultimos) {
			this.ultimos = val.ultimos.slice();
		}
		if (val.atributos) {
			this.atributos = val.atributos.slice();
		}
	}
}