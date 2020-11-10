import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Image, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule, approvalRul } from './service';
import { history } from 'umi'
import proSettings from '../../../../config/defaultSettings';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = () => {
  console.log("hello world");
    history.replace({
      pathname: '/category/add-category',
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


const handleApproval = async (selectedRows: TableListItem[], status: string) => {
  const hide = message.loading('Approving');

  console.log("selectedRows", selectedRows);
  
  
  if (!selectedRows) return true;
  try {
    await approvalRul(selectedRows, status);
    hide();
    message.success('Approved successfully, will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Approval failed, please try again');
    return false;
  }
};

/**
 *  删除节点
 * @param actionRef
 */


const TableList: React.FC<{}> = () => {
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
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Parent Category',
      dataIndex: 'parent-category',
    },
    {
      title: 'Description',
      dataIndex: 'desc',
      valueType: 'textarea',
    },
    // {
    //   title: 'Price',
    //   dataIndex: 'price',
    //   sorter: true,
    //   hideInForm: true,
    //   renderText: (val: string) => `${val} TK`,
    // },
    // {
    //   title: 'Quantity',
    //   dataIndex: 'quantity',
    //   sorter: true,
    //   hideInForm: true,
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        published: { text: 'Published', status: 'Success' },
        unpublished: { text: 'Unpublished', status: 'Error' },
      },
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      renderText: (val: string) => (
        <Image
          width={40}
          src={proSettings.baseUrl+"/media/image?url=categoryImages/"+val}
        />
      ),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      renderText: (val: string) => (
        <Image
          width={40}
          src={proSettings.baseUrl+"/media/image?url=categoryImages/"+val}
        />
      ),
    },
    {
      title: 'Banner',
      dataIndex: 'banner',
      renderText: (val: string) => (
        <Image
          width={40}
          src={proSettings.baseUrl+"/media/image?url=categoryImages/"+val}
        />
      ),
    },
    {
      title: 'Option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (

        <>
          <a
            onClick={() => {
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
      <ProTable<TableListItem>
        headerTitle="Products Category"
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
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
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
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
