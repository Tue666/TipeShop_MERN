import styled from 'styled-components';
import { Space, SpaceProps } from 'antd';

interface BoxProps extends SpaceProps {
  iw?: number;
}

const Box = ({ iw = 100, children, className, ...props }: BoxProps) => {
  return (
    <RootStyled iw={iw} className={`box-component ${className}`} {...props}>
      {children}
    </RootStyled>
  );
};

const RootStyled = styled(Space)<BoxProps>(({ iw }) => ({
  '& > .ant-space-item': {
    width: `${iw}%`,
  },
}));

export default Box;
