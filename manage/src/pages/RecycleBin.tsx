import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Space, Table, Tag, Typography, message } from 'antd';
import { RetweetOutlined, CloseSquareOutlined } from '@ant-design/icons';

// apis
import accessControlApi from '../apis/accessControlApi';
// guard
import type { ActionsPassedGuardProps } from '../guards/AccessGuard';
// redux
import { useAppDispatch } from '../redux/hooks';
import { restoreOperationAction } from '../redux/actions/accessControl';
// utils
import { capitalize, toLocaleTime } from '../utils/formatString';

const { Text } = Typography;

interface DataType {
  _id: string;
  name: string;
  deletedAt: string;
  deletedBy: {
    _id: string;
    name: string;
  };
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Object name',
    dataIndex: 'name',
    render: (text) => <Text strong>{capitalize(text)}</Text>,
  },
  {
    title: 'Deleted At',
    dataIndex: 'deletedAt',
    render: (text) => <Text>{toLocaleTime(text)}</Text>,
  },
  {
    title: 'Deleted By',
    dataIndex: 'deletedBy',
    render: (_, record) => <Text strong>{record.deletedBy.name}</Text>,
  },
];

const RecycleBin = ({ actionsAllowed }: ActionsPassedGuardProps) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const { object } = useParams();
  const actionsAccessible: ColumnsType<DataType> = [
    {
      title: 'Actions',
      dataIndex: '',
      render: (_, record) => {
        const { _id, name } = record;
        return (
          <Space size="middle" align="center">
            {actionsAllowed.includes('restore') && (
              <Tag
                icon={<RetweetOutlined />}
                color="cyan"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  Modal.confirm({
                    centered: true,
                    closable: true,
                    title: `Do you want to restore [${capitalize(name)}]?`,
                    content: (
                      <Space direction="vertical">
                        <Text>Click [Restore] to restore</Text>
                        <Text strong type="danger">
                          Restored object will be temporarily invalidated for some resources, for
                          immediate effect please [reload] the page
                        </Text>
                      </Space>
                    ),
                    okText: 'Restore',
                    onOk() {
                      handleRestoreObject(_id);
                    },
                  });
                }}
              >
                Restore
              </Tag>
            )}
            {actionsAllowed.includes('destroy') && (
              <Tag
                icon={<CloseSquareOutlined />}
                color="error"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  Modal.confirm({
                    centered: true,
                    title: `Are you sure you want to permanently delete [${capitalize(name)}]?`,
                    content:
                      'Object after permanently deleted cannot be restored, please be careful!',
                    okButtonProps: {
                      danger: true,
                    },
                    okText: 'Permanently Delete',
                    onOk() {
                      handleDestroyObject(_id);
                    },
                  });
                }}
              >
                Permanently Delete
              </Tag>
            )}
          </Space>
        );
      },
    },
  ];
  useEffect(() => {
    const getObjectsDeleted = async () => {
      setIsLoading(true);
      let response: any = [];
      switch (object) {
        case 'operations':
          response = await accessControlApi.findAllOperationsDeleted();
          break;
        default:
          break;
      }
      setData(response.data ? response.data : response); // !
      setIsLoading(false);
    };
    getObjectsDeleted();
  }, [object]);

  const deleteObjectFromData = (_id: DataType['_id']) => {
    const newData = data.filter((object) => object._id !== _id);
    setData(newData);
  };
  const handleRestoreObject = (_id: DataType['_id']) => {
    message.loading({ content: 'Processing...', key: 'restore' });
    switch (object) {
      case 'operations':
        dispatch(restoreOperationAction({ _id }));
        break;
      default:
        break;
    }
    deleteObjectFromData(_id);
  };
  const handleDestroyObject = async (_id: DataType['_id']) => {
    message.loading({ content: 'Processing...', key: 'destroy' });
    let response = {
      msg: '',
      deletedId: '',
    };
    switch (object) {
      case 'operations':
        response = await accessControlApi.destroyOperation({ _id });
        break;
      default:
        break;
    }
    deleteObjectFromData(response.deletedId);
    message.success({ content: response.msg, key: 'destroy' });
  };
  return (
    <Table
      loading={isLoading}
      rowKey="_id"
      tableLayout="fixed"
      columns={actionsAllowed.length > 0 ? [...columns, ...actionsAccessible] : columns}
      dataSource={data}
    />
  );
};

export default RecycleBin;
