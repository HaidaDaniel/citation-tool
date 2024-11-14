import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Form, Input } from 'antd';
import { loginUser, registerUser } from './api';

const AuthWidget = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    form.resetFields();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    message.success('Logged out successfully');
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const { username, email, password } = values;
    try {
      if (isLoginMode) {
        const token = await loginUser(email, password);
        if (token) {
          localStorage.setItem('token', token);
          setIsAuthenticated(true);
          message.success('Login successful!');
          closeModal();
        }
      } else {
        await registerUser(username, email, password);
        message.success('Registration successful! Please log in.');
        setIsLoginMode(true); // Переключаемся на логин после успешной регистрации
      }
    } catch (error) {
      message.error(isLoginMode ? 'Login failed. Please check your credentials.' : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <Button onClick={handleLogout} type="primary">
          Logout
        </Button>
      ) : (
        <Button onClick={openModal} type="primary">
          {isLoginMode ? 'Login' : 'Register'}
        </Button>
      )}
      <Modal
        title={isLoginMode ? 'Login' : 'Register'}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ email: '', password: '', username: '' }}
        >
          {!isLoginMode && (
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>
          )}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'The input is not a valid email!' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {isLoginMode ? 'Login' : 'Register'}
          </Button>
        </Form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          {isLoginMode ? (
            <span>
              No account?{' '}
              <Button type="link" onClick={toggleMode}>
                Register here
              </Button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <Button type="link" onClick={toggleMode}>
                Login here
              </Button>
            </span>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AuthWidget;
