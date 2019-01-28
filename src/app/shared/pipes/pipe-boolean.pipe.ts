import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pipeBoolean'
})
export class PipeBooleanPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (value == true) {
      return 'Sim'
    } else {
      return 'Não'
    }
  }

}
