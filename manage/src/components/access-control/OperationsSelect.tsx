import { useState } from 'react';
import { Space, Tag, Typography, Tooltip, Select, Button, Divider } from 'antd';
import { LockOutlined, NodeExpandOutlined, PlusOutlined } from '@ant-design/icons';

// models
import { Operation } from '../../models';
// utils
import { capitalize } from '../../utils/formatString';
import useDrawer from '../../hooks/useDrawer';

const { Text } = Typography;
const { Option } = Select;

interface ActionsSelectProps {
  operations: Operation[];
  value?: Operation['_id'][];
  onChange?: (value: ActionsSelectProps['value']) => void;
}

const ActionsSelect = ({ operations, value, onChange }: ActionsSelectProps) => {
  const { openSubDrawer } = useDrawer();
  const [selectVisible, setSelectVisible] = useState(false);
  const [operationsTaken, restOperations] = operations.reduce(
    ([a, b], operation) => {
      const { _id } = operation;
      if (value?.includes(_id)) return [[...a, operation], b];
      return [a, [...b, operation]];
    },
    [[], []] as Operation[][]
  );

  const handleShowSelect = () => {
    setSelectVisible(true);
  };
  const handleHideSelect = () => {
    setSelectVisible(false);
  };
  const handleSelectedOperation = (operationId: Operation['_id']) => {
    const newOperationIds = [...value!, operationId];
    onChange?.(newOperationIds);
    handleHideSelect();
  };
  const handleRemoveOperation = (_id: Operation['_id']) => {
    const newOperationIds = value?.filter((operationId) => operationId !== _id);
    onChange?.(newOperationIds);
  };
  return (
    <Space direction="vertical" size="middle">
      {selectVisible && (
        <Select
          showSearch
          autoFocus
          defaultOpen
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: 0 }} />
              <Button
                type="text"
                icon={<PlusOutlined />}
                block
                onMouseDown={(e) => {
                  e.preventDefault();
                  openSubDrawer({
                    key: 'operationForm',
                    title: 'Create operation',
                  });
                }}
              >
                Create operation
              </Button>
            </>
          )}
          onChange={handleSelectedOperation}
          onBlur={handleHideSelect}
        >
          {restOperations.map((operation) => {
            const { _id, name, locked } = operation;
            return (
              <Option key={_id} value={_id} disabled={locked}>
                {capitalize(name)}
              </Option>
            );
          })}
        </Select>
      )}
      {!selectVisible && (
        <Button
          type="dashed"
          shape="round"
          icon={<PlusOutlined />}
          block
          onClick={handleShowSelect}
        >
          Add Action
        </Button>
      )}
      <Space wrap>
        {operationsTaken.map((operation) => {
          const { _id, name, description, locked } = operation;
          return (
            <Tooltip key={_id} title={description}>
              <Tag
                icon={locked ? <LockOutlined /> : <NodeExpandOutlined />}
                color={locked ? 'default' : 'success'}
                closable={!locked}
                onClose={() => handleRemoveOperation(_id)}
              >
                <Text type={locked ? undefined : 'success'} strong>
                  {name}
                </Text>
              </Tag>
            </Tooltip>
          );
        })}
      </Space>
    </Space>
  );
};

export default ActionsSelect;
