import request from 'umi-request';
import { TableListParams } from './data.d';
// import {request} from 'src/app'

//export async function queryRule(params?: TableListParams) {     
//   return request('/category/allChild', {
//     params,
//   });
// }

export async function queryRule(params?: TableListParams, categoryId?: string) {
  let rqResult = await request('/category/attributeList/'+categoryId);
  return {data:rqResult};
}


export async function categoryQuery() {
  let rqResult = request('/category/showParentCategory');
  console.log("rqResult=============", rqResult);
  return rqResult;
}

export async function approvalRul(params: any, status: string) {  
  return request('/category/updateList', {
    method: 'POST',
    data: {
      ...params,
      status,
    },
  });
}


export async function removeRule(params: { name: string[] }) {
  //console.log("params at removeRule", params);
  return request('/category/deleleAttribute', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/category/attributeCreate', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/category/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
