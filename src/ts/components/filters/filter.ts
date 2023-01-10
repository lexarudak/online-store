import { isHTMLElement, getExistentElement } from '../../base/helpers';
import { Products } from '../../base/types';
import { FilterType } from '../../base/enums';
import RangeInput from './rangeInput';
import CheckboxFilter from './checkboxFilter';
import FilteredData from './filteredData';
import { queryParamsObj, resetQueryParamsObj, setQueryParamsObj, queryParamsTemtplate } from './queryParams';
import CatalogPage from './../../pages/catalog-page';

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

    let type = '';

    if (target.closest('.filter__stock')) {
      const stock = this.stockRangeInput;
      const [min, max] = this.addListenerByType(stock);
      this.filteredData.stockData = this.filterByStock(data, min, max);
      queryParamsObj.stock = min + '-' + max;
      type = 'stock';
    } else if (target.closest('.filter__price')) {
      const price = this.priceRangeInput;
      const [min, max] = this.addListenerByType(price);
      this.filteredData.priceData = this.filterByPrice(data, min, max);
      queryParamsObj.price = min + '-' + max;
      type = 'price';
    }
    return type;
  }

  updateRangeFilter(data: Products[]) {
    const stock = data.map((item) => item.stock).sort((a, b) => a - b);

    let min = '';
    let max = '';
    if (stock.length) {
      min = stock[0] + '';
      max = stock[stock.length - 1] + '';
    }
    // console.log(min, max, stock);
    this.stockRangeInput.recoveryRangeFilter(min, max);
  }

  updatePriceRangeFilter(data: Products[]) {
    const price = data.map((item) => item.price).sort((a, b) => a - b);

    let min = '';
    let max = '';
    if (price.length) {
      min = price[0] + '';
      max = price[price.length - 1] + '';
    }
    this.priceRangeInput.recoveryRangeFilter(min, max);
  }

  addListenerByType(type: RangeInput) {
    type.priceInputMin.addEventListener('change', () => type.changePriceInputMin());
    type.priceInputMax.addEventListener('change', () => type.changePriceInputMax());
    type.rangeInputMin.addEventListener('input', () => type.changeRangeInputMin());
    type.rangeInputMax.addEventListener('input', () => type.changeRangeInputMax());
    type.priceInputMin.addEventListener('input', () => type.validatePriceInput());
    type.priceInputMax.addEventListener('input', () => type.validatePriceInput());
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
    if (!(target instanceof HTMLInputElement)) throw new Error();

    if (target.closest('.filter__type')) {
      this.filteredData.checkCategoryData = this.categoryFilter.checkboxTypeFilter(target, data);
    }
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
    input.value = input.value.replace(/[^a-z0-9\-.,;'()\s]/gi, '');
    const sortInputValue: string = input.value.toLowerCase().trim();
    this.filteredData.inputData = data.filter((item) => {
      return (
        item.title.toLowerCase().includes(sortInputValue) ||
        item.type.toLowerCase().includes(sortInputValue) ||
        item.description.toLowerCase().includes(sortInputValue) ||
        String(item.price).includes(sortInputValue) ||
        String(item.sale).includes(sortInputValue) ||
        String(item.rating).includes(sortInputValue) ||
        String(item.stock).includes(sortInputValue) ||
        String(item.rating).includes(sortInputValue) ||
        String(item.height).includes(sortInputValue)
      );
    });
    queryParamsObj.search = sortInputValue;
  }

  sortBy(target: EventTarget | null, data: Products[]): void {
    if (!isHTMLElement(target) || !target.dataset.sort) throw new Error();
    this.checkSortType(target.dataset.sort, data);
    queryParamsObj.sort = target.dataset.sort;
    this.addActive(target);
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

  addActive(target: HTMLElement) {
    const controls = document.querySelectorAll('.sort-control');
    controls.forEach((control) => {
      if (isHTMLElement(control)) {
        control.style.opacity = '';
      }
    });
    target.style.opacity = '1';
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
    CatalogPage.setQueryParams();
  }

  // data

  getData(type?: string) {
    const data = this.filteredData.getFinalData();
    this.showText(data.length);
    this.currentData = data;
    if (type === 'stock') {
      this.updatePriceRangeFilter(data);
    } else if (type === 'price') {
      this.updateRangeFilter(data);
    } else {
      this.updateRangeFilter(data);
      this.updatePriceRangeFilter(data);
    }
    this.productCount.textContent = data.length + '';
    this.setTypeNum(data);
    this.setHeightNum(data);
    this.setSaleNum(data);
    CatalogPage.setQueryParams();
    return data;
  }

  setTypeNum(data: Products[]) {
    const typeArr: string[] = data.map((item) => item.type.toLowerCase());
    getExistentElement('#succulent').textContent = this.getTypeNum(typeArr, 'succulent');
    getExistentElement('#sansevieria').textContent = this.getTypeNum(typeArr, 'sansevieria');
    getExistentElement('#flowering').textContent = this.getTypeNum(typeArr, 'flowering');
    getExistentElement('#fern').textContent = this.getTypeNum(typeArr, 'fern');
    getExistentElement('#lavender').textContent = this.getTypeNum(typeArr, 'lavender');
    getExistentElement('#cactus').textContent = this.getTypeNum(typeArr, 'cactus');
    getExistentElement('#tree').textContent = this.getTypeNum(typeArr, 'tree');
  }

  setHeightNum(data: Products[]) {
    const typeArr: string[] = data.map((item) => item.height.toString());
    getExistentElement('#short').textContent = this.getHeightNum(typeArr, 'short');
    getExistentElement('#medium').textContent = this.getHeightNum(typeArr, 'medium');
    getExistentElement('#tall').textContent = this.getHeightNum(typeArr, 'tall');
  }

  setSaleNum(data: Products[]) {
    const typeArr: string[] = data.map((item) => item.sale.toString());
    getExistentElement('#true').textContent = this.getSaleNum(typeArr);
  }

  getTypeNum(typeArr: string[], type: string) {
    const typeCount = typeArr.filter((item) => {
      return item === type;
    });
    return typeCount.length + '' || '0';
  }

  getHeightNum(typeArr: string[], height: string) {
    const typeCount = typeArr.filter((item) => {
      return this.checkHeight(height, +item);
    });
    return typeCount.length + '' || '0';
  }

  getSaleNum(typeArr: string[]) {
    const typeCount = typeArr.filter((item) => +item);
    return typeCount.length + '' || '0';
  }

  checkHeight(height: string, item: number) {
    if (height === 'short') return item <= 30;
    if (height === 'medium') return item > 30 && item <= 100;
    return item > 100;
  }

  showText(length: number) {
    const container = getExistentElement('.products__container');
    if (!length) {
      container.style.fontSize = '30px';
      container.style.fontWeight = '500';
      container.style.color = '#22795D';
      container.innerHTML = 'NOT FOUND :(';
    } else {
      container.style.fontSize = '';
      container.style.fontWeight = '';
      container.style.color = '';
      container.innerHTML = '';
    }
  }

  // recovery

  recoveryState(data: Products[]) {
    if (!window.location.search) CatalogPage.setQueryParams();
    const url = new URL(window.location.href);
    if (!url.search) return;
    const currentParamsList = url.search.slice(1).split('&');
    const currentParamsObj = Object.fromEntries(currentParamsList.map((el) => el.split('=')));
    const paramsKeys = Object.keys(currentParamsObj);
    setQueryParamsObj(currentParamsObj);
    paramsKeys.forEach((param: string) => {
      const paramValue = currentParamsObj[param].split('-');
      this.isURLValid(param);
      if (param === FilterType.category) {
        this.isURLValueValid('ckeckValues', param, paramValue);
        this.categoryFilter.selectedArr = paramValue;
        this.filteredData.checkCategoryData = this.categoryFilter.checkboxTypeFilt(this.currentData);
        this.updateCheckbox();
      }
      if (param === FilterType.height) {
        this.isURLValueValid('ckeckValues', param, paramValue);
        this.heightFilter.selectedArr = paramValue;
        this.filteredData.checkHeightData = this.heightFilter.checkboxTypeFilt(this.currentData);
        this.updateCheckbox();
      }
      if (param === FilterType.sale) {
        this.isURLValueValid('ckeckValues', param, paramValue);
        this.saleFilter.selectedArr = paramValue;
        this.filteredData.checkSaleData = this.saleFilter.checkboxTypeFilt(this.currentData);
        this.updateCheckbox();
      }
      if (param === 'price') {
        this.isURLValueValid('ckeckRange', param, paramValue, 100);
        const [min, max] = paramValue;
        this.priceRangeInput.recoveryRangeFilter(min, max);
        this.filteredData.priceData = this.filterByPrice(data, min, max);
      }
      if (param === 'stock') {
        this.isURLValueValid('ckeckRange', param, paramValue, 65);
        const [min, max] = paramValue;
        this.stockRangeInput.recoveryRangeFilter(min, max);
        this.filteredData.stockData = this.filterByStock(data, min, max);
      }
      if (param === 'sort') {
        if (!queryParamsTemtplate[param].includes(currentParamsObj[param])) {
          delete queryParamsObj.sort;
        }
        this.checkSortType(currentParamsObj[param], data);
        const sortEl = getExistentElement(`[data-sort = ${currentParamsObj[param]}]`);
        this.addActive(sortEl);
      }
      if (param === 'landscape') {
        this.isURLValueValid('ckeckValues', param, paramValue);
        getExistentElement('.layout__portrait').classList.remove('active');
        getExistentElement('.layout__landscape').classList.add('active');
        getExistentElement('.products__container').classList.add('landscape');
      }
      if (param === 'search') {
        let searchValue = decodeURI(currentParamsObj[param]);
        while (searchValue.includes('%2C') || searchValue.includes('+')) {
          searchValue = searchValue.replace('%2C', ',').replace('+', ' ');
        }
        getExistentElement<HTMLInputElement>('.sort-input').value = searchValue;
        this.sortInput(data);
      }
    });
  }

  isURLValid(urlParamKey: string) {
    const paramsKeys = Object.keys(queryParamsTemtplate);
    if (!paramsKeys.includes(urlParamKey)) {
      history.back();
    }
  }

  isURLValueValid(filterType: string, param: string, paramValue: string[], max?: number) {
    let errors = 0;
    const validValues = queryParamsTemtplate[param];
    if (filterType === 'ckeckValues' && paramValue.length) {
      paramValue.forEach((value) => {
        if (!validValues.includes(value)) {
          errors++;
        }
      });
    } else if (filterType === 'ckeckRange' && paramValue.length && max) {
      if (paramValue.length !== 2 || +paramValue[0] >= +paramValue[1] || +paramValue[0] < 1 || +paramValue[2] > max) {
        errors++;
      }
    }
    if (errors) history.back();
  }

  // reset

  resetState(data: Products[]) {
    this.showText(24);
    this.productCount.textContent = '24';
    this.filteredData = new FilteredData(data);
    resetQueryParamsObj();
    CatalogPage.setQueryParams();

    this.resetCheckboxFilter();

    this.priceRangeInput.resetRangeFilter();
    this.stockRangeInput.resetRangeFilter();

    this.filteredData.sortData = data.sort((a, b) => a.id - b.id);

    getExistentElement('.layout__portrait').classList.add('active');
    getExistentElement('.layout__landscape').classList.remove('active');
    getExistentElement('.products__container').classList.remove('landscape');

    getExistentElement<HTMLInputElement>('.sort-input').value = '';
    this.resetTypeCount();
    const controls = document.querySelectorAll('.sort-control');
    controls.forEach((control) => {
      if (isHTMLElement(control)) {
        control.style.opacity = '';
      }
    });
  }

  resetCheckboxFilter() {
    this.categoryFilter.resetSelectedArr();
    this.heightFilter.resetSelectedArr();
    this.saleFilter.resetSelectedArr();

    this.updateCheckbox();
  }

  resetTypeCount() {
    getExistentElement('#succulent').textContent = '6';
    getExistentElement('#sansevieria').textContent = '3';
    getExistentElement('#flowering').textContent = '5';
    getExistentElement('#fern').textContent = '2';
    getExistentElement('#lavender').textContent = '2';
    getExistentElement('#cactus').textContent = '3';
    getExistentElement('#tree').textContent = '3';
    getExistentElement('#short').textContent = '10';
    getExistentElement('#medium').textContent = '9';
    getExistentElement('#tall').textContent = '5';
    getExistentElement('#true').textContent = '18';
  }
}

export default Filter;
