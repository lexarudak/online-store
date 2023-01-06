import { isHTMLElement } from '../../base/helpers';
import { Products } from '../../base/types';
import { FilterType } from '../../base/enums';
import { queryParamsObj } from './queryParams';

class CheckboxFilter {
  selectedArr: string[];
  filterType: FilterType;

  constructor(filterType: FilterType) {
    this.selectedArr = [];
    this.filterType = filterType;
  }

  checkboxTypeFilter(target: EventTarget | null, data: Products[]) {
    if (!isHTMLElement(target)) throw new Error();

    if (target instanceof HTMLInputElement) {
      if (target.checked) {
        this.selectedArr.push(target.value);
      } else if (!target.checked) {
        this.selectedArr.splice(this.selectedArr.indexOf(target.value), 1);
      }
    }
    queryParamsObj[this.filterType] = [...new Set(this.selectedArr)].join('↕');
    console.log(queryParamsObj);
    localStorage.setItem('queryParams', JSON.stringify(queryParamsObj));

    return this.checkboxTypeFilt(data);
  }

  checkboxTypeFilt(data: Products[]) {
    let currData = data;

    if (this.selectedArr.length) {
      if (this.filterType === FilterType.sale) return currData.filter((item) => item.sale);

      const chekedData = [];
      for (const selectedItem of this.selectedArr) {
        if (this.filterType === FilterType.category) {
          const oneType = currData.filter((item) => item.type.toLowerCase() === selectedItem);
          chekedData.push(oneType);
        } else if (this.filterType === FilterType.height) {
          chekedData.push(this.filterByHeight(selectedItem, currData));
        }
      }
      currData = chekedData.flat();
    }
    return currData;
  }

  filterByHeight(selectedItem: string, currData: Products[]) {
    if (selectedItem === 'short') return currData.filter((item) => item.height <= 30);
    if (selectedItem === 'medium') return currData.filter((item) => item.height > 30 && item.height <= 100);
    return currData.filter((item) => item.height > 100);
  }

  resetSelectedArr() {
    this.selectedArr = [];
  }
}

export default CheckboxFilter;
