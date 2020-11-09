import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox } from 'antd';
import React, { useState } from 'react';
import { Dispatch, Link, connect } from 'umi';
import { StateType } from './model';
import styles from './style.less';
import { LoginParamsType } from './service';
import LoginFrom from './components/Login';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginFrom;
interface LoginProps {
  dispatch: Dispatch;
  userAndlogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userAndlogin = {}, submitting } = props;
  const { status, type: loginType } = userAndlogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');

  const handleSubmit = (values: LoginParamsType) => {
    const { dispatch } = props;
    dispatch({
      type: 'userAndlogin/login',
      payload: {
        ...values,
        type,
      },
    });
  };
  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="Admin Account Login">
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="Incorrect account or password （admin/ant.design）" />
          )}

          <UserName
            name="userName"
            placeholder="email or phone"
            rules={[
              {
                required: true,
                message: 'Please enter user name!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="password"
            rules={[
              {
                required: true,
                message: 'Please enter the password!',
              },
            ]}
          />
        </Tab>
        {/* <Tab key="mobile" tab="Mobile number login">
          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="Verification code error" />
          )}
          <Mobile
            name="mobile"
            placeholder="phone number"
            rules={[
              {
                required: true,
                message: 'Please enter phone number!',
              },
              {
                pattern: /^1\d{10}$/,
                message: 'Malformed phone number!',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="Verification code"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="second"
            rules={[
              {
                required: true,
                message: 'Please enter verification code!',
              },
            ]}
          />
        </Tab> */}
        <div>
          <Checkbox checked={autoLogin} onChange={(e) => setAutoLogin(e.target.checked)}>
            automatic log-in
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            Forget password
          </a>
        </div>
        <Submit loading={submitting}>Login</Submit>
        <div className={styles.other}>
          {/* Other login methods */}
          {/* <AlipayCircleOutlined className={styles.icon} />
          <TaobaoCircleOutlined className={styles.icon} />
          <WeiboCircleOutlined className={styles.icon} /> */}
          {/* <Link className={styles.register} to="/user/register">
            Register account
          </Link> */}
        </div>
      </LoginFrom>
    </div>
  );
};

export default connect(
  ({
    userAndlogin,
    loading,
  }: {
    userAndlogin: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userAndlogin,
    submitting: loading.effects['userAndlogin/login'],
  }),
)(Login);
