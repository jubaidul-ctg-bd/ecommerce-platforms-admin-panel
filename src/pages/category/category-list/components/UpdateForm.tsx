import {
  Form,
  Select,
  Radio,
  Button,
  Card,  
  Input,
  Modal,
  Image,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect, Dispatch, FormattedMessage, formatMessage } from 'umi';
import React, { FC, useEffect, useState } from 'react';
import { Cascader } from 'antd';
import MediaWall from '../../add-category/components/MediaWall';
import { categoryQuery } from '../../add-category/service'
import proSettings from '../../../../../config/defaultSettings';
import { TableListItem } from '../data';


function onChange(value: any) {
  //console.log(value);
}

// Just show the latest item.
function displayRender(label: any) {
  return label[label.length - 1];
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

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}




function onChangeSelect(value: any) {
  console.log(`selected ${value}`);
}

function onSearch(val: any) {
  console.log('search:', val);
}


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;


const UpdateForm: FC<UpdateFormProps> = (props) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  // const [value, updateValue] = useState<string>(null);
  const [value1, updateValue1] = useState<string>('');
  const [value2, updateValue2] = useState<string>('');
  const [value3, updateValue3] = useState<string>('');
  const [name, updateName] = useState<string>('');
  const [formVals, setFormVals] = useState<FormValueType>({
    title: props.values.title,
    // parentCategories: props.values.parentTermValue,
    id: props.values.id,
    order: props.values.order,
    description: props.values.description,
    icon: props.values.icon,
    image: props.values.image,
    banner: props.values.banner,
    status: props.values.status,
    slug: props.values.slug,
  });

  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;


  const [options, setOptions] = useState([])
  useEffect(() => {
    getOptions(); 
    setImageValue();
  },[])

  const setImageValue = () => {
    updateValue1(formVals.icon || '');
    updateValue2(formVals.image || '');
    updateValue3(formVals.banner || '');
  }

  form.setFieldsValue({
    icon: value1,
    image: value2,
    banner: value3,
  });   
  console.log(value1, value2, value3);
  
  const getOptions = async() => {
    let val = await categoryQuery();
    setOptions(val);    
  }

  const update = {
    value1,
    value2,
    value3,
    name,
  }

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

  const onFinish = (values: { [key: string]: any }) => {
    const { dispatch } = props;
    dispatch({
      type: 'categoryAdd/submitRegularForm',
      payload: values,
    });
    form.resetFields();
    updateValue1('');
    updateValue2('');
    updateValue3('');
  };

  const onFinishFailed = (errorInfo: any) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const onValuesChange = (changedValues: { [key: string]: any }) => {
    const { publicType } = changedValues;
    if (publicType) setShowPublicUsers(publicType === '2');
  };

  const modelreq = (e) => {
    handleModalVisible(true);
    updateName(e);
  }

  const getUrl = (e) => {
    handleModalVisible(e.modelSate);
    updateName(e.name);
    if(e.name=="icon") updateValue1(e.url);
    else if(e.name=="image")updateValue2(e.url);
    else if(e.name=="banner")updateValue3(e.url);
    
  }


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
      <Card bordered={false}>
      <Form 
         form={form}
         initialValues={{
            title: formVals.title,
            // parentCategories: formVals.parentCategories,
            order: formVals.order,
            description: formVals.description,
            name: formVals.name,
            icon: formVals.icon,
            banner: formVals.banner,
            image: formVals.image,
            slug: formVals.slug,
            // status: formVals.status,
         }}
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
            label={<FormattedMessage id="formandbasic-form.slug.label" />}
            name="slug"
            rules={[
              {
                // required: true,
                message: formatMessage({ id: 'formandbasic-form.slug.required' }),
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
              fieldNames={{ label: 'title', value: 'id', children: 'childTermValues' }}
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
