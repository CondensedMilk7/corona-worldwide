import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: string[], filterString: string) {
    if (filterString.length <= 0) {
      return value;
    }
    const result = [];
    for (let valueString of value) {
      if (
        valueString
          .toLocaleLowerCase()
          .includes(filterString.toLocaleLowerCase())
      ) {
        result.push(valueString);
      }
    }
    return result;
  }
}
