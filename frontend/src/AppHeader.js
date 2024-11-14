import React from 'react';
import { Layout, Menu } from 'antd';

import AuthWidget from './AuthWidget';


const { Header } = Layout;

const AppHeader = () => {


  return (
    <Header>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['citationsFinder']}>
          <Menu.Item key="locations">LOCATIONS</Menu.Item>
          <Menu.Item key="account">MY ACCOUNT</Menu.Item>
          <Menu.Item key="geoTagPhotos">GEO TAG PHOTOS</Menu.Item>
          <Menu.Item key="citationsFinder">CITATIONS FINDER</Menu.Item>
          <Menu.Item key="linkIndexChecker">LINK INDEX CHECKER</Menu.Item>
        </Menu>
        <AuthWidget />
      </div>
    </Header>   
  );
};

export default AppHeader;