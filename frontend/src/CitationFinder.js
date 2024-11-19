import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Input,
  Table,
  Button,
  Typography,
  Form,
  Spin,
  message,
} from "antd";
import {
  DownloadOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import CitationFinderForm from "./CitationFinderForm";
import LinksModal from "./LinksModal";
import { fetchUserTasks, submitSearch } from "./api";
import { AppContext } from "./AppContext";

const { Content } = Layout;
const { Title } = Typography;

const CitationFinder = () => {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    date: "",
    keyword: "",
    links: [],
  });

  const { user, isAuthenticated, login, logout } = useContext(AppContext);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Keyword",
      dataIndex: "keyword",
      key: "keyword",
    },
    {
      title: "Filename",
      dataIndex: "filename",
      key: "filename",
    },
    {
      title: "Found By",
      dataIndex: "foundBy",
      key: "foundBy",
    },
    {
      title: "Citations Found",
      dataIndex: "citationsFound",
      key: "citationsFound",
    },
    {
      title: "Download",
      key: "filepath",
      render: (text, record) => (
        <Button
          icon={<DownloadOutlined />}
          onClick={() => handleDownload(record)}
        />
      ),
    },
    {
      title: "View Links",
      key: "viewLinks",
      render: (text, record) => (
        <Button icon={<EyeOutlined />} onClick={() => viewLinks(record)} />
      ),
    },
    {
      title: "View SERP",
      key: "viewSerp",
      render: (text, record) => (
        <Button icon={<SearchOutlined />} onClick={() => viewSerp(record)} />
      ),
    },
  ];

  useEffect(() => {
    loadTasks();
  }, [isAuthenticated]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasks = await fetchUserTasks();
      const formattedTasks = tasks.map((task) => ({
        key: task.task_id,
        date: task.created_at,
        keyword: task.keyword,
        filename: task.excel_file_path?.split("/").pop(),
        filepath: task.excel_file_path,
        foundBy: task.keyword_type,
        citationsFound: task.url_qty,
        viewSerp: task.check_url,
        resultData: task.result_data,
      }));
      setTableData(formattedTasks);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Failed to load tasks.");
    }
  };

  const handleDownload = (record) => {
    if (!record.filepath) {
      message.warning("No file available for download.");
      return;
    }
  
   console.log(record.filepath);
  };

  const viewLinks = (record) => {
    if (record.resultData && record.resultData.links.length > 0) {
      setModalData({
        data: record.resultData,
        keyword: record.resultData.keyword,
        links: record.resultData.links,
      });
      setIsModalVisible(true);
    } else {
      message.warning("No links available.");
    }
  };

  const viewSerp = (record) => {
    if (record.viewSerp) {
      window.open(record.viewSerp, "_blank", "noopener,noreferrer");
    } else {
      message.warning("No SERP URL available.");
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { taskIds } = await submitSearch(values);
      message.success("Tasks created successfully!");
    } catch (error) {
      message.error("Failed to submit tasks.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "50px" }}>
        <Title level={3}>Citations Finder</Title>
        {isAuthenticated && (
          <>
            <CitationFinderForm form={form} onSubmit={onSubmit} />
            <Input.Search
              placeholder="Search here"
              style={{ marginBottom: "20px" }}
            />

            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{ pageSize: 25 }}
            />
          </>
        )}

        {/* Use LinksModal here */}
        <LinksModal
          visible={isModalVisible}
          data={modalData}
          onClose={() => setIsModalVisible(false)}
        />
      </Content>
    </Layout>
  );
};

export default CitationFinder;
