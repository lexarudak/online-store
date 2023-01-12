import { queryParamsTemtplate } from './queryParams';
import { isHTMLElement, getExistentElement } from '../../base/helpers';

function updateMinMax(values: number[]) {
  let min = '';
  let max = '';
  if (values.length) {
    min = values[0] + '';
    max = values[values.length - 1] + '';
  }
  return [min, max];
}

// sort

function addActive(target: HTMLElement) {
  const controls = document.querySelectorAll('.sort-control');
  controls.forEach((control) => {
    if (isHTMLElement(control)) {
      control.style.opacity = '';
    }
  });
  target.style.opacity = '1';
}

// product counter by type

function getTypeNum(typeArr: string[], type: string) {
  const typeCount = typeArr.filter((item) => {
    return item === type;
  });
  return typeCount.length + '' || '0';
}

function getHeightNum(typeArr: string[], height: string) {
  const typeCount = typeArr.filter((item) => {
    return checkHeight(height, +item);
  });
  return typeCount.length + '' || '0';
}

function checkHeight(height: string, item: number) {
  if (height === 'short') return item <= 30;
  if (height === 'medium') return item > 30 && item <= 100;
  return item > 100;
}

function getSaleNum(typeArr: string[]) {
  const typeCount = typeArr.filter((item) => +item);
  return typeCount.length + '' || '0';
}

function showText(length: number) {
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

export default {
  updateMinMax,
  getTypeNum,
  getHeightNum,
  checkHeight,
  getSaleNum,
  isURLValid,
  isURLValueValid,
  showText,
  addActive,
};
