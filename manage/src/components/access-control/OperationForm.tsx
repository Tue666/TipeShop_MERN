import { ChangeEvent, useRef, useReducer, useEffect } from 'react';
import type { FormItemProps } from 'antd';
import { Form, Space, Typography, Input, Switch, Spin, Button, Alert, message } from 'antd';
import { NodeExpandOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';

// apis
import accessControlApi, { CreateOperationBody } from '../../apis/accessControlApi';
// hooks
import useDrawer from '../../hooks/useDrawer';
// models
import type { Operation, ReducerPayloadAction } from '../../models';
// redux
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearAction, selectAccessControl } from '../../redux/slices/accessControl';
import type { CreateOperationPayload } from '../../redux/actions/accessControl';
import { createOperationAction, updateOperationAction } from '../../redux/actions/accessControl';
// utils
import { capitalize } from '../../utils/formatString';

const { Text } = Typography;

type InputState = {
  [key in keyof CreateOperationBody]: {
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

interface OperationFormProps {
  operation?: Operation;
}

const OperationForm = ({ operation }: OperationFormProps) => {
  const sliceDispatch = useAppDispatch();
  const { isLoading, error, lastAction } = useAppSelector(selectAccessControl);
  const { closeDrawer } = useDrawer();
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
      sliceDispatch(clearAction());
    }
    // eslint-disable-next-line
  }, [lastAction]);

  const onFinish = (values: CreateOperationPayload) => {
    if (!operation) {
      // create goes here
      message.loading({ content: 'Processing...', key: 'create' });
      sliceDispatch(createOperationAction(values));
      return;
    }
    // update goes here
    message.loading({ content: 'Processing...', key: 'update' });
    sliceDispatch(
      updateOperationAction({
        _id: operation._id,
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
      const { exist } = await accessControlApi.checkOperationExist({
        names: [value.toLowerCase()],
      });
      dispatch({
        type: HandleType.VALIDATE_INPUT,
        payload: {
          [name]: {
            validateStatus: exist ? 'warning' : 'success',
            help: exist ? 'Operation exists' : undefined,
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
          name: capitalize(operation?.name) || '',
          description: operation?.description || '',
          locked: operation?.locked || false,
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
                message: 'Operation name is required!',
              },
            ]}
            validateStatus={state.name.validateStatus && state.name.validateStatus}
            help={state.name.help && state.name.help}
          >
            <Input
              name="name"
              autoComplete="none"
              allowClear
              disabled={!!operation}
              prefix={<NodeExpandOutlined />}
              placeholder="Operation name"
              onChange={handleInputValidationOnChange}
            />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea
              showCount
              allowClear
              maxLength={250}
              autoSize={{ minRows: 3, maxRows: 6 }}
              placeholder="Describe your operation here..."
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="locked" valuePropName="checked" noStyle>
              <Switch checkedChildren={<UnlockOutlined />} unCheckedChildren={<LockOutlined />} />
            </Form.Item>
            <Text style={{ marginLeft: '15px' }}>Locked operation</Text>
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
              {operation ? 'Save' : 'Create'}
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Spin>
  );
};

export default OperationForm;
