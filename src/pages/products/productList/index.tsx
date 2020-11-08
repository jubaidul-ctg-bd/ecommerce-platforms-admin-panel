import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input, Tabs } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule } from './service';

import ProForm, { ProFormText, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-form';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('Adding');
  try {
    await addRule({ ...fields });
    hide();
    message.success('Added Successfully');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!    ');
    return false;
  }
};


const { TabPane } = Tabs;
function callback(key) {
  console.log(key);
}


const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'email',
      key: 'email',
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: 'password',
      key: 'password',
      dataIndex: 'password',
      valueType: 'text',
    }
  ];

  return (
    <PageHeaderWrapper>
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Results" key="1">
        <ProTable<TableListItem>
            headerTitle="Products"
            actionRef={actionRef}
            rowKey="email"
            request={(params) => queryRule({ ...params })}
            columns={columns}
            rowSelection={{}}
          />
        </TabPane>
        <TabPane tab="Add" key="2">
          <ProForm
            onFinish={async (values) => {
              const success = await handleAdd(values);
              if (success) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            
          >
            <ProForm.Group>
              <ProFormText name="email" label="Email" placeholder="email" />
              <ProFormText name="password" label="Password" placeholder="password" />
            </ProForm.Group>
          </ProForm>
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab Pane 3
        </TabPane>
  </Tabs>
    </PageHeaderWrapper>
  );
};

export default TableList;
