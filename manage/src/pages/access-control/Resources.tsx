import { CSSProperties } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Button, Space, Table, Tag, Tooltip, Typography } from 'antd';
import {
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';

// guard
import { ActionsPassedGuardProps } from '../../guards/AccessGuard';
// hooks
import useDrawer from '../../hooks/useDrawer';
// models
import type { Resource } from '../../models';
// redux
import { useAppSelector } from '../../redux/hooks';
import { selectAccessControl } from '../../redux/slices/accessControl';
// utils
import { capitalize } from '../../utils/formatString';

const { Text } = Typography;

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
  const expandStyle: CSSProperties = {
    position: 'relative',
    left: '-5px',
    transition: '0.5s',
  };
  const actionsAccessible: ColumnsType<Resource> = [
    {
      title: 'Actions',
      dataIndex: '',
      render: (_, record) => {
        const { name, children } = record;
        return (
          (!children || children?.length <= 0) && (
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
                      props: { resource: record },
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
          )
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
        expandable={{
          expandIcon: ({ expanded, onExpand, record }) =>
            record.children?.length > 0 ? (
              expanded ? (
                <CaretRightOutlined
                  style={{
                    ...expandStyle,
                    transform: 'rotate(90deg)',
                  }}
                  onClick={(e) => onExpand(record, e)}
                />
              ) : (
                <CaretRightOutlined
                  style={{ ...expandStyle }}
                  onClick={(e) => onExpand(record, e)}
                />
              )
            ) : null,
        }}
        columns={actionsAllowed.length > 0 ? [...columns, ...actionsAccessible] : columns}
        dataSource={resources}
      />
    </Space>
  );
};

export default Resources;
