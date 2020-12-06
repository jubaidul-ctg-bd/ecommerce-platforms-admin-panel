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
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Cascader } from 'antd';
import MediaWall from './components/MediaWall';
import { categoryQuery, querySlug, queryTermValues } from './service'
import proSettings from '../../../../config/defaultSettings';
import { element } from 'prop-types';


// const options = [
//   {
//     value: 'zhejiang',
//     label: 'Zhejiang',
//     children: [
//       {
//         value: 'hangzhou',
//         label: 'Hangzhou',
//         children: [
//           {
//             value: 'xihu',
//             label: 'West Lake',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     value: 'jiangsu',
//     label: 'Jiangsu',
//     children: [
//       {
//         value: 'nanjing',
//         label: 'Nanjing',
//         children: [
//           {
//             value: 'zhonghuamen',
//             label: 'Zhong Hua Men',
//           },
//         ],
//       },
//     ],
//   },
// ];

function onChange(value: any) {
  //console.log(value);
}

// Just show the latest item.
function displayRender(label: any) {
  return label[label.length - 1];
}

// function handleChange(value: any) {
//   console.log(`selected ${value}`);
// }



function onChangeSelect(value: any) {
  console.log(`selected ${value}`);
}

function onSearch(val: any) {
  console.log('search:', val);
}


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

interface BasicFormProps {
  submitting: boolean;
  dispatch: Dispatch;
}

const BasicForm: FC<BasicFormProps> = (props) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const { submitting } = props;
  const [form] = Form.useForm();
  // const [value, updateValue] = useState<string>(null);
  const [value1, updateValue1] = useState<string>('');
  const [value2, updateValue2] = useState<string>('');
  const [value3, updateValue3] = useState<string>('');
  const [name, updateName] = useState<string>('');
  const [slug, getSlug] = useState<string>('');
  const [oder, setOrder] = useState([])
  const [options, setOptions] = useState([])
  useEffect(() => {
    getOptions(); 
  },[])

  form.setFieldsValue({
    icon: value1,
    image:value2,
    banner: value3,
    slug: slug,
  });   
  console.log(value1, value2, value3);
  
  const getOptions = async() => {
    let val = await categoryQuery();
    setOptions(val);  
    let order = []
    order = Object.assign([], val)
    order.push({order: order.length+1}) 
    order.sort((a, b) => b.order - a.order);
    setOrder(order)
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
      type: 'brandAdd/submitRegularForm',
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

  const onChangeCascader = async(valuse: any) => {
    let val = await queryTermValues({id: valuse})
    let order = []
    order = Object.assign([], val)
    order.push({order: order.length+1}) 
    order.sort((a, b) => b.order - a.order);
    setOrder(order)
  }

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


  return (
    <PageHeaderWrapper 
      // content={<FormattedMessage id="brand-form.basic.description" />}
    >
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
            label={<FormattedMessage id="brand-form.title.label" />}
            name="title"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'brand-form.title.required' }),
              },
            ]}
          >
            <Input onBlur={async(e)=> getSlug(await querySlug({slug: e.target.value}))} placeholder={formatMessage({ id: 'brand-form.title.placeholder' })} />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="brand-form.slug.label" />}
            name="slug"
            rules={[
              {
                // required: true,
                message: formatMessage({ id: 'brand-form.slug.required' }),
              },
            ]}
          >
            <Input disabled placeholder={formatMessage({ id: 'brand-form.slug.placeholder' })} />
          </FormItem>
          {/* <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="brand-form.parent-category.label" />}
            name="parentCategories"
          >
            <Cascader
              fieldNames={{ label: 'title', value: 'id', children: 'childTermValues' }}
              options={options}
              expandTrigger="hover"
              displayRender={displayRender}
              onChange={onChangeCascader}
              changeOnSelect={true}              
            />
          </FormItem>       */}
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="brand-form.order.label" />}
            name="order"
          >
            <Select
              showSearch
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={onChangeSelect}
              // fieldNames={{ label: 'title', value: 'id', children: 'childTermValues' }}

              onSearch={onSearch}
              // filterOption={(input, option) =>
              //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              // }
            >
              {oder.map((elment, index)=> (
                console.log("oder=======", elment.order),
                <Option value={elment.order}>{elment.order}</Option>
                ))}
            </Select>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="brand-form.description.label" />}
            name="description"
          >
            <TextArea
              style={{ minHeight: 32 }}
              placeholder={formatMessage({ id: 'brand-form.description.placeholder' })}
              rows={4}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={<FormattedMessage id="brand-form.status.label" />}
            name="status"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'brand-form.status.required' }),
              },
            ]}
          >
            <div>
              <Radio.Group>
                <Radio value="published">
                  <FormattedMessage id="brand-form.radio.publish" />
                </Radio>
                <Radio value="unpublished">
                  <FormattedMessage id="brand-form.radio.unpublish" />
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
              <FormattedMessage id="brand-form.form.submit" />
            </Button>
            <Button style={{ marginLeft: 8 }}>
              <FormattedMessage id="brand-form.form.save" />
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

    </PageHeaderWrapper>
  );
};

export default connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  submitting: loading.effects['brandAdd/submitRegularForm'],
}))(BasicForm);