import request from 'umi-request';
import { TableListParams } from './data.d';

export async function queryRule(params?: TableListParams) {
  console.log("params at queryRule",params);
  let rqResult = request('http://localhost:3000/cats', {
    params,
  });
  return rqResult;
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/product_list', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('http://localhost:3000/cats', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/product_list', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
