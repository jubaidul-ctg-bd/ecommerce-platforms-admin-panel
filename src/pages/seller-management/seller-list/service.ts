import request from 'umi-request';
import { TableListParams } from './data.d';
// import {request} from 'src/app'

export async function queryRule(params?: TableListParams) {     
  let value = await request('/sellers/all', {
    params,
  });
  console.log("value", value);
  
  return {data:value}
}

export async function removeRule(params: { id: string }) {  
  return request('/sellers/delete', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function approvalRul(params: any, status: string) {  
  return request('/sellers/update', {
    method: 'POST',
    data: {
      ...params,
      status,
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
