import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

//
import SideBar from './SideBar';
import Header from './Header';

const { Content, Footer } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar
        collapsible
        breakpoint="sm"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'auto',
        }}
      />
      <Layout>
        <Header />
        <Content style={{ padding: '20px' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2022 Created by Pihe</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
