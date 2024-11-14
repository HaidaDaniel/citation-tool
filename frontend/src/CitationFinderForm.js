import React from 'react';
import { Form, Input } from 'antd';
import BusinessAutoComplete from './BusinessAutoComplete';

const CitationFinderForm = ({ form }) => {
  const handleFill = (businessDetails) => {
    form.setFieldsValue({
      name: businessDetails.name,
      address: businessDetails.address,
      phone: businessDetails.phone,
      website: businessDetails.website,
    });
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item label="Search Business">
        <BusinessAutoComplete onFill={handleFill} />
      </Form.Item>
      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>
      <Form.Item label="Address" name="address">
        <Input />
      </Form.Item>
      <Form.Item label="Phone" name="phone">
        <Input />
      </Form.Item>
      <Form.Item label="Website" name="website">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default CitationFinderForm;