import { Space, Spin } from 'antd';

const Loading = () => {
  return (
    <Space
      align="center"
      style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}
    >
      <Spin size="large" />
    </Space>
  );
};

export default Loading;
