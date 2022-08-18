import styled from 'styled-components';
import { Space, Typography, Button, Input } from 'antd';
import { SearchOutlined, FolderAddOutlined } from '@ant-design/icons';

// components
import Box from '../../components/Box';

const { Text, Paragraph } = Typography;

const Operations = () => {
  return (
    <Space direction="vertical" size="middle">
      <Space size="large">
        <Input placeholder="Search resource here..." prefix={<SearchOutlined />} />
        <Button type="primary" icon={<FolderAddOutlined />}>
          Add Resource
        </Button>
      </Space>
      <Space size="large" wrap style={{ justifyContent: 'center' }}>
        {[...Array(20)].map((_, index) => {
          return (
            <Resource key={index} direction="vertical" size="middle">
              <div>
                <Text strong>Resource</Text>
                <Paragraph ellipsis={{ rows: 2 }}>account/customer</Paragraph>
              </div>
              <Paragraph ellipsis={{ rows: 2 }} italic>
                Ant Design, a design language for background applications, is refined by Ant UED
                Team. Ant Design, a design language for background applications, is refined by Ant
                UED Team. Ant Design, a design language for background applications, is refined by
                Ant UED Team. Ant Design, a design language for background applications
              </Paragraph>
            </Resource>
          );
        })}
      </Space>
    </Space>
  );
};

const Resource = styled(Box)({
  width: '200px',
  height: '150px',
  padding: '10px',
  cursor: 'pointer',
  transition: '0.5s',
  '&:hover': {
    transform: 'translate(2px, -2px)',
  },
});

export default Operations;
