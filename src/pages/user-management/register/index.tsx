import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Button, Col, Input, Popover, Progress, Row, Select, message, Card } from 'antd';
import React, { FC, useState, useEffect } from 'react';
import { Link, connect, history, FormattedMessage, formatMessage, Dispatch } from 'umi';

import { StateType } from './model';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="userandregister.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="userandregister.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="userandregister.strength.short" />
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

interface RegisterProps {
  dispatch: Dispatch;
  userregister: StateType;
  submitting: boolean;
}

export interface UserRegisterParams {
  mail: string;
  password: string;
  confirm: string;
  mobile: string;
  captcha: string;
  prefix: string;
}

function handleChange(value) {
  console.log(`selected ${value}`);
}

const Register: FC<RegisterProps> = ({ submitting, dispatch, userregister }) => {
  const [count, setcount]: [number, any] = useState(0);
  const [visible, setvisible]: [boolean, any] = useState(false);
  const [prefix, setprefix]: [string, any] = useState('88');
  const [popover, setpopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  };

  const submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  };
  let interval: number | undefined;
  const [form] = Form.useForm();
  useEffect(() => {
    if (!userregister) {
      return;
    }
    const account = form.getFieldValue('mail');
    console.log("userAndregister", userregister);
    
    if (userregister.status === 'ok') {
      delete userregister.status;
      message.success('Registration success!');
      form.resetFields();
      // history.push({
      //   pathname: '/user/register-result',
      //   state: {
      //     account,
      //   },
      // });
    }
    else {
      
    }
  }, [userregister]);
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [],
  );
  const onGetCaptcha = () => {
    let counts = 59;
    setcount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setcount(counts);
      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };
  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  const onFinish = (values: { [key: string]: any }) => {
    dispatch({
      type: 'userregister/submit',
      payload: {
        ...values,
        prefix,
      },
    });
  };
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject(formatMessage({ id: 'userandregister.password.twice' }));
    }
    return promise.resolve();
  };
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setvisible(!!value);
      return promise.reject(formatMessage({ id: 'userandregister.password.required' }));
    }
    // 有值的情况
    if (!visible) {
      setvisible(!!value);
    }
    setpopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };
  const changePrefix = (value: string) => {
    setprefix(value);
  };
  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  


  return (
    <PageHeaderWrapper>
       <Card bordered={false}>
     
        <Form 
          style={{ marginTop: 8 }}
          form={form} 
          name="UserRegister" 
          onFinish={onFinish}

        >
          <FormItem
          {...formItemLayout}
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandregister.name.required' }),
              },
            ]}
          >
            <Input 
              placeholder={formatMessage({ id: 'userandregister.name.placeholder' })} />
          </FormItem>

          <FormItem
          {...formItemLayout}
            label="Email"
            name="mail"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandregister.email.required' }),
              },
              {
                type: 'email',
                message: formatMessage({ id: 'userandregister.email.wrong-format' }),
              },
            ]}
          >
            <Input
              placeholder={formatMessage({ id: 'userandregister.email.placeholder' })}
            />
          </FormItem>
          <Popover
            getPopupContainer={(node) => {
              if (node && node.parentNode) {
                return node.parentNode as HTMLElement;
              }
              return node;
            }}
            content={
              visible && (
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[getPasswordStatus()]}
                  {renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FormattedMessage id="userandregister.strength.msg" />
                  </div>
                </div>
              )
            }
            overlayStyle={{ width: 240 }}
            placement="right"
            visible={visible}
          >
            <FormItem
            {...formItemLayout}
              label="Password"
              name="password"
              className={
                form.getFieldValue('password') &&
                form.getFieldValue('password').length > 0 &&
                styles.password
              }
              rules={[
                {
                  required:  true,
                  validator: checkPassword,
                },
              ]}
            >
              <Input
                type="password"
                placeholder={formatMessage({ id: 'userandregister.password.placeholder' })}
              />
            </FormItem>
          </Popover>
          <FormItem
            {...formItemLayout}
            label="Confirm Password"
            name="confirm"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandregister.confirm-password.required' }),
              },
              {
                validator: checkConfirm,
              },
            ]}
          >
            <Input
              type="password"
              placeholder={formatMessage({ id: 'userandregister.confirm-password.placeholder' })}
            />
          </FormItem>
         
          <FormItem
            {...formItemLayout}
            label="Cell No"
            name="cellNo"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandregister.phone-number.required' }),
              },
              {
                pattern: /^\d{11}$/,
                message: formatMessage({ id: 'userandregister.phone-number.wrong-format' }),
              },
            ]}
          >
            <Input
              prefix="+88"
              placeholder={formatMessage({ id: 'userandregister.phone-number.placeholder' })}
            />
          </FormItem>
          <FormItem
          {...formItemLayout}
            label="User Role"
            name="role"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandregister.role.required' }),
              },
            ]}
          >
            <Select placeholder="User Role"  onChange={handleChange}>
              <Option value="ebhubon-admin">Admin</Option>
              <Option value="user">User</Option>
              {/* <Option value="ebhubon-seller">eBhubon Seller</Option> */}
            </Select>
          </FormItem>
          <FormItem
          {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="userandregister.register.register" />
            </Button>
            {/* <Link className={styles.login} to="/user/login">
              <FormattedMessage id="userandregister.register.sign-in" />
            </Link> */}
          </FormItem>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};
export default connect(
  ({
    userregister,
    loading,
  }: {
    userregister: StateType;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    userregister,
    submitting: loading.effects['userregister/submit'],
  }),
)(Register);
