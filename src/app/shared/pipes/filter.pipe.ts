import { Pipe, PipeTransform } from '@angular/core';
import { CountryNameCode } from '../models/country-name-code';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: CountryNameCode[], filterString: string) {
    if (filterString.length <= 0) {
      return value;
    }
    const result = [];
    for (const item of value) {
      if (
        item.countryName.toLocaleLowerCase().includes(filterString.toLocaleLowerCase())
      ) {
        result.push(item);
      }
    }
    return result;
  }
}
