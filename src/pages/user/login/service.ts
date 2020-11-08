import Password from 'antd/lib/input/Password';
import request from 'umi-request';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

//http://192.168.0.107:3000/api/auth/login
///api/login/account
export async function fakeAccountLogin(params: LoginParamsType) {
  let hell = await request('/api/auth/login', {
    method: 'POST',
    data: {
      "email": params.userName,
      "password": params.password,
    }
  });

  //return hell;
  
  console.log(hell);

  if (hell) {
    return {
      status: 'ok',
      currentAuthority: 'admin',
    }
  }
  else return {status: 'ok'}

  // if(hell.access_token)
  //       status: 'ok',
  //       type,
  //       currentAuthority: 'admin',
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
