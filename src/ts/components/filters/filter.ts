import { isHTMLElement, getExistentElement } from '../../base/helpers';
import { Products } from '../../base/types';
import { FilterType } from '../../base/enums';
import RangeInput from './rangeInput';
import CheckboxFilter from './checkboxFilter';
import FilteredData from './filteredData';
import { queryParamsObj, resetQueryParamsObj, setQueryParamsObj } from './queryParams';
import Router from '../../router';

class Filter {
  priceRangeInputParent: HTMLElement;
  priceRangeInput: RangeInput;
  stockRangeInputParent: HTMLElement;
  stockRangeInput: RangeInput;

  categoryFilter: CheckboxFilter;
  heightFilter: CheckboxFilter;
  saleFilter: CheckboxFilter;

  currentData: Products[];
  filteredData: FilteredData;
  productCount: HTMLElement;

  constructor(data: Products[]) {
    this.priceRangeInputParent = getExistentElement('.filter__price');
    this.priceRangeInput = new RangeInput(this.priceRangeInputParent);
    this.stockRangeInputParent = getExistentElement('.filter__stock');
    this.stockRangeInput = new RangeInput(this.stockRangeInputParent);

    this.categoryFilter = new CheckboxFilter(FilterType.category);
    this.heightFilter = new CheckboxFilter(FilterType.height);
    this.saleFilter = new CheckboxFilter(FilterType.sale);

    this.currentData = data;
    this.filteredData = new FilteredData(data);
    this.productCount = getExistentElement('.found-products__num');
  }

  rangeInputFilter(target: EventTarget | null, data: Products[]) {
    if (!isHTMLElement(target)) throw new Error();

    if (target.closest('.filter__stock')) {
      const stock = this.stockRangeInput;
      const [min, max] = this.addListenerByType(stock);
      this.filteredData.stockData = this.filterByStock(data, min, max);
      queryParamsObj.stock = min + '.' + max;
      console.log(queryParamsObj);
    } else if (target.closest('.filter__price')) {
      const price = this.priceRangeInput;
      const [min, max] = this.addListenerByType(price);
      this.filteredData.priceData = this.filterByPrice(data, min, max);
      queryParamsObj.price = min + '.' + max;
      console.log(queryParamsObj);
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

  // checkbox

  checkboxFilter(target: EventTarget | null, data: Products[]) {
    if (!isHTMLElement(target)) throw new Error();

    if (target.closest('.filter__type'))
      this.filteredData.checkCategoryData = this.categoryFilter.checkboxTypeFilter(target, data);
    if (target.closest('.filter__height'))
      this.filteredData.checkHeightData = this.heightFilter.checkboxTypeFilter(target, data);
    if (target.closest('.filter__sale'))
      this.filteredData.checkSaleData = this.saleFilter.checkboxTypeFilter(target, data);

    this.updateCheckbox();
  }

  updateCheckbox() {
    const checkbox = [...getExistentElement('.filter').querySelectorAll('input[type="checkbox"]')];
    const checked = [
      ...this.categoryFilter.selectedArr,
      ...this.heightFilter.selectedArr,
      ...this.saleFilter.selectedArr,
    ];

    checkbox.forEach((item) => {
      if (item instanceof HTMLInputElement) {
        if (checked.length) {
          checked.forEach((check) => {
            if (item.value === check) item.checked = true;
          });
        } else {
          item.checked = false;
        }
      }
    });
  }

  //sort

  sortInput(data: Products[]): void {
    const input = getExistentElement<HTMLInputElement>('.sort-input');
    const sortInputValue: string = input.value.toLowerCase().trim();
    this.filteredData.inputData = data.filter((item) => {
      return (
        item.title.toLowerCase().includes(sortInputValue) ||
        item.type.toLowerCase().includes(sortInputValue) ||
        item.description.toLowerCase().includes(sortInputValue) ||
        String(item.price).includes(sortInputValue) ||
        String(item.sale).includes(sortInputValue) ||
        String(item.rating).includes(sortInputValue) ||
        String(item.stock).includes(sortInputValue)
      );
    });
    queryParamsObj.search = sortInputValue;
  }

  sortBy(target: EventTarget | null, data: Products[]): void {
    if (!isHTMLElement(target) || !target.dataset.sort) throw new Error();
    this.checkSortType(target.dataset.sort, data);
    queryParamsObj.sort = target.dataset.sort;
  }

  checkSortType(sortType: string, data: Products[]) {
    this.filteredData.sortData = data.sort((a, b) => a.id - b.id);
    switch (sortType) {
      case 'rating-up':
        this.filteredData.sortData = data.sort((a, b) => a.rating - b.rating);
        break;
      case 'rating-down':
        this.filteredData.sortData = data.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-up':
        this.filteredData.sortData = data.sort((a, b) => a.price - b.price);
        break;
      case 'price-down':
        this.filteredData.sortData = data.sort((a, b) => b.price - a.price);
        break;
    }
  }

  // landscape

  changeLayout(target: EventTarget | null): void {
    if (!isHTMLElement(target)) throw new Error();

    const portrait = getExistentElement('.layout__portrait');
    const landscape = getExistentElement('.layout__landscape');
    const productsContainer = getExistentElement('.products__container');

    if (target === portrait) {
      portrait.classList.add('active');
      landscape.classList.remove('active');
      productsContainer.classList.remove('landscape');
      queryParamsObj.landscape = '';
    } else if (target === landscape) {
      landscape.classList.add('active');
      portrait.classList.remove('active');
      productsContainer.classList.add('landscape');
      queryParamsObj.landscape = 'true';
    }
    Router.setQueryParams();
  }

  // data

  getData() {
    const data = this.filteredData.getFinalData();
    this.currentData = data;
    this.productCount.textContent = data.length + '';
    Router.setQueryParams();
    return data;
  }

  // recovery

  recoveryState(data: Products[]) {
    if (!window.location.search) Router.setQueryParams();
    const url = new URL(window.location.href);
    if (!url.search) return;
    const currentParamsList = url.search.slice(1).split('&');
    const currentParamsObj = Object.fromEntries(currentParamsList.map((el) => el.split('=')));
    console.log('Object:', currentParamsObj);
    const paramsKeys = Object.keys(currentParamsObj);
    console.log('Keys:', paramsKeys);
    setQueryParamsObj(currentParamsObj);
    paramsKeys.forEach((param: string) => {
      const paramValue = currentParamsObj[param].split('.');
      console.log('Value:', paramValue);
      if (param === FilterType.category) {
        this.categoryFilter.selectedArr = paramValue;
        this.filteredData.checkCategoryData = this.categoryFilter.checkboxTypeFilt(this.currentData);
        this.updateCheckbox();
      }
      if (param === FilterType.height) {
        this.heightFilter.selectedArr = paramValue;
        this.filteredData.checkHeightData = this.heightFilter.checkboxTypeFilt(this.currentData);
        this.updateCheckbox();
      }
      if (param === FilterType.sale) {
        this.saleFilter.selectedArr = paramValue;
        this.filteredData.checkSaleData = this.saleFilter.checkboxTypeFilt(this.currentData);
        this.updateCheckbox();
      }
      if (param === 'price') {
        const [min, max] = paramValue;
        this.priceRangeInput.recoveryRangeFilter(min, max);
        this.filteredData.priceData = this.filterByPrice(data, min, max);
      }
      if (param === 'stock') {
        const [min, max] = paramValue;
        this.stockRangeInput.recoveryRangeFilter(min, max);
        this.filteredData.stockData = this.filterByStock(data, min, max);
      }
      if (param === 'sort') {
        this.checkSortType(currentParamsObj[param], data);
      }
      if (param === 'landscape') {
        getExistentElement('.layout__portrait').classList.remove('active');
        getExistentElement('.layout__landscape').classList.add('active');
        getExistentElement('.products__container').classList.add('landscape');
      }
      if (param === 'search') {
        getExistentElement<HTMLInputElement>('.sort-input').value = paramValue;
        this.sortInput(data);
      }
    });
  }

  // reset

  resetState(data: Products[]) {
    console.log('reset');
    this.productCount.textContent = '24';
    this.filteredData = new FilteredData(data);
    resetQueryParamsObj();
    Router.setQueryParams();

    this.resetCheckboxFilter();

    this.priceRangeInput.resetRangeFilter();
    this.stockRangeInput.resetRangeFilter();

    this.filteredData.sortData = data.sort((a, b) => a.id - b.id);

    getExistentElement('.layout__portrait').classList.add('active');
    getExistentElement('.layout__landscape').classList.remove('active');
    getExistentElement('.products__container').classList.remove('landscape');
  }

  resetCheckboxFilter() {
    this.categoryFilter.resetSelectedArr();
    this.heightFilter.resetSelectedArr();
    this.saleFilter.resetSelectedArr();

    this.updateCheckbox();
  }
}

export default Filter;
