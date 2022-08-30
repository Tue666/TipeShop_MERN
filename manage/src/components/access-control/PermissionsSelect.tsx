import { useState } from 'react';
import type { ValueType } from 'rc-cascader/lib/Cascader';
import {
  Collapse,
  Button,
  Cascader,
  Select,
  Space,
  Tooltip,
  Tag,
  Typography,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  NodeExpandOutlined,
} from '@ant-design/icons';

// models
import { Operation, Permission, Resource } from '../../models';
// utils
import { capitalize } from '../../utils/formatString';

const { Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

interface CascaderOption {
  value: Resource['_id'];
  label: Resource['name'];
  children?: CascaderOption[];
}

const generateCascader = (resources: Resource[]): CascaderOption[] => {
  return resources.map((resource) => {
    const { _id, name, children } = resource;
    const cascader: CascaderOption = {
      value: _id,
      label: capitalize(name),
    };
    if (children && children.length > 0)
      return { ...cascader, children: generateCascader(children) };
    return cascader;
  });
};

const findResourcePathByIds = (
  resources: Resource[],
  resourceIds: Permission['resource'],
  pathByName: string[]
): string[] => {
  if (!resourceIds || resourceIds.length === 0) return [];
  const nextId = resourceIds[0];
  const resource = resources.find((resource) => resource._id === nextId);
  if (!resource) return [];
  const { name, children } = resource;
  if (children && children.length > 0)
    return findResourcePathByIds(
      children,
      resourceIds.slice(1),
      pathByName.concat(capitalize(name))
    );
  return pathByName.concat(capitalize(name));
};

const findOperationsByResource = (
  resources: Resource[],
  resourceIds: CascaderOption['value'][]
): Operation[] => {
  if (!resourceIds || resourceIds.length === 0) return [];
  const nextId = resourceIds[0];
  const resource = resources.find((resource) => resource._id === nextId);
  if (!resource) return [];
  const { children, operations } = resource;
  if (children && children.length > 0)
    return findOperationsByResource(children, resourceIds.slice(1));
  return operations ? operations : [];
};

interface PermissionsSelectProps {
  resources: Resource[];
  value?: Permission[];
  onChange?: (value: PermissionsSelectProps['value']) => void;
}

const PermissionsSelect = ({ resources, value, onChange }: PermissionsSelectProps) => {
  const [intendedPermission, setIntendedPermission] = useState<Permission>({
    resource: [],
    operations: [],
  });
  const [activeKeys, setActiveKeys] = useState<string[]>(
    Array.from(Array(value?.length), (_, index) => index.toString())
  );
  const isOpenSelect = activeKeys.indexOf('select') >= 0;
  const resourcesOptions = generateCascader(resources);
  const operationsOptions = findOperationsByResource(resources, intendedPermission.resource);

  const handleChangeCascader = (value: ValueType) => {
    setIntendedPermission({
      resource: value as CascaderOption['value'][],
      operations: [],
    });
  };
  const handleSelectOperations = (value: Permission['operations']) => {
    setIntendedPermission({
      ...intendedPermission,
      operations: value,
    });
  };
  const handleSavePermission = () => {
    if (!isOpenSelect) return;
    if (!intendedPermission.resource || intendedPermission.resource.length <= 0) {
      message.error('Resource is required!');
      return;
    }
    onChange?.([...value!, intendedPermission]);
  };
  const handleCancelSelect = () => {
    const newKeys = activeKeys.filter((key) => key !== 'select');
    setActiveKeys(newKeys);
  };
  const handleRemovePermission = (_index: number) => {
    const newPermissions = value?.filter((_, index) => index !== _index);
    onChange?.(newPermissions);
  };
  return (
    <Collapse activeKey={activeKeys} ghost onChange={(keys) => setActiveKeys(keys as string[])}>
      <Panel
        showArrow={false}
        header={
          <Space size="middle" style={{ marginBottom: '5px' }}>
            <Button
              type={isOpenSelect ? 'primary' : 'dashed'}
              shape="round"
              icon={isOpenSelect ? <CheckOutlined /> : <PlusOutlined />}
              block
              onClick={handleSavePermission}
            >
              {isOpenSelect ? 'Add' : 'Add Permission'}
            </Button>
            {isOpenSelect && (
              <Button
                type="primary"
                shape="round"
                icon={<CloseOutlined />}
                block
                danger
                onClick={handleCancelSelect}
              >
                Cancel
              </Button>
            )}
          </Space>
        }
        key="select"
      >
        <Space direction="vertical" size="small">
          <Cascader
            allowClear
            options={resourcesOptions}
            expandTrigger="hover"
            placeholder="Select resource"
            onChange={handleChangeCascader}
          />
          <Select
            value={intendedPermission.operations}
            mode="multiple"
            allowClear
            showSearch
            placeholder="Operations allowed"
            onChange={handleSelectOperations}
          >
            {operationsOptions.map((operation) => {
              const { _id, name, locked } = operation;
              return (
                <Option key={_id} value={_id} disabled={locked}>
                  {capitalize(name)}
                </Option>
              );
            })}
          </Select>
        </Space>
      </Panel>
      {value?.map((permission, index) => {
        const { resource, operations } = permission;
        const currentResource = findResourcePathByIds(resources, resource, []).join('/');
        const currentOperations = findOperationsByResource(resources, resource).filter(
          (operation) => operations.indexOf(operation._id) >= 0
        );
        return (
          <Panel
            className="hehe"
            header={
              <Tooltip title={currentResource} placement="left">
                <Text ellipsis style={{ maxWidth: '250px' }}>
                  {currentResource}
                </Text>
              </Tooltip>
            }
            key={index}
            extra={
              <Popconfirm
                title="Are you sure to remove this permission?"
                placement="topRight"
                onConfirm={() => handleRemovePermission(index)}
                okText="Remove"
                cancelText="Cancel"
              >
                <DeleteOutlined />
              </Popconfirm>
            }
          >
            <Space wrap>
              {currentOperations.length > 0 &&
                currentOperations.map((operation) => {
                  const { _id, name, description } = operation;
                  return (
                    <Tooltip key={_id} title={description}>
                      <Tag icon={<NodeExpandOutlined />} color="success">
                        <Text type="success" strong>
                          {name}
                        </Text>
                      </Tag>
                    </Tooltip>
                  );
                })}
              {currentOperations.length <= 0 && <Text keyboard>No operations yet!</Text>}
            </Space>
          </Panel>
        );
      })}
    </Collapse>
  );
};

export default PermissionsSelect;
