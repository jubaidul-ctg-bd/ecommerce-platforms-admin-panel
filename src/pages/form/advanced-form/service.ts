import request from 'umi-request';

export async function fakeSubmitForm(params: any) {
  console.log("asdf=============",params);
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}
