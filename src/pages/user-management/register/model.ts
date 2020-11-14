import { message } from 'antd';
import { Effect, Reducer } from 'umi';

import { fakeRegister } from './service';

export interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    submit: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
  };
}
// userAndregister
const Model: ModelType = {
  namespace: 'userregister',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      console.log("response", response);
      
      if(response.status!="ok") message.error(response);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {      
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

export default Model;
