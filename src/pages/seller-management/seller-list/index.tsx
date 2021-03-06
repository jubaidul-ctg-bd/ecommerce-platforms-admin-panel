import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Image, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule, approvalRul } from './service';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

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
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Shop Title',
      dataIndex: 'shopTitle',
    },
    {
      title: 'Cell No',
      dataIndex: 'cellNo',
    },
    {
      title: 'Email',
      dataIndex: 'mail',
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
        suspended: { text: 'Suspended', status: 'Default' },
        pending: { text: 'Pending', status: 'Processing' },
        approved: { text: 'Approved', status: 'Success' },
        rejected: { text: 'Rejected', status: 'Error' },
      },
    },
   
    {
      title: 'Option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (

        <>
          <a
            // onClick={() => {
            //   handleUpdateModalVisible(true);
            //   setStepFormValues(record);
            // }}
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
        headerTitle="Seller List"
        actionRef={actionRef}
        rowKey="id"
        toolBarRender={(action, { selectedRows }) => [
          // <Button type="primary" onClick={() => handleModalVisible(true)}>
          //   <PlusOutlined />  ADD
          // </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'remove') {
                      await handleApproval(selectedRows, "rejected");
                      action.reload();
                    }
                    if (e.key === 'approve') {
                      await handleApproval(selectedRows, "approved");
                      action.reload();
                    }
                    if (e.key === 'suspend') {
                      await handleApproval(selectedRows, "suspended");
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">Reject</Menu.Item>
                  <Menu.Item key="approve">Approve</Menu.Item>
                  <Menu.Item key="suspend">Suspend</Menu.Item>
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
          rowKey="id"
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
