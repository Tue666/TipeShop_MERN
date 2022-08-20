import type { ColumnsType } from 'antd/es/table';
import { Button, Space, Table, Tag, Tooltip, Typography } from 'antd';
import {
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

// guard
import { ActionsPassedGuardProps } from '../../guards/AccessGuard';
// hooks
import useDrawer from '../../hooks/useDrawer';
// redux
import { useAppSelector } from '../../redux/hooks';
import { selectAccessControl } from '../../redux/slices/accessControl';
import { Resource } from '../../models';
// utils
import { capitalize } from '../../utils/formatString';

const { Text } = Typography;

interface CascaderOption {
  value: string | number;
  label: string;
  children?: CascaderOption[];
}

const generateCascaderOption = (resources: Resource[]) => {
  return resources.reduce((acc, resouce) => {
    const { _id, name, children } = resouce;
    if (children) {
      acc.push({
        value: _id,
        label: capitalize(name),
        children: generateCascaderOption(children),
      });
      return acc;
    }
    acc.push({
      value: _id,
      label: capitalize(name),
    });
    return acc;
  }, [] as CascaderOption[]);
};

const columns: ColumnsType<Resource> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text) => <Text strong>{capitalize(text)}</Text>,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    ellipsis: {
      showTitle: false,
    },
    render: (text) => (
      <Tooltip placement="topLeft" title={text}>
        {text}
      </Tooltip>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (_, record) => {
      const { locked } = record;
      const status = {
        color: locked ? 'error' : 'success',
        text: locked ? (
          <Text strong type="danger">
            Locked <LockOutlined />
          </Text>
        ) : (
          <Text strong type="success">
            Available <UnlockOutlined />
          </Text>
        ),
      };
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
];

const Resources = ({ actionsAllowed }: ActionsPassedGuardProps) => {
  const { resources } = useAppSelector(selectAccessControl);
  const { openDrawer } = useDrawer();
  const actionsAccessible: ColumnsType<Resource> = [
    {
      title: 'Actions',
      dataIndex: '',
      render: (_, record) => {
        const { name } = record;
        return (
          <Space size="middle" align="center">
            {actionsAllowed.includes('update') && (
              <Tag
                icon={<EditOutlined />}
                color="success"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  openDrawer({
                    key: 'resourceForm',
                    title: `Update [${capitalize(name)}] resource`,
                  })
                }
              >
                Update
              </Tag>
            )}
            {actionsAllowed.includes('delete') && (
              <Tag icon={<DeleteOutlined />} color="error" style={{ cursor: 'pointer' }}>
                Delete
              </Tag>
            )}
          </Space>
        );
      },
    },
  ];
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space size="middle">
        {actionsAllowed.includes('create') && (
          <Button
            type="primary"
            icon={<DatabaseOutlined />}
            onClick={() =>
              openDrawer({
                key: 'resourceForm',
                title: 'Create resource',
                props: {
                  resourcesCascader: generateCascaderOption(Object.values(resources)),
                },
              })
            }
          >
            Create resource
          </Button>
        )}
      </Space>
      <Table
        rowKey="_id"
        tableLayout="fixed"
        columns={actionsAllowed.length > 0 ? [...columns, ...actionsAccessible] : columns}
        dataSource={Object.values(resources)}
      />
    </Space>
  );
};

export default Resources;
