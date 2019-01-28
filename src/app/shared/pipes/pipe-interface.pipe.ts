import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeInterface'
})
export class PipeInterfacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == 'INTERFACE') {
      return 'Sim';
    } else {
      return 'Não'
    }

  }

}
