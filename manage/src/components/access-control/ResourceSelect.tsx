import { TreeSelect } from 'antd';

// models
import { Resource } from '../../models';
// utils
import { capitalize } from '../../utils/formatString';

const { TreeNode } = TreeSelect;

const renderSelect = (resources: Resource[]) => {
  return resources.map((resource) => {
    const { _id, name, children } = resource;
    return (
      <TreeNode key={_id} value={_id} title={capitalize(name)}>
        {children && renderSelect(children)}
      </TreeNode>
    );
  });
};

interface ResourceSelectProps {
  resources: Resource[];
  value?: Resource['parent_id'];
  onChange?: (value: ResourceSelectProps['value']) => void;
}

const ResourceSelect = ({ resources, value, onChange }: ResourceSelectProps) => {
  const handleChangeSelected = (newValue: string) => {
    onChange?.(newValue === undefined ? null : newValue);
  };
  return (
    <TreeSelect
      value={value === null ? undefined : value}
      showSearch
      style={{ width: '100%' }}
      dropdownStyle={{ maxHeight: 500, overflow: 'auto' }}
      placeholder="Parent which resource will be in after creation"
      allowClear
      treeDefaultExpandAll
      onChange={handleChangeSelected}
    >
      {renderSelect(resources)}
    </TreeSelect>
  );
};

export default ResourceSelect;
