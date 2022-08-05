import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';

//
import SideBar from './SideBar';

const { Header, Content, Footer } = Layout;

const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideBar />
      <Layout>
        <Header style={{ backgroundColor: '#fff' }} />
        <Content style={{ padding: '10px' }}>
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>©{new Date().getFullYear()} Created by Pihe</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
