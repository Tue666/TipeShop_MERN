import { ChangeEvent, useRef, useReducer } from 'react';
import type { FormItemProps } from 'antd';
import { Form, Space, Typography, Input, Switch, Spin, Button, Alert, Cascader } from 'antd';
import { NodeExpandOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

// apis
import type { InsertResourceBody } from '../../apis/accessControlApi';
import accessControlApi from '../../apis/accessControlApi';
// models
import type { ReducerPayloadAction } from '../../models';
// redux
import { useAppSelector } from '../../redux/hooks';
import { selectAccessControl } from '../../redux/slices/accessControl';

const { Text } = Typography;

type InputState = {
  [key in keyof InsertResourceBody]: {
    validateStatus: FormItemProps['validateStatus'] | undefined;
    help: FormItemProps['help'] | undefined;
  };
};

const initialState: InputState = {
  name: {
    validateStatus: undefined,
    help: undefined,
  },
};

enum HandleType {
  VALIDATE_INPUT = 'VALIDATE_INPUT',
}

const handlers: {
  [key in HandleType]: (
    state: InputState,
    action?: ReducerPayloadAction<any, HandleType>
  ) => InputState;
} = {
  [HandleType.VALIDATE_INPUT]: (state, action) => {
    return {
      ...state,
      ...action?.payload,
    };
  },
};

const reducer = (state: InputState, action: ReducerPayloadAction<any, HandleType>): InputState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const ResourceForm = (props: any) => {
  const { resourcesCascader } = props;
  console.log(resourcesCascader);
  const { isLoading, error } = useAppSelector(selectAccessControl);
  const [form] = Form.useForm();
  const searchOperationRef = useRef<ReturnType<typeof setTimeout>>();
  const [state, dispatch] = useReducer(reducer, initialState);

  const onFinish = (values: any) => {
    console.log(values);
  };
  const handleInputValidationOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (searchOperationRef.current) clearTimeout(searchOperationRef.current);
    searchOperationRef.current = setTimeout(async () => {
      if (value === '') {
        dispatch({
          type: HandleType.VALIDATE_INPUT,
          payload: {
            [name]: {
              validateStatus: undefined,
              help: undefined,
            } as InputState[keyof InputState],
          },
        });
        return;
      }
      dispatch({
        type: HandleType.VALIDATE_INPUT,
        payload: {
          [name]: {
            validateStatus: 'validating',
            help: 'Validating...',
          } as InputState[keyof InputState],
        },
      });
      const { exist } = await accessControlApi.checkResourceExist({
        names: [value.toLowerCase()],
      });
      dispatch({
        type: HandleType.VALIDATE_INPUT,
        payload: {
          [name]: {
            validateStatus: exist ? 'warning' : 'success',
            help: exist ? 'Resource exists' : undefined,
          } as InputState[keyof InputState],
        },
      });
    }, 500);
  };
  return (
    <Spin spinning={isLoading}>
      <Form
        form={form}
        initialValues={{
          locked: false,
        }}
        onFinish={onFinish}
      >
        <Space direction="vertical">
          <Form.Item
            name="name"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Resource name is required!',
              },
            ]}
            validateStatus={state.name.validateStatus && state.name.validateStatus}
            help={state.name.help && state.name.help}
          >
            <Input
              name="name"
              autoComplete="none"
              allowClear
              prefix={<NodeExpandOutlined />}
              placeholder="Resource name"
              onChange={handleInputValidationOnChange}
            />
          </Form.Item>
          <Form.Item name="parent_id" help="Leave blank if create root resource">
            <Cascader
              allowClear
              expandTrigger="hover"
              changeOnSelect
              options={resourcesCascader}
              placeholder="Parent which resource will be in after creation"
            />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea
              showCount
              allowClear
              maxLength={250}
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Describe your resource here..."
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="locked" valuePropName="checked" noStyle>
              <Switch checkedChildren={<UnlockOutlined />} unCheckedChildren={<LockOutlined />} />
            </Form.Item>
            <Text style={{ marginLeft: '15px' }}>Locked resource</Text>
          </Form.Item>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: '10px' }}
            />
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Save
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Spin>
  );
};

export default ResourceForm;
