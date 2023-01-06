import { QueryParams } from '../../base/types';

function getQueryParamsObj() {
  const oldQueryParams = localStorage.getItem('queryParams');
  return oldQueryParams ? JSON.parse(oldQueryParams) : {};
}

export function resetQueryParamsObj() {
  queryParamsObj = {};
  localStorage.removeItem('queryParams');
}

export let queryParamsObj: QueryParams = getQueryParamsObj();
