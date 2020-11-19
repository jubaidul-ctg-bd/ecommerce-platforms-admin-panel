import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps } from 'antd';

import { TableListItem } from '../data.d';
import { formatMessage, FormattedMessage } from 'umi';
import styles from '../style.less';



const InputGroup = Input.Group;


function handleChange(value) {
  console.log(`selected ${value}`);
}

export interface FormValueType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
  phone?:string
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
}
const FormItem = Form.Item;
const { Option } = Select;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  // labelCol: { span: 7 },
  // wrapperCol: { span: 13 },
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [formVals, setFormVals] = useState<FormValueType>({
    name: props.values.name,
    mail: props.values.mail,
    id: props.values.id,
    cellNo: props.values.cellNo,
    role: props.values.role,
  });

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [form] = Form.useForm();

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;



  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });
    handleUpdate({ ...formVals, ...fieldsValue });
  };

 

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>cancel</Button>
        <Button type="primary" onClick={() => handleNext()}>
          Update
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="Update User"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
     
        <Form 
         {...formLayout}
         form={form}
         initialValues={{
           name: formVals.name,
           mail: formVals.mail,
           role: formVals.role,
           cellNo: formVals.cellNo,
         }}
        >
          <FormItem
            name="name"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandregister.name.required' }),
              },
            ]}
          >
            <Input 
              size="large"
              placeholder={formatMessage({ id: 'userandregister.name.placeholder' })} />
          </FormItem>

          <FormItem
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
              size="large"
              placeholder={formatMessage({ id: 'userandregister.email.placeholder' })}
            />
          </FormItem>
         
          <InputGroup compact>
            <Select size="large" value={88}  style={{ width: '20%' }}>
              <Option value="88">88</Option>
              {/* <Option value="87">+87</Option> */}
            </Select>
            <FormItem
              style={{ width: '80%' }}
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
                size="large"
                placeholder={formatMessage({ id: 'userandregister.phone-number.placeholder' })}
              />
            </FormItem>
          </InputGroup>
          
          <FormItem
            name="role"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'userandregister.role.required' }),
              },
            ]}
          >
            <Select size="large" placeholder="User Type" style={{ width: "100%" }} onChange={handleChange}>
              <Option value="ebhubon-admin">Admin</Option>
              <Option value="user">User</Option>
              {/* <Option value="ebhubon-seller">eBhubon Seller</Option> */}
            </Select>
          </FormItem>
          {/* <FormItem>
            <Button
              size="large"
              // loading={submitting}
              // className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="userandregister.register.register" />
            </Button>
            {/* <Link className={styles.login} to="/user/login">
              <FormattedMessage id="userandregister.register.sign-in" />
            </Link> 
          </FormItem> */}
        </Form>
    </Modal>
  );
};

export default UpdateForm;
