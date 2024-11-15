import React from "react";
import { Checkbox, Col, Form, Input, Row } from "antd";
import BusinessAutoComplete from "./BusinessAutoComplete";

const CitationFinderForm = ({ form, onSubmit }) => {
  const handleFill = (businessDetails) => {
    form.setFieldsValue({
      name: businessDetails.name,
      address: businessDetails.address,
      phone: businessDetails.phone,
      website: businessDetails.website,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
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
      <Form.Item name="type" label="Search Types">
      <Checkbox.Group>
        <Row>
          <Col span={7}><Checkbox value="name">Name</Checkbox></Col>
          <Col span={7}><Checkbox value="nameAddress">Name + Address</Checkbox></Col>
          <Col span={7}><Checkbox value="namePhone">Name + Phone</Checkbox></Col>
          <Col span={7}><Checkbox value="nameWebsite">Name + Website</Checkbox></Col>
          <Col span={7}><Checkbox value="nameAddressPhone">Name + Address + Phone</Checkbox></Col>
        </Row>
      </Checkbox.Group>
      </Form.Item>
    </Form>
  );
};

export default CitationFinderForm;