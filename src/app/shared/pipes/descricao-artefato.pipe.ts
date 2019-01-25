import { Pipe, PipeTransform } from '@angular/core';
import { Artefato } from '../modelos/artefato.model';

@Pipe({
  name: 'descricaoArtefato'
})
export class DescricaoArtefatoPipe implements PipeTransform {

  transform(artefato: Artefato, args?: any): any {
    var saida: string = 'Nenhuma descrição para exibir';

    if (artefato.deDescricaoUsuario && artefato.deDescricaoUsuario.trim().length > 0) {
      saida = artefato.deDescricaoUsuario;
    } else if (artefato.deDescricaoArtefato && artefato.deDescricaoArtefato.trim().length > 0) {
      saida = artefato.deDescricaoArtefato;
    }


    return saida;
  }

}
