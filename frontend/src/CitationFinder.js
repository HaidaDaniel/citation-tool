import React from 'react';
import { Layout, Input, Table, Button, Typography} from 'antd';
import { DownloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import CitationFinderForm from './CitationFinderForm';
import AppHeader from './AppHeader';

const { Content } = Layout;
const { Title } = Typography;

const CitationFinder = () => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
    },
    {
      title: 'Found By',
      dataIndex: 'foundBy',
      key: 'foundBy',
    },
    {
      title: 'Citations Found',
      dataIndex: 'citationsFound',
      key: 'citationsFound',
    },
    {
      title: 'Download',
      key: 'download',
      render: () => <Button icon={<DownloadOutlined />} />,
    },
    {
      title: 'View Links',
      key: 'viewLinks',
      render: () => <Button icon={<EyeOutlined />} />,
    },
    {
      title: 'View SERP',
      key: 'viewSerp',
      render: () => <Button icon={<SearchOutlined />} />,
    },
  ];

  const data = [
    {
      key: '1',
      date: '2024-11-04',
      filename: '1730720973-Klinik Primaria Senawang 24 Jam.csv',
      foundBy: 'name + website',
      citationsFound: 11,
    },
  ];

  return (
    <Layout>
      <AppHeader />
      <Content style={{ padding: '50px' }}>
        <Title level={3}>Citations Finder</Title>
        <CitationFinderForm />

        <Input.Search placeholder="Search here" style={{ marginBottom: '20px' }} />
        <Table columns={columns} dataSource={data} pagination={{ pageSize: 25 }} />
      </Content>
    </Layout>
  );
};

export default CitationFinder;