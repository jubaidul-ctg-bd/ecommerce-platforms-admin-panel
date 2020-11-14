import React, { useState } from 'react';
import { Form, Button, DatePicker, Input, Modal, Radio, Select, Steps, Card } from 'antd';

import { TableListItem } from '../data.d';
import { formatMessage, FormattedMessage } from 'umi';
import MediaWall from './MediaWall';




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
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

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
    _id: props.values._id,
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
          
        </Form>
     
          <Card bordered={false}>
            <Form
              hideRequiredMark
              style={{ marginTop: 8 }}
              form={form}
              name="basic"
              initialValues={{ public: '1' }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onValuesChange={onValuesChange}
            >
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="formandbasic-form.title.label" />}
                name="title"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'formandbasic-form.title.required' }),
                  },
                ]}
              >
                <Input placeholder={formatMessage({ id: 'formandbasic-form.title.placeholder' })} />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="formandbasic-form.parent-category.label" />}
                name="parentCategories"
              >
                <Cascader
                  fieldNames={{ label: 'title', value: '_id', children: 'children' }}
                  options={options}
                  expandTrigger="hover"
                  displayRender={displayRender}
                  onChange={onChange}
                  changeOnSelect={true}              
                />
              </FormItem>      
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="formandbasic-form.order.label" />}
                name="order"
              >
                <Select
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={onChangeSelect}
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                </Select>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="formandbasic-form.description.label" />}
                name="description"
              >
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder={formatMessage({ id: 'formandbasic-form.description.placeholder' })}
                  rows={4}
                />
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="formandbasic-form.status.label" />}
                name="status"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'formandbasic-form.status.required' }),
                  },
                ]}
              >
                <div>
                  <Radio.Group>
                    <Radio value="published">
                      <FormattedMessage id="formandbasic-form.radio.publish" />
                    </Radio>
                    <Radio value="unpublished">
                      <FormattedMessage id="formandbasic-form.radio.unpublish" />
                    </Radio>
                  </Radio.Group>
                </div>
              </FormItem>
              

              <Form.Item
                {...formItemLayout}
                name="icon"
                label="Icon"
              >            
                <Button icon={<UploadOutlined />} onClick={() => modelreq("icon")} >
                  Click to upload
                </Button>
                {update.value1 ? (
                  <Input 
                    name="icon"
                    prefix={<Image
                    width={50}
                    src={proSettings.baseUrl+"/media/image/"+update.value1}
                  />} disabled/>
                ) : null}
              </Form.Item>

              <Form.Item
                {...formItemLayout}
                name="image"
                label="Image"
              >            
                <Button icon={<UploadOutlined />} onClick={() => modelreq("image")} >
                  Click to upload
                </Button>
                {update.value2 ? (
                  <Input 
                    name="image"
                    prefix={<Image
                    width={50}
                    src={proSettings.baseUrl+"/media/image/"+update.value2}
                  />} disabled/>
                ) : null}
              </Form.Item>

                  
              <Form.Item
                {...formItemLayout}
                name="banner"
                label="Banner"
              >            
                <Button icon={<UploadOutlined />} onClick={() => modelreq("banner")}>
                  Click to upload
                </Button>
                {update.value3 ? (
                  <Input 
                    name="banner" 
                    prefix={<Image
                    width={50}
                    src={proSettings.baseUrl+"/media/image/"+update.value3}
                  />} disabled/>
                ) : null}
              </Form.Item>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  <FormattedMessage id="formandbasic-form.form.submit" />
                </Button>
                <Button style={{ marginLeft: 8 }}>
                  <FormattedMessage id="formandbasic-form.form.save" />
                </Button>
              </FormItem>
            </Form>
          </Card>

          <Modal
            destroyOnClose
            title="Media Center"
            visible={createModalVisible}
            onCancel={() => handleModalVisible(false)}
            //footer={null}
            onOk={() => handleModalVisible(false)}
            width={1000}
          >
            <MediaWall 
              updateurl={(e) => getUrl(e)}
              reqName={name}
            >
              
            </MediaWall>
              
          </Modal>

        
    </Modal>
  );
};

export default UpdateForm;
