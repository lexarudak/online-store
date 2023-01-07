import { getExistentElement } from '../../base/helpers';

class RangeInput {
  parentSelector: HTMLElement;
  priceInputMin: HTMLInputElement;
  priceInputMax: HTMLInputElement;
  rangeInputMin: HTMLInputElement;
  rangeInputMax: HTMLInputElement;
  range: HTMLElement;

  constructor(parentSelector: HTMLElement) {
    this.parentSelector = parentSelector;
    this.priceInputMin = getExistentElement<HTMLInputElement>('.input-min', parentSelector);
    this.priceInputMax = getExistentElement<HTMLInputElement>('.input-max', parentSelector);
    this.rangeInputMin = getExistentElement<HTMLInputElement>('.range-min', parentSelector);
    this.rangeInputMax = getExistentElement<HTMLInputElement>('.range-max', parentSelector);
    this.range = getExistentElement('.slider__progress', parentSelector);
  }

  changePriceInputMin() {
    const maxPrice = +this.priceInputMax.value;
    if (+this.priceInputMin.value >= maxPrice) this.priceInputMin.value = (maxPrice - 1).toString();
    if (+this.priceInputMin.value < 1) this.priceInputMin.value = '1';

    while (this.priceInputMin.value[0] === '0') this.priceInputMin.value = this.priceInputMin.value.slice(1);

    if (+this.priceInputMin.value) {
      this.rangeInputMin.value = this.priceInputMin.value;
      this.range.style.left = (+this.priceInputMin.value / +this.rangeInputMin.max) * 100 + '%';
    }
  }

  changePriceInputMax() {
    const minPrice = +this.priceInputMin.value;
    if (+this.priceInputMax.value > 100) this.priceInputMax.value = '100';
    if (+this.priceInputMax.value <= minPrice) this.priceInputMax.value = (minPrice + 1).toString();

    while (this.priceInputMax.value[0] === '0') this.priceInputMax.value = this.priceInputMax.value.slice(1);

    this.rangeInputMax.value = this.priceInputMax.value;
    this.range.style.right = 100 - (+this.priceInputMax.value / +this.rangeInputMax.max) * 100 + '%';
  }

  changeRangeInputMin() {
    const minVal = +this.rangeInputMin.value,
      maxVal = +this.rangeInputMax.value;
    if (maxVal - minVal < 1) {
      this.rangeInputMin.value = (maxVal - 1).toString();
    } else {
      this.priceInputMin.value = minVal.toString();
      this.range.style.left = (minVal / +this.rangeInputMin.max) * 100 + '%';
    }
  }

  changeRangeInputMax() {
    const minVal = +this.rangeInputMin.value,
      maxVal = +this.rangeInputMax.value;
    if (maxVal - minVal < 1) {
      this.rangeInputMax.value = (minVal + 1).toString();
    } else {
      this.priceInputMax.value = maxVal.toString();
      this.range.style.right = 100 - (maxVal / +this.rangeInputMax.max) * 100 + '%';
    }
  }

  recoveryRangeFilter(min: string, max: string) {
    this.priceInputMin.value = min;
    this.priceInputMax.value = max;
    this.changePriceInputMin();
    this.changePriceInputMax();
  }

  resetRangeFilter() {
    this.priceInputMin.value = this.priceInputMax.min;
    this.priceInputMax.value = this.priceInputMax.max;
    this.changePriceInputMin();
    this.changePriceInputMax();
  }
}

export default RangeInput;
