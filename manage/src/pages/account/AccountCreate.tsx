import { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Space, Typography } from 'antd';

// components
import Back from '../../components/Back';
import type { AccountGeneralFormProps } from '../../components/account/AccountGeneralForm';
import { AccountGeneralForm } from '../../components/account';
// guard
import type { ActionsPassedGuardProps } from '../../guards/AccessGuard';
// redux
import { useAppSelector } from '../../redux/hooks';
import { selectAccount } from '../../redux/slices/account';
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

interface AccountCreateProps extends ActionsPassedGuardProps {}

const AccountCreate = ({ actionsAllowed }: AccountCreateProps) => {
  const { administrators, customers } = useAppSelector(selectAccount);
  const { type } = useParams();
  const isEdit = window.location.pathname.indexOf('/edit') >= 0;
  const _id = window.location.pathname.split('/').pop();
  const propsByType: Omit<AccountGeneralFormProps, 'actionsAllowed'> & { backTo: string } =
    type === 'administrators'
      ? {
          account: isEdit
            ? administrators.find((administrator) => administrator._id === _id)
            : undefined,
          account_type: 'Administrator',
          backTo: PATH_DASHBOARD.account.administrators,
        }
      : {
          account: isEdit ? customers.find((customer) => customer._id === _id) : undefined,
          account_type: 'Customer',
          backTo: PATH_DASHBOARD.account.customers,
        };
  return (
    <div>
      <Back backTo={propsByType.backTo} scrollKeys={scrollKeys} />
      <Space direction="vertical" size="small" id={keys.general.key}>
        <Title level={5}>{keys.general.label}</Title>
        <AccountGeneralForm
          account={propsByType.account}
          account_type={propsByType.account_type}
          actionsAllowed={actionsAllowed}
        />
      </Space>
    </div>
  );
};

export default AccountCreate;
