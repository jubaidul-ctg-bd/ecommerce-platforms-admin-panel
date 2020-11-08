import { Effect } from 'umi';
import { message } from 'antd';
import { fakeSubmitForm } from './service';

export interface ModelType {
  namespace: string;
  state: {};
  effects: {
    submitRegularForm: Effect;
  };
}
const Model: ModelType = {
  namespace: 'categoryAdd',

  state: {},

  effects: {
    *submitRegularForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('Submitted successfully');
    },
  },
};

export default Model;
