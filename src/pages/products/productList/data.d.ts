export interface TableListItem {
  key: number;
  email: string;
  password: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  key?: number;
  email?: string;
  password?: string;
}
