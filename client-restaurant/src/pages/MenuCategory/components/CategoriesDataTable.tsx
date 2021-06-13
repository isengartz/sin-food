import { Space, Table } from 'antd';
import React from 'react';
import { MenuCategoryInterface } from '@/models/menu-categories';

interface CategoriesDataTableProps {
  data: MenuCategoryInterface[];
  onItemEdit: (id: string) => void;
  onItemDelete: (id: string) => void;
}

const CategoriesDataTable: React.FC<CategoriesDataTableProps> = ({
  data,
  onItemEdit,
  onItemDelete,
}) => {
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a: any, b: any) => a.name > b.name,
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: ({ id }: { id: string }) => (
        <Space size="middle">
          <a onClick={() => onItemEdit(id)}>Edit</a>
          <a onClick={() => onItemDelete(id)}>Delete</a>
        </Space>
      ),
    },
  ];

  // function onChange(pagination: { current: number; pageSize: number }, filters, sorter, extra) {
  //   console.log('params', pagination, filters, sorter, extra);
  // }
  // return <Table rowKey="id" columns={columns} dataSource={data} onChange={onChange} />;

  // @ts-ignore
  return <Table rowKey="id" columns={columns} dataSource={data} />;
};

export default CategoriesDataTable;
