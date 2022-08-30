import { ChangeEvent, useRef, useReducer, useEffect } from 'react';
import type { FormItemProps } from 'antd';
import {
  Form,
  Space,
  Typography,
  Input,
  Switch,
  Spin,
  Button,
  Alert,
  Collapse,
  message,
} from 'antd';
import { NodeExpandOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

// apis
import type { CreateResourceBody } from '../../apis/accessControlApi';
import accessControlApi from '../../apis/accessControlApi';
// hooks
import useDrawer from '../../hooks/useDrawer';
import useAuth from '../../hooks/useAuth';
// models
import type { ReducerPayloadAction, Resource } from '../../models';
// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  createResourceAction,
  CreateResourcePayload,
  updateResourceAction,
} from '../../redux/actions/accessControl';
import { clearAction, selectAccessControl } from '../../redux/slices/accessControl';
// utils
import { capitalize } from '../../utils/formatString';
//
import ResourceSelect from './ResourceSelect';
import OperationsSelect from './OperationsSelect';

const { Text } = Typography;
const { Panel } = Collapse;

type InputState = {
  [key in keyof CreateResourceBody]: {
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

interface ResourceFormProps {
  resource?: Resource;
}

const ResourceForm = ({ resource }: ResourceFormProps) => {
  const sliceDispatch = useAppDispatch();
  const { isLoading, error, lastAction, resources, roles, operations } =
    useAppSelector(selectAccessControl);
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

  const onFinish = (values: CreateResourcePayload) => {
    if (!resource) {
      // create goes here
      message.loading({ content: 'Processing...', key: 'create' });
      sliceDispatch(createResourceAction(values));
      return;
    }
    // update goes here
    message.loading({ content: 'Processing...', key: 'update' });
    sliceDispatch(
      updateResourceAction({
        _id: resource._id,
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
          name: capitalize(resource?.name) || '',
          description: resource?.description || '',
          locked: resource?.locked || false,
          parent_id: resource?.parent_id || null,
          operations: resource?.operations.map((operation) => operation._id) || [],
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
              disabled={!!resource}
              prefix={<NodeExpandOutlined />}
              placeholder="Resource name"
              onChange={handleInputValidationOnChange}
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
          <Collapse ghost className="ant-collapse-no-header-padding">
            <Panel header={<Text strong>Resource's parent</Text>} key="1">
              <Form.Item name="parent_id" help="Leave blank if create root resource">
                <ResourceSelect resources={resources} />
              </Form.Item>
            </Panel>
            <Panel header={<Text strong>Resource's actions</Text>} key="2">
              <Form.Item name="operations">
                <OperationsSelect operations={operations} />
              </Form.Item>
            </Panel>
          </Collapse>
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
              onClose={() => sliceDispatch(clearAction())}
            />
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {resource ? 'Save' : 'Create'}
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Spin>
  );
};

export default ResourceForm;
