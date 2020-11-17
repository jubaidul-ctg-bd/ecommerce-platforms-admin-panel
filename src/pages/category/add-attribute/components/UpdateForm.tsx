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
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { connect, Dispatch, FormattedMessage, formatMessage } from 'umi';
import React, { FC, useEffect, useState } from 'react';
import { Cascader } from 'antd';
import MediaWall from '../../add-category/components/MediaWall';
import { categoryQuery } from '../../add-category/service'
import proSettings from '../../../../../config/defaultSettings';
import { TableListItem } from '../data';




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
  const [attrTpyeValue, setAttrTpyeValue] = useState<string>('');
  const [categoryTitle, setCategoryTitle] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [formVals, setFormVals] = useState<FormValueType>({
    _id: props.values._id,
    categoriesId: props.values.categoriesId,
    attrTitle: props.values.attrTitle,
    attrType: props.values.attrType,
    attrOption: props.values.attrOption,
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
    setAttrTpyeValue(formVals.attrType || '');
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

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
      md: { span: 10, offset: 7 },
    },
  };


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

  function onChange(value) {
    setAttrTpyeValue(value);
    console.log(`selected ${value}`);
  }

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

  function onChangeCascader(value) {
    // setCategoryId(value)
    // actionRef.current.reload();
    console.log(`selected ${value}`);
  }

 

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
          attrTitle: formVals.attrTitle,
          attrType: formVals.attrType,
          attrOption: formVals.attrOption,
          categoriesId: formVals.categoriesId,
            // status: formVals.status,
         }}
        >
          {/* {!(categoryId && categoryTitle) ? ( */}
            <FormItem
              {...formItemLayout}
              label="Category"
              name="categoriesId"
              rules={[
                {
                  required: true,
                  message: "Please, select the Category",
                },
              ]}
            >
              <Cascader
                fieldNames={{ label: 'title', value: '_id', children: 'children' }}
                options={options}
                expandTrigger="hover"
                displayRender={displayRender}
                onChange={onChangeCascader}
                changeOnSelect={true}              
              />
            </FormItem>   
            {/* ) : null}  */}
            <FormItem
              {...formItemLayout}
              label="Attibute Title"
              name="attrTitle"
              rules={[
                {
                  required: true,
                  message: "Please, enter the attribute title",
                },
              ]}
            >
              <Input placeholder="Give the Attribute Title" />
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Attibute Type"
              name="attrType"
              rules={[
                {
                  required: true,
                  message: "Please, select the attribute type",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Select Attribute Type"
                optionFilterProp="children"
                onChange={onChange}
              >
                <Option value="input">Input</Option>
                <Option value="single-slection">Single Slection</Option>
                <Option value="multiple-slection">Multiple Slection</Option>
            </Select>
            </FormItem>
            {attrTpyeValue=='single-slection' || attrTpyeValue=='multiple-slection' ? (
              <Form.List
                name="attrOption"
                rules={[
                  {
                    validator: async (_, attrOption) => {
                      if (!attrOption || attrOption.length < 2) {
                        return Promise.reject(new Error('At least 2 options'));
                      }
                    },
                  },
                ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <FormItem
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Options' : ''}
                        required={false}
                        key={field.key}
                      >
                        <FormItem
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Please input option's or delete this field.",
                            },
                          ]}
                          noStyle
                        >
                          <Input placeholder="option" style={{ width: '60%' }}/>
                        </FormItem>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </FormItem>
                    ))}
                    <FormItem {...formItemLayoutWithOutLabel}>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        style={{ width: '60%' }}
                        icon={<PlusOutlined />}
                      >
                        Add option
                      </Button>
                      <Form.ErrorList errors={errors} />
                    </FormItem>
                  </>
                )}
              </Form.List>
            ) : null}  
        </Form>
      </Card>
      </Modal>
  );
};

export default UpdateForm;
