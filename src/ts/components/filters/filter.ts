import { isHTMLElement, getExistentElement } from '../../base/helpers';
import { Products } from '../../base/types';
import RangeInput from './rangeInput';

class Filter {
  priceRangeInputParent: HTMLElement;
  priceRangeInput: RangeInput;
  stockRangeInputParent: HTMLElement;
  stockRangeInput: RangeInput;

  constructor() {
    this.priceRangeInputParent = getExistentElement<HTMLInputElement>('.filter__price');
    this.priceRangeInput = new RangeInput(this.priceRangeInputParent);
    this.stockRangeInputParent = getExistentElement<HTMLInputElement>('.filter__stock');
    this.stockRangeInput = new RangeInput(this.stockRangeInputParent);
  }

  rangeInputFilter(data: Products[], target: EventTarget | null) {
    if (!isHTMLElement(target)) throw new Error();

    if (target.closest('.filter__stock')) {
      const stock = this.stockRangeInput;
      const [min, max] = this.addListenerByType(stock);
      return this.filterByStock(data, min, max);
    } else {
      const price = this.priceRangeInput;
      const [min, max] = this.addListenerByType(price);
      return this.filterByPrice(data, min, max);
    }
  }

  addListenerByType(type: RangeInput) {
    type.priceInputMin.addEventListener('change', () => type.changePriceInputMin());
    type.priceInputMax.addEventListener('change', () => type.changePriceInputMax());
    type.rangeInputMin.addEventListener('input', () => type.changeRangeInputMin());
    type.rangeInputMax.addEventListener('input', () => type.changeRangeInputMax());
    return [type.priceInputMin.value, type.priceInputMax.value];
  }

  filterByPrice(data: Products[], priceMin: string, priceMax: string) {
    return data.filter((item) => +priceMin <= item.price && item.price <= +priceMax);
  }

  filterByStock(data: Products[], stockMin: string, stockMax: string) {
    return data.filter((item) => +stockMin <= item.stock && item.stock <= +stockMax);
  }
}

export default Filter;
