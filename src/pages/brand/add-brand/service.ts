import request from 'umi-request';

export async function fakeSubmitForm(params: any) {
  params.term = 'Brand'
  return request('/term/createCategory', {
    method: 'POST',
    data: params,
  });
}


export async function categoryQuery(params?: {term: string}) {
  let rqResult = await request('/term/allchild', {
    params,
  });
  return rqResult;
}

export async function queryRule() {
  //console.log("params at queryRule");
  let rqResult = request('/term/allChild');
  console.log("rqResult=============", rqResult);
  return rqResult;
}

export async function querySlug(params: { slug: string }) {
  console.log("params", params.slug);
  
  return request('/term/getSlug', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function queryTermValues(params: { title: string }) {
  return request('/term/getOrder', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// export async function removeRule(params: { name: string[] }) {
//   //console.log("params at removeRule", params);
//   return request('http://localhost:3000/cats/deleteImage', {
//     method: 'POST',
//     data: {
//       ...params,
//       method: 'delete',
//     },
//   });
// }


