import request from 'umi-request';
// import  proSettings  from '../../../../config/defaultSettings';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
}

export async function fakeAccountLogin(params: LoginParamsType) {
  const auth = await request('/user/login', {
    method: 'POST',
    data: {
      username: params.userName,
      password: params.password,
    },
  });
  console.log("auth======", auth.role);
  if(auth.status==="ok" && auth.role=="ebhubon-admin")
  {
    localStorage.setItem("access_token", auth.access_token)
    // proSettings.authToken = auth.access_token;
    return {
    status: 'ok',
    currentAuthority: 'admin',
  };
  }
  else return {
    status: 'error',
    currentAuthority: 'guest',
  }
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
