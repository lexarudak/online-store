import { QueryParams } from '../../base/types';

export function resetQueryParamsObj() {
  queryParamsObj = {};
}

export function setQueryParamsObj(obj: Partial<QueryParams>) {
  obj ? (queryParamsObj = obj) : (queryParamsObj = {});
}

export let queryParamsObj: Partial<QueryParams> = {};
