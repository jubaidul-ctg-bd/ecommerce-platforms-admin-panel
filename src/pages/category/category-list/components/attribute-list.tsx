import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Image, Popconfirm, Form } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

// import CreateForm from './components/CreateForm';
// import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from '../data.d';
import { queryRule, updateRule, addRule, removeRule, approvalRul } from '../service';
import { history } from 'umi';
import proSettings from '../../../../../config/defaultSettings';


/**
 * 添加节点
 * @param fields
 */

const handleAdd = () => {
  console.log("hello world");
  
    history.replace({
      pathname: '/products/add-product',
    });
}
// const handleAdd = async (fields: TableListItem) => {
//   const hide = message.loading('正在添加');
//   try {
//     await addRule({ ...fields });
//     hide();
//     message.success('添加成功');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
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


const AttributeTableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();

  const handleRemove = async (e: TableListItem) => {
    const hide = message.loading('Deleting');
    
    if (!e) return true;
    try {
      await removeRule({
        id: e._id,
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
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Attribute Title',
      dataIndex: 'attrTitle',
    },
    {
      title: 'Attribute Type',
      dataIndex: 'attrType',
      valueType: 'select',
    },
    {
      title: 'Options',
      dataIndex: 'option',
      valueType: 'textarea',
    },
    {
      title: 'Option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              // handleUpdateModalVisible(true);
              //setStepFormValues(record);
            }}
          >
            Edit
          </a>
          <Divider type="vertical" />
          < Popconfirm title = { ` Confirm ${ "Delete" } ? ` } okText = " Yes " cancelText = " No " >   
            <a
              onClick={async () => {
                  //await handleRemove(record);
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
      <>
      <ProTable<TableListItem>
        headerTitle="Attribute List"
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleAdd()}>
            <PlusOutlined /> Add
          </Button>,
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
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        rowSelection={{}}
      />
      <ProTable<TableListItem, TableListItem>
    //     <Form name="dynamic_form_item" {...formItemLayoutWithOutLabel} onFinish={onFinish}>
    //     <Form.List
    //       name="names"
    //       rules={[
    //         {
    //           validator: async (_, names) => {
    //             if (!names || names.length < 2) {
    //               return Promise.reject(new Error('At least 2 passengers'));
    //             }
    //           },
    //         },
    //       ]}
    //     >
    //       {(fields, { add, remove }, { errors }) => (
    //         <>
    //           {fields.map((field, index) => (
    //             <Form.Item
    //               {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
    //               label={index === 0 ? 'Passengers' : ''}
    //               required={false}
    //               key={field.key}
    //             >
    //               <Form.Item
    //                 {...field}
    //                 validateTrigger={['onChange', 'onBlur']}
    //                 rules={[
    //                   {
    //                     required: true,
    //                     whitespace: true,
    //                     message: "Please input passenger's name or delete this field.",
    //                   },
    //                 ]}
    //                 noStyle
    //               >
    //                 <Input placeholder="passenger name" style={{ width: '60%' }} />
    //               </Form.Item>
    //               {fields.length > 1 ? (
    //                 <MinusCircleOutlined
    //                   className="dynamic-delete-button"
    //                   onClick={() => remove(field.name)}
    //                 />
    //               ) : null}
    //             </Form.Item>
    //           ))}
    //           <Form.Item>
    //             <Button
    //               type="dashed"
    //               onClick={() => add()}
    //               style={{ width: '60%' }}
    //               icon={<PlusOutlined />}
    //             >
    //               Add field
    //             </Button>
    //             <Button
    //               type="dashed"
    //               onClick={() => {
    //                 add('The head item', 0);
    //               }}
    //               style={{ width: '60%', marginTop: '20px' }}
    //               icon={<PlusOutlined />}
    //             >
    //               Add field at head
    //             </Button>
    //             <Form.ErrorList errors={errors} />
    //           </Form.Item>
    //         </>
    //       )}
    //     </Form.List>
    //     <Form.Item>
    //       <Button type="primary" htmlType="submit">
    //         Submit
    //       </Button>
    //     </Form.Item>
    //   </Form>


          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="_id"
          type="form"
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
          rowKey="_id"
          type="form"
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>
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
      ) : null} */}
    </>
  );
};

export default AttributeTableList;
