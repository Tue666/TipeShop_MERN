import { useLocation } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';

// models
import { AccessActionGuardProps, Account } from '../../models';
// redux
import { useAppSelector } from '../../redux/hooks';
import { selectAccount } from '../../redux/slices/account';

const columns: ColumnsType<Omit<Account, Account['type']>> = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Phone number',
    dataIndex: 'phone_number',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Actions',
    dataIndex: '',
    render: () => <p>Thêm Xóa Sửa blabla</p>,
  },
];

const AccountList = ({ currentActions, actions }: AccessActionGuardProps) => {
  const { pathname } = useLocation();
  const type = pathname.split('/').pop();
  const { isLoading, ...rest } = useAppSelector(selectAccount);
  let accounts: Account[] = [];
  switch (type) {
    case 'administrators':
      accounts = rest.administrators;
      break;
    case 'customers':
      accounts = rest.customers;
      break;
    default:
      break;
  }
  console.log(accounts);
  console.log(currentActions, actions);
  return (
    <Table
      rowKey="_id"
      loading={isLoading}
      rowSelection={{
        type: 'checkbox',
      }}
      columns={columns}
      dataSource={accounts}
    />
  );
};

export default AccountList;
