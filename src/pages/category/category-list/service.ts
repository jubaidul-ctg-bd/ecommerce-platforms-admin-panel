import request from 'umi-request';
import { TableListParams } from './data.d';
// import {request} from 'src/app'

//export async function queryRule(params?: TableListParams) {     
//   return request('/category/allChild', {
//     params,
//   });
// }

export async function queryRule() {
  console.log("params at queryRule");
  let rqResult = await request('/term/all');
  return {data:rqResult};
}


export async function categoryQuery() {
  let rqResult = await request('/term/allchild');
  return  {data:rqResult};
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
  console.log("params=======", params);
  
  return request('/term/delete', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
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
  return request('/term/update', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}


export async function queryAttributes(params?: TableListParams) {
  let rqResult = await request('/term/attributeList/');
  console.log(rqResult);
  
  return rqResult
}
