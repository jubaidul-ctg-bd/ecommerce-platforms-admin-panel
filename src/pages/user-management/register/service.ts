import request from 'umi-request';
import { UserRegisterParams } from './index';

export async function fakeRegister(params: UserRegisterParams) {
  const hell = await request('/user/registration', {
    method: 'POST',
    data: params,
  });
  
  if(hell) {
    hell.status = 'ok'
  }
  return hell;
}
