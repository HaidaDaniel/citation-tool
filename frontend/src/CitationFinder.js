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
  
    try {

      const { taskIds } = await submitSearch(values);
      console.log('Created tasks:', taskIds);
  
      const interval = setInterval(async () => {
        try {
          const response = await checkTaskStatus(taskIds);
  
          if (response.status === 'ready') {
            console.log('All tasks are ready:', response.results);
            // const combinedData = response.results.map((result) => ({

 
            //   date: result.tasks[0].results[0].datetime,
            //   items: result.tasks[0].results[0].items,
            //   keyword: result.tasks[0].results[0].keyword,
            //   citationsFound: result.tasks[0].results[0].items_count,
            //   foundBy: result.foundBy,
            //   viewSerp: result.tasks[0].results[0].check_url,
            // }));

            clearInterval(interval);
  

            // setTableData(response.results);
  
            message.success('Search completed successfully!');
          } else {
            console.log('Tasks are still pending...');
          }
        } catch (error) {
          console.error('Error checking task status:', error);
          clearInterval(interval);
          message.error('Error checking task status');
        }
      }, 9000); 
    } catch (error) {
      message.error('Error submitting search');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
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