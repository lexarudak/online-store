import { getExistentElement } from '../../base/helpers';
import { StrObj, Products } from '../../base/types';
import { FilterType } from '../../base/enums';
import Filter from './filter';
import filterHelpers from './filterHelpers';
import { queryParamsObj, queryParamsTemtplate } from './queryParams';

// recovery

export function recovery(data: Products[], currentParamsObj: StrObj, filter: Filter) {
  const paramsKeys = Object.keys(currentParamsObj);
  paramsKeys.forEach((param: string) => {
    const paramValue = currentParamsObj[param].split('-');
    isURLValid(param);
    if (param === FilterType.category) {
      isURLValueValid('ckeckValues', param, paramValue);
      filter.categoryFilter.selectedArr = paramValue;
      filter.filteredData.checkCategoryData = filter.categoryFilter.checkboxTypeFilt(filter.currentData);
      filter.updateCheckbox();
    }
    if (param === FilterType.height) {
      isURLValueValid('ckeckValues', param, paramValue);
      filter.heightFilter.selectedArr = paramValue;
      filter.filteredData.checkHeightData = filter.heightFilter.checkboxTypeFilt(filter.currentData);
      filter.updateCheckbox();
    }
    if (param === FilterType.sale) {
      isURLValueValid('ckeckValues', param, paramValue);
      filter.saleFilter.selectedArr = paramValue;
      filter.filteredData.checkSaleData = filter.saleFilter.checkboxTypeFilt(filter.currentData);
      filter.updateCheckbox();
    }
    if (param === 'price') {
      isURLValueValid('ckeckRange', param, paramValue, 100);
      const [min, max] = paramValue;
      filter.priceRangeInput.recoveryRangeFilter(min, max);
      filter.filteredData.priceData = filter.filterByPrice(data, min, max);
    }
    if (param === 'stock') {
      isURLValueValid('ckeckRange', param, paramValue, 65);
      const [min, max] = paramValue;
      filter.stockRangeInput.recoveryRangeFilter(min, max);
      filter.filteredData.stockData = filter.filterByStock(data, min, max);
    }
    if (param === 'sort') {
      if (!queryParamsTemtplate[param].includes(currentParamsObj[param])) delete queryParamsObj.sort;
      filter.checkSortType(currentParamsObj[param], data);
      const sortEl = getExistentElement(`[data-sort = ${currentParamsObj[param]}]`);
      filterHelpers.addActive(sortEl);
    }
    if (param === 'landscape') {
      isURLValueValid('ckeckValues', param, paramValue);
      getExistentElement('.layout__portrait').classList.remove('active');
      getExistentElement('.layout__landscape').classList.add('active');
      getExistentElement('.products__container').classList.add('landscape');
    }
    if (param === 'search') {
      let searchValue: string = currentParamsObj[param];
      while (searchValue.includes('%2C') || searchValue.includes('+')) {
        searchValue = searchValue.replace('%2C', ',').replace('+', ' ');
      }
      getExistentElement<HTMLInputElement>('.sort-input').value = searchValue;
      filter.searchInput(data);
    }
  });
}

function isURLValid(urlParamKey: string) {
  const paramsKeys = Object.keys(queryParamsTemtplate);
  if (!paramsKeys.includes(urlParamKey)) {
    history.back();
  }
}

function isURLValueValid(filterType: string, param: string, paramValue: string[], max?: number) {
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
