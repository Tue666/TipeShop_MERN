import { CSSProperties } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Button, Modal, Space, Table, Tag, Tooltip, Typography } from 'antd';
import {
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  CaretRightOutlined,
} from '@ant-design/icons';

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
    filters: [
      {
        text: 'Available',
        value: false,
      },
      {
        text: 'Locked',
        value: true,
      },
    ],
    onFilter: (value, record) => record.locked === value,
  },
];

const Resources = () => {
  const { resources } = useAppSelector(selectAccessControl);
  const { openDrawer } = useDrawer();
  const expandStyle: CSSProperties = {
    position: 'relative',
    left: '-5px',
    transition: '0.5s',
  };
  const actionsRequired: ColumnsType<Resource> = [
    {
      title: 'Actions',
      dataIndex: '',
      render: (_, record) => {
        const { name, children } = record;
        return (
          (!children || children?.length <= 0) && (
            <Space size="middle" align="center">
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
              <Tag
                icon={<DeleteOutlined />}
                color="error"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  Modal.confirm({
                    centered: true,
                    title: `Are you sure you want to delete [${capitalize(name)}]?`,
                    content: 'After deletion, the resource will be saved to the recycle bin',
                    okButtonProps: {
                      danger: true,
                    },
                    okText: 'Delete',
                    onOk() {},
                  });
                }}
              >
                Delete
              </Tag>
            </Space>
          )
        );
      },
    },
  ];
  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Space size="middle">
        <Button
          type="primary"
          shape="round"
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
        <Button type="dashed" shape="round" icon={<DeleteOutlined />} danger>
          Recycle bin
        </Button>
      </Space>
      <Table
        rowKey="_id"
        tableLayout="fixed"
        expandable={{
          defaultExpandAllRows: true,
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
        columns={[...columns, ...actionsRequired]}
        dataSource={resources}
      />
    </Space>
  );
};

export default Resources;
