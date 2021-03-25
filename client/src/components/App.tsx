import React, { useEffect } from 'react';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { selectCurrentUser } from '../state';
import { BrowserRouter } from 'react-router-dom';
import LayoutHeader from './layout/Header';
import LoginForm from './forms/user/LoginForm/loginForm';
import { Layout } from 'antd';
import Routes from './Routes/Routes';
import '../assets/less/imports.less';
import DisplayGlobalMessage from './DisplayGlobalMessage/DisplayGlobalMessage';

const { Header, Footer } = Layout;

const App: React.FC = () => {
  const { getCurrentUser } = useActions();
  const user = useTypedSelector(selectCurrentUser);

  // Check for currentUser
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <BrowserRouter>
      <Layout>
        <Header>
          <LayoutHeader />
        </Header>
        {/*<Suspense fallback={<div>Loading...</div>}>*/}
        {/*  {isCurrentlyAuthenticating ? <Loader /> : <Routes />}*/}
        {/*</Suspense>*/}
        <Routes />

        <Footer style={{ position: 'sticky', bottom: '0' }}>Footer</Footer>

        {!user && <LoginForm />}
      </Layout>
      <DisplayGlobalMessage />
    </BrowserRouter>
  );
};

export default App;
