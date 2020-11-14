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
import  Register  from '../register/index' 


/**
 * 添加节点
 * @param fields
 */
const handleAdd = () => {
  history.replace({
    pathname: '/user-management/register',
  });
}


/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Updating');
  try {
    await updateRule({
      name: fields.name,
      mail: fields.mail,
      _id: fields._id,
      role: fields.role,
      cellNo: fields.cellNo,
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
const handleApproval = async (selectedRows: TableListItem[], role: string) => {
  const hide = message.loading('Approving');

  console.log("selectedRows", selectedRows);
  
  
  if (!selectedRows) return true;
  try {
    await approvalRul(selectedRows, role);
    hide();
    message.success('Approved successfully, will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Approval failed, please try again');
    return false;
  }
};


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
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'User Role',
      dataIndex: 'role',
      hideInForm: true,
      valueEnum: {
        'ebhubon-admin': { text: 'Admin'},
        'user': { text: 'User' },
        'seller-admin': { text: 'Seller' },
      },
    },
    {
      title: 'Email',
      dataIndex: 'mail',
    },
    {
      title: 'Cell No',
      dataIndex: 'cellNo',
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
        headerTitle="All User"
        actionRef={actionRef}
        rowKey="_id"
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => handleAdd()}>
            <PlusOutlined />  ADD
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'user') {
                      await handleApproval(selectedRows, "user");
                      action.reload();
                    }
                    if (e.key === 'admin') {
                      await handleApproval(selectedRows, "ebhubon-admin");
                      action.reload();
                    }
                    if (e.key === 'seller') {
                      await handleApproval(selectedRows, "seller-admin");
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="user">User</Menu.Item>
                  <Menu.Item key="admin">Admin</Menu.Item>
                  <Menu.Item key="seller">Seller</Menu.Item>
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
