import { ChangeEvent, useRef, useReducer, useEffect } from 'react';
import { FormItemProps, message } from 'antd';
import { Form, Space, Input, Spin, Button, Alert, Collapse, Typography } from 'antd';
import { ApartmentOutlined } from '@ant-design/icons';

// apis
import accessControlApi, { CreateRoleBody } from '../../apis/accessControlApi';
// hooks
import useDrawer from '../../hooks/useDrawer';
import useAuth from '../../hooks/useAuth';
// models
import type { ReducerPayloadAction, Role } from '../../models';
// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import type { CreateRolePayload } from '../../redux/actions/accessControl';
import { createRoleAction, updateRoleAction } from '../../redux/actions/accessControl';
import { clearAction, selectAccessControl } from '../../redux/slices/accessControl';
//
import PermissionsSelect from './PermissionsSelect';

const { Text } = Typography;
const { Panel } = Collapse;

type InputState = {
  [key in keyof CreateRoleBody]: {
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

interface RoleFormProps {
  role?: Role;
}

const RoleForm = ({ role }: RoleFormProps) => {
  const sliceDispatch = useAppDispatch();
  const { isLoading, error, lastAction, resources, roles } = useAppSelector(selectAccessControl);
  const { closeDrawer } = useDrawer();
  const { refreshAccessibleResources } = useAuth();
  const [form] = Form.useForm();
  const { resetFields } = form;
  const searchOperationRef = useRef<ReturnType<typeof setTimeout>>();
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (lastAction !== undefined) {
      switch (lastAction) {
        case 'create':
          resetFields();
          break;
        case 'update':
          closeDrawer();
          break;
        default:
          break;
      }
      refreshAccessibleResources(resources, roles);
      sliceDispatch(clearAction());
    }
    // eslint-disable-next-line
  }, [lastAction]);

  const onFinish = (values: CreateRolePayload) => {
    if (!role) {
      // create goes here
      message.loading({ content: 'Processing...', key: 'create' });
      sliceDispatch(createRoleAction(values));
      return;
    }
    // update goes here
    message.loading({ content: 'Processing...', key: 'update' });
    sliceDispatch(
      updateRoleAction({
        _id: role._id,
        ...values,
      })
    );
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
      const { exist } = await accessControlApi.checkRoleExist({
        names: [value],
      });
      dispatch({
        type: HandleType.VALIDATE_INPUT,
        payload: {
          [name]: {
            validateStatus: exist ? 'warning' : 'success',
            help: exist ? 'Role exists' : undefined,
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
          name: role?.name || '',
          description: role?.description || '',
          permissions: role?.permissions || [],
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
                message: 'Role name is required!',
              },
            ]}
            validateStatus={state.name.validateStatus && state.name.validateStatus}
            help={state.name.help && state.name.help}
          >
            <Input
              name="name"
              autoComplete="none"
              allowClear
              disabled={!!role}
              prefix={<ApartmentOutlined />}
              placeholder="Role name"
              onChange={handleInputValidationOnChange}
            />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea
              showCount
              allowClear
              maxLength={250}
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Describe your role here..."
            />
          </Form.Item>
          <Collapse defaultActiveKey={['1']} ghost className="ant-collapse-no-header-padding">
            <Panel header={<Text strong>Role's permissions</Text>} key="1">
              <Form.Item name="permissions">
                <PermissionsSelect resources={resources} />
              </Form.Item>
            </Panel>
          </Collapse>
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: '10px' }}
              onClose={() => sliceDispatch(clearAction())}
            />
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {role ? 'Save' : 'Create'}
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Spin>
  );
};

export default RoleForm;
