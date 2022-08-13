import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Space, Typography } from 'antd';

// components
import Back from '../../components/Back';
import { AccountGeneralForm } from '../../components/account';
// routes
import { PATH_DASHBOARD } from '../../routes/path';

const { Title, Text } = Typography;

export type Key = 'general';

export interface ScrollKeyProps {
  key: Key;
  label: ReactNode;
}

const scrollKeys: ScrollKeyProps[] = [
  {
    key: 'general',
    label: <Text>General Information</Text>,
  },
];

const keys = scrollKeys.reduce((accumulator, current) => {
  const { key, label } = current;
  return {
    ...accumulator,
    [key]: {
      key,
      label,
    },
  };
}, {} as Record<Key, ScrollKeyProps>);

const AccountCreate = () => {
  const { type } = useParams();
  const backTo =
    type === 'administrators'
      ? PATH_DASHBOARD.account.administrators
      : PATH_DASHBOARD.account.customers;
  return (
    <div>
      <Back backTo={backTo} scrollKeys={scrollKeys} />
      <Space direction="vertical" size="small" id={keys.general.key}>
        <Title level={5}>{keys.general.label}</Title>
        <AccountGeneralForm />
      </Space>
    </div>
  );
};

export default AccountCreate;
