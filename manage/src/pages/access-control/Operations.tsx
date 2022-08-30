import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { Space, Button, Table, Tag, Tooltip, Typography, Modal } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  NodeExpandOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';

// hooks
import useDrawer from '../../hooks/useDrawer';
// models
import type { Operation } from '../../models';
// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectAccessControl } from '../../redux/slices/accessControl';
import { deleteOperationAction } from '../../redux/actions/accessControl';
// routes
import { PATH_DASHBOARD } from '../../routes/path';
// utils
import { capitalize } from '../../utils/formatString';

const { Text } = Typography;

const columns: ColumnsType<Operation> = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text) => <Tag>{capitalize(text)}</Tag>,
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

const Operations = () => {
  const { operations } = useAppSelector(selectAccessControl);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { openDrawer } = useDrawer();
  const actionsRequired: ColumnsType<Operation> = [
    {
      title: 'Actions',
      dataIndex: '',
      render: (_, record) => {
        const { _id, name } = record;
        return (
          <Space size="middle" align="center">
            <Tag
              icon={<EditOutlined />}
              color="success"
              style={{ cursor: 'pointer' }}
              onClick={() =>
                openDrawer({
                  key: 'operationForm',
                  title: `Update [${capitalize(name)}] operation`,
                  props: { operation: operations.find((operation) => operation._id === _id) },
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
                  content: 'After deletion, the operation will be saved to the recycle bin',
                  okButtonProps: {
                    danger: true,
                  },
                  okText: 'Delete',
                  onOk() {
                    dispatch(deleteOperationAction({ _id }));
                  },
                });
              }}
            >
              Delete
            </Tag>
          </Space>
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
          icon={<NodeExpandOutlined />}
          onClick={() => openDrawer({ key: 'operationForm', title: 'Create operation' })}
        >
          Create operation
        </Button>
        <Button
          type="dashed"
          shape="round"
          icon={<DeleteOutlined />}
          danger
          onClick={() => navigate(PATH_DASHBOARD.recycleBin.operations)}
        >
          Recycle bin
        </Button>
      </Space>
      <Table
        rowKey="_id"
        tableLayout="fixed"
        columns={[...columns, ...actionsRequired]}
        dataSource={operations}
      />
    </Space>
  );
};

export default Operations;
