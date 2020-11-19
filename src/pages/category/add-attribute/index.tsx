import { DownOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Image, Popconfirm, Form, Card, Input, Select, Space, Tag, Cascader } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

// import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule, approvalRul, categoryQuery } from './service';
import { formatMessage, FormattedMessage, history, useLocation } from 'umi';
import proSettings from '../../../../config/defaultSettings';
import { fromPairs } from 'lodash';

/**
 * 添加节点
 * @param fields
 */

const { Option } = Select;
const FormItem = Form.Item;

const handleAdd = () => {
  console.log("hello world");
  
    history.replace({
      pathname: '/products/add-product',
    });
}

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Updating');
  try {
    if(fields.attrType=='input') fields.attrOption = []
    await updateRule({
      id: fields.id,
      title: fields.title,
      type: fields.type,
      // attrOption: fields.attrOption,
      // categoriesId: fields.categoriesId,
    });
    hide();

    message.success('Succesfully Updated');
    return true;
  } catch (error) {
    hide();
    message.error('Update Faile');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */

const handleApproval = async (selectedRows: TableListItem[], status: string) => {
  const hide = message.loading('Approving');

  console.log("selectedRows", selectedRows);
  
  
  if (!selectedRows) return true;
  try {
    await approvalRul(selectedRows, status);
    hide();
    message.success(status+' successfully, will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error(status+' failed, please try again');
    return false;
  }
};

function displayRender(label: any) {
  return label[label.length - 1];
}


const AttributeTableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [attrTpyeValue, setAttrTpyeValue] = useState<string>('');
  const [form] = Form.useForm();
  const [stepFormValues, setStepFormValues] = useState({});
  const [categoryTitle, setCategoryTitle] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [options, setOptions] = useState([])
  const location = useLocation<object>()
  const actionRef = useRef<ActionType>();


  useEffect(() => {
    getOptions(); 
  },[])
  
  const getOptions = async() => {
    try {
      setCategoryTitle(location.state['category'])
      setCategoryId(location.state['id'])
    } catch(err ) {
      let val = await categoryQuery();
      setOptions(val); 
    }
  }


  function onChange(value) {
    setAttrTpyeValue(value);
    console.log(`selected ${value}`);
  }

  function onChangeCascader(value) {
    setCategoryId(value)
    actionRef.current.reload();
    console.log(`selected ${value}`);
  }

  const handleRemove = async (e: TableListItem) => {
    const hide = message.loading('Deleting');
    
    if (!e) return true;
    try {
      await removeRule({
        id: e.id,
      });
      actionRef.current.reload();
      hide();
      message.success('Deleted successfully, will refresh soon');
      return true;
    } catch (error) {    
      hide();
      message.error('Deletion failed, please try again');
      return false;
    }
  };
  // const formItemLayout = {
  //   labelCol: {
  //     xs: { span: 24 },
  //     sm: { span: 4 },
  //   },
  //   wrapperCol: {
  //     xs: { span: 24 },
  //     sm: { span: 20 },
  //     md: { span: 10 },
  //   },
  // };

  

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

  const onFinish = async(values) => {
    values.categoryId = categoryId
    if(!values.attrOption) {values.attrOption=[]}
    const hide = message.loading('Adding');
    try {
      await addRule({ ...values });
      hide();
      message.success('Added successfully');
      form.resetFields();
      actionRef.current.reload();
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Attribute Title',
      dataIndex: 'title',
    },
    {
      title: 'Attribute Type',
      dataIndex: 'type',
      valueEnum: {
        'text': { text: 'Text' },
        'single-choice': { text: 'Single Choice' },
        'multiple-choice': { text: 'Multiple Choice' },
      },
    },
    // {
    //   title: 'Attribute Options',
    //   dataIndex: 'attrOption',
    //   render : ( _ , row ) => (   
    //     <Space>
    //       { row.attrOption.map ( ( val ) => (  
    //         < Tag color = "cyan" key = { val } >  
    //           { val }
    //         </ Tag >
    //       ) )  }
    //     </Space>
    //   ) ,
    // },
    {
      title: 'Option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              console.log(record);
              
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            Edit
          </a>
          <Divider type="vertical" />
          < Popconfirm title = { ` Confirm ${ "Delete" } ? ` } okText = " Yes " cancelText = " No " >   
            <a
              onClick={async () => {
                  await handleRemove(record);
                  //action.reload();
                }
              }
            >
              Delete
            </a> 
          </ Popconfirm >
        </>
      ),
    },
  ];

  return (
      <PageHeaderWrapper>
        <Card bordered={false} style={{ marginBottom: 16 }}>
          <Form name="dynamic_form_item"  onFinish={onFinish}>
            {/* {!(categoryId && categoryTitle) ? (
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
                fieldNames={{ label: 'title', value: 'id', children: 'children' }}
                options={options}
                expandTrigger="hover"
                displayRender={displayRender}
                onChange={onChangeCascader}
                changeOnSelect={true}              
              />
            </FormItem>   
            ) : null}  */}
            <FormItem
              {...formItemLayout}
              label="Attibute Title"
              name="title"
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
              name="type"
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
                <Option value="text">Text</Option>
                <Option value="single-choice">Single Choice</Option>
                <Option value="multiple-choice">Multiple Choice</Option>
            </Select>
            </FormItem>

            {/* {attrTpyeValue=='single-slection' || attrTpyeValue=='multiple-slection' ? (
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
             */}
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              {/* <Button style={{ marginLeft: 8 }} onClick={ () => form.resetFields()}>
                Reset
              </Button> */}
            </FormItem>
        </Form>
        </Card>
        <ProTable<TableListItem>
          headerTitle="Attribute List"
          actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            // <Button type="primary" onClick={() => handleAdd()}>
            //   <PlusOutlined /> Add
            // </Button>,
            selectedRows && selectedRows.length > 0 && (
              <Dropdown
                overlay={
                  <Menu
                    onClick={async (e) => {
                      if (e.key === 'Publish') {
                        await handleApproval(selectedRows, "published");
                        action.reload();
                      }
                      if (e.key === 'Unpublish') {
                        await handleApproval(selectedRows, "unpublished");
                        action.reload();
                      }
                    }}
                    selectedKeys={[]}
                  >
                    <Menu.Item key="Publish">Publish</Menu.Item>
                    <Menu.Item key="Unpublish">Unpublish</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                    Bulk operation <DownOutlined />
                </Button>
              </Dropdown>
            ),
          ]}
          tableAlertRender={({ selectedRowKeys, selectedRows }) => (
            <div>
              Chosen <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> item&nbsp;&nbsp;
              {/* <span>
              Total number of service calls {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} Ten thousand
              </span> */}
            </div>
          )}
          request={(params, sorter, filter) => queryRule({ ...params, sorter, filter }, categoryId)}
          columns={columns}
          rowSelection={{}}
        />
        
        {/* <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
          <ProTable<TableListItem, TableListItem>
            onSubmit={async (value) => {
              const success = await handleAdd(value);
              if (success) {
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            rowKey="id"
            type="form"
            columns={columns}
            rowSelection={{}}
          />
        </CreateForm> */}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            onSubmit={async (value) => {
              const success = await handleUpdate(value);
              if (success) {
                handleUpdateModalVisible(false);
                setStepFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            onCancel={() => {
              handleUpdateModalVisible(false);
              setStepFormValues({});
            }}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
  );
};

export default AttributeTableList;
