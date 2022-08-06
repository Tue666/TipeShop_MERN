import { ReactNode } from 'react';
import { Space, SpaceProps } from 'antd';

interface BoxProps {
  style?: { [key: string]: string | number };
  children: ReactNode;
}

const Box = ({ style, children, ...props }: BoxProps & SpaceProps) => {
  return (
    <Space className="box-component" style={style} {...props}>
      {children}
    </Space>
  );
};

export default Box;
