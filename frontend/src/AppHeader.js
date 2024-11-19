import React from 'react';
import { Layout, Menu } from 'antd';

import AuthWidget from './AuthWidget';


const { Header } = Layout;

const AppHeader = () => {

  const menuItems = [
    { key: 'citationsFinder', label: 'CITATIONS FINDER' },
    // Add other items here
    // { key: 'locations', label: 'LOCATIONS' },
    // { key: 'account', label: 'MY ACCOUNT' },
    // { key: 'geoTagPhotos', label: 'GEO TAG PHOTOS' },
    // { key: 'linkIndexChecker', label: 'LINK INDEX CHECKER' },
  ];
 
  return (
    <Header>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['citationsFinder']} items={menuItems}  style={{ flexGrow: 1 , marginInline:20 } } />
        <AuthWidget />
      </div>
    </Header>
  );

};

export default AppHeader;