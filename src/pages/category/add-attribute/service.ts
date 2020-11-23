import request from 'umi-request';
import { TableListParams } from './data.d';
// import {request} from 'src/app'

//export async function queryRule(params?: TableListParams) {     
//   return request('/category/allChild', {
//     params,
//   });
// }

export async function queryRule(params?: TableListParams, categoryId?: string) {
  let rqResult = await request('/term/attributeList/');
  console.log("rqResult", rqResult);
  return {data:rqResult};
}


export async function categoryQuery() {
  let rqResult = request('/term/showParentCategory');
  console.log("rqResult=============", rqResult);
  return rqResult;
}

export async function approvalRul(params: any, status: string) {  
  return request('/term/updateList', {
    method: 'POST',
    data: {
      ...params,
      status,
    },
  });
}


export async function removeRule(params: { id: string }) {
  //console.log("params at removeRule", params);
  return request('/term/deleteAttribute', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/term/createTerm', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/term/attribute/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
