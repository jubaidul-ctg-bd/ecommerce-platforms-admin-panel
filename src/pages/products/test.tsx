import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tag, Space } from 'antd';
import ProTable, { ProColumns, TableDropdown, ActionType } from '@ant-design/pro-table';
import request from 'umi-request';
import response from 'express';

interface GithubIssueItem {
  email: string; 
  password: string;
}

const columns: ProColumns<GithubIssueItem>[] = [
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



export default () => {
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<GithubIssueItem>
      columns={columns}
      actionRef={actionRef}
      request={async (params = {}) => 
        request<{
          data: GithubIssueItem[];
        }>('http://localhost:3000/cats', {
          params,
        })
      }
      rowKey="email"
      dateFormatter="string"
      headerTitle="Products"
    />
  );
};
