import React, { useState } from 'react';
import { Layout, Input, Table, Button, Typography, Form, message, Spin } from 'antd';
import { DownloadOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import CitationFinderForm from './CitationFinderForm';
import AppHeader from './AppHeader';
import { checkTaskStatus, submitSearch } from './api';

const { Content } = Layout;
const { Title } = Typography;




const CitationFinder = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

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
      default:'name'
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

  const onSubmit = async (values) => {
    console.log(values);
    setLoading(true);

    const { taskIds } = await submitSearch(values);
  
   console.log(taskIds)
  };

  return (
    <Layout>
      <AppHeader />
      <Content style={{ padding: '50px' }}>
        <Title level={3}>Citations Finder</Title>
        <CitationFinderForm form={form} onSubmit={onSubmit} />
        <Input.Search placeholder="Search here" style={{ marginBottom: '20px' }} />
        <Table columns={columns} dataSource={tableData} pagination={{ pageSize: 25 }} />
        <Form.Item>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={loading}
          >
            {loading ? <Spin /> : 'Submit'}
          </Button>
        </Form.Item>
      </Content>
    </Layout>
  );
};

export default CitationFinder;