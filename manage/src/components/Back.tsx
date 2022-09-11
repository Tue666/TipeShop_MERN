import { useNavigate } from 'react-router-dom';
import { scroller } from 'react-scroll';
import styled from 'styled-components';
import { Space, Typography, Dropdown, Menu, MenuProps } from 'antd';
import { LeftOutlined, MenuOutlined } from '@ant-design/icons';

// hooks
import useOffsetTop from '../hooks/useOffsetTop';
// constant
import { HEADER_HEIGHT } from '../constant';

const { Text } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

interface BackProps {
  backTo: string;
  scrollKeys: MenuItem[];
}

const Back = ({ backTo, scrollKeys }: BackProps) => {
  const navigate = useNavigate();
  const isOffsetTop = useOffsetTop(HEADER_HEIGHT - 20);
  const active = {
    padding: '10px 20px',
    top: '45px',
  };

  const handleBack = () => {
    navigate(backTo);
  };
  const handleScroll: MenuProps['onClick'] = (item) => {
    const { key } = item;
    scroller.scrollTo(key, {
      duration: 500,
      delay: 0,
      offset: (HEADER_HEIGHT + 25) * -1,
      smooth: 'easeInOutQuart',
    });
  };
  return (
    <RootStyle
      className={`${isOffsetTop ? 'main-header' : ''}`}
      style={{ ...(isOffsetTop && active) }}
    >
      <Text strong onClick={handleBack} style={{ cursor: 'pointer' }}>
        <LeftOutlined color="error" /> Back
      </Text>
      {scrollKeys.length > 0 ? (
        <Dropdown
          overlay={<Menu onClick={handleScroll} items={scrollKeys} />}
          placement="bottomRight"
          arrow
        >
          <MenuOutlined />
        </Dropdown>
      ) : (
        <div></div>
      )}
    </RootStyle>
  );
};

const RootStyle = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '5px 10px',
  position: 'sticky',
  top: `${HEADER_HEIGHT - 14}px`,
  zIndex: 999,
  marginBottom: '20px',
  transition: '0.5s',
  borderRadius: '5px',
});

export default Back;
