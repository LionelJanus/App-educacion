import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameLastname',
  standalone:false
  
})
export class NameLastnamePipe implements PipeTransform {
  transform(value: { name: string; lastname: string }): string {
    return `${value.name} ${value.lastname}`;
  }
}