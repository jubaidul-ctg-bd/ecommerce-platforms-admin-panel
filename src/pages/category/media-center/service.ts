import request from 'umi-request';


export async function queryRule() {
  console.log("params at queryRule");
  let rqResult = request('http://localhost:3000/cats/media');
  console.log("rqResult=============", rqResult);
  return rqResult;
}

export async function removeRule(params: { name: string[] }) {
  console.log("params at removeRule", params);
  return request('http://localhost:3000/cats/deleteImage', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}


// export async function queryRule(params?: TableListParams) {
//   console.log("params at queryRule",params);
//   let rqResult = request('http://localhost:3000/cats', {
//     params,
//   });
//   return rqResult;
// }