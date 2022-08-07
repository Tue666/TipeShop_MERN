import { Space, SpaceProps } from 'antd';

const Box = ({ children, className, ...props }: SpaceProps) => {
  return (
    <Space className={`box-component ${className}`} {...props}>
      {children}
    </Space>
  );
};

export default Box;
