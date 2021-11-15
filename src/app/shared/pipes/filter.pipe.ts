import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: { name: string; code: string }[], filterString: string) {
    if (filterString.length <= 0) {
      return value;
    }
    const result = [];
    for (let item of value) {
      if (
        item.name.toLocaleLowerCase().includes(filterString.toLocaleLowerCase())
      ) {
        result.push(item);
      }
    }
    return result;
  }
}
