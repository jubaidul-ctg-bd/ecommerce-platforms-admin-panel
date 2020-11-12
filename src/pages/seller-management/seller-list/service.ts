import request from 'umi-request';


export async function queryRule() {
  console.log("params at queryRule");
  let rqResult = request('/media/media');
  console.log("rqResult=============", rqResult);
  return rqResult;
}

export async function removeRule(params: { name: string[] }) {
  console.log("params at removeRule", params);
  return request('/media/deleteImage', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function upload(file) {
  let formData = new FormData();
    formData.append('file', file);
    formData.append('domain', 'POST');
    formData.append('filename', file.name );

    try {
    const response = await request('/media/upload', {
      method: 'POST',
      body: formData
    });
    const data = response.json();
    return data.data;
  } catch (error) {
    console.log('Error fetching profile ' + error);
  }      
  // return request('/media/upload', {
  //   method: 'POST',
  //   data: {
      
  //   },
  // });
}




// export async function queryRule(params?: TableListParams) {
//   console.log("params at queryRule",params);
//   let rqResult = request('http://localhost:3000/cats', {
//     params,
//   });
//   return rqResult;
// }