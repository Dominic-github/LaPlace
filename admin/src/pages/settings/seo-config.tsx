import { useState, useEffect } from 'react';
import { Card, Form, InputNumber, Button, message, Divider, Space, Alert, Row, Col, Switch } from 'antd';
import { SaveOutlined, ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface SEOConfigData {
  // Page Analysis (50 điểm) - Dựa trên SEOquake
  url: {
    minLength: number;
    maxLength: number;
    weight: number;
  };
  metaTitle: {
    minLength: number;
    maxLength: number;
    weight: number;
  };
  metaDescription: {
    minLength: number;
    maxLength: number;
    weight: number;
  };
  metaKeywords: {
    minCount: number;
    maxCount: number;
    weight: number;
  };
  headings: {
    requireH1: boolean;
    maxH1Count: number;
    requireH2: boolean;
    weight: number;
  };
  images: {
    requireAlt: boolean;
    weight: number;
  };

  // Content Quality (30 điểm)
  contentLength: {
    minWords: number;
    weight: number;
  };
  keywordDensity: {
    minPercent: number;
    maxPercent: number;
    weight: number;
  };
  links: {
    minInternal: number;
    minExternal: number;
    maxExternal: number;
    weight: number;
  };

  // Site Compliance (20 điểm)
  technical: {
    requireRobotsTxt: boolean;
    requireSitemap: boolean;
    requireFavicon: boolean;
    requireDoctype: boolean;
    requireEncoding: boolean;
    weight: number;
  };
}

const DEFAULT_CONFIG: SEOConfigData = {
  // Page Analysis - 50 điểm (Theo SEOquake)
  url: {
    minLength: 10,
    maxLength: 115,
    weight: 5,
  },
  metaTitle: {
    minLength: 10,
    maxLength: 70,
    weight: 10,
  },
  metaDescription: {
    minLength: 70,
    maxLength: 160,
    weight: 10,
  },
  metaKeywords: {
    minCount: 3,
    maxCount: 10,
    weight: 5,
  },
  headings: {
    requireH1: true,
    maxH1Count: 1,
    requireH2: true,
    weight: 10,
  },
  images: {
    requireAlt: true,
    weight: 10,
  },

  // Content Quality - 30 điểm
  contentLength: {
    minWords: 250,
    weight: 10,
  },
  keywordDensity: {
    minPercent: 0.5,
    maxPercent: 3.5,
    weight: 10,
  },
  links: {
    minInternal: 1,
    minExternal: 1,
    maxExternal: 10,
    weight: 10,
  },

  // Site Compliance - 20 điểm
  technical: {
    requireRobotsTxt: true,
    requireSitemap: true,
    requireFavicon: true,
    requireDoctype: true,
    requireEncoding: true,
    weight: 20,
  },
};

export const SEOConfigPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<SEOConfigData>(DEFAULT_CONFIG);

  // Load config from backend
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/settings/seo_config', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const configData = typeof data.data.value === 'string' 
            ? JSON.parse(data.data.value) 
            : data.data.value;
          setConfig(configData);
          form.setFieldsValue(configData);
        }
      }
    } catch (error) {
      console.error('Error loading SEO config:', error);
    }
  };

  const handleSave = async (values: SEOConfigData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/settings/seo_config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          value: values,
          group: 'seo',
          label: 'Cấu hình SEO Tool',
          description: 'Cấu hình quy tắc tính điểm SEO',
          type: 'json',
        }),
      });

      if (response.ok) {
        message.success('Lưu cấu hình SEO thành công!');
        setConfig(values);
      } else {
        message.error('Lưu cấu hình thất bại!');
      }
    } catch (error) {
      message.error('Lỗi khi lưu cấu hình!');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue(DEFAULT_CONFIG);
    message.info('Đã khôi phục cấu hình mặc định');
  };

  const calculateTotalWeight = () => {
    const values = form.getFieldsValue();
    return (
      (values.url?.weight || 0) +
      (values.metaTitle?.weight || 0) +
      (values.metaDescription?.weight || 0) +
      (values.metaKeywords?.weight || 0) +
      (values.headings?.weight || 0) +
      (values.images?.weight || 0) +
      (values.contentLength?.weight || 0) +
      (values.keywordDensity?.weight || 0) +
      (values.links?.weight || 0) +
      (values.technical?.weight || 0)
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <Space>
            <CheckCircleOutlined />
            Cấu hình SEO Tool
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              Khôi phục mặc định
            </Button>
          </Space>
        }
      >
        <Alert
          message="📊 Cấu hình SEO dựa trên SEOquake"
          description={
            <div>
              <p><strong>Tổng trọng số: {calculateTotalWeight()}/100</strong></p>
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                <li><strong>Page Analysis (50đ):</strong> URL, Meta Title, Meta Description, Meta Keywords, Headings, Images Alt</li>
                <li><strong>Content Quality (30đ):</strong> Độ dài nội dung, Mật độ từ khóa, Liên kết</li>
                <li><strong>Site Compliance (20đ):</strong> Robots.txt, Sitemap, Favicon, Doctype, Encoding</li>
              </ul>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={form}
          layout="vertical"
          initialValues={config}
          onFinish={handleSave}
        >
          {/* PAGE ANALYSIS - 50 điểm */}
          <h3 style={{ marginTop: 0 }}>📄 Page Analysis (50 điểm)</h3>

          <Row gutter={24}>
            {/* URL */}
            <Col span={8}>
              <Card size="small" title="🔗 URL (5đ)" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Min" name={['url', 'minLength']} rules={[{ required: true }]}>
                      <InputNumber min={1} max={200} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Max" name={['url', 'maxLength']} rules={[{ required: true }]}>
                      <InputNumber min={1} max={200} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Trọng số" name={['url', 'weight']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={100} style={{ width: 100 }} />
                </Form.Item>
              </Card>
            </Col>

            {/* Meta Title */}
            <Col span={8}>
              <Card size="small" title="📝 Meta Title (10đ)" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Min" name={['metaTitle', 'minLength']} rules={[{ required: true }]}>
                      <InputNumber min={1} max={200} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Max" name={['metaTitle', 'maxLength']} rules={[{ required: true }]}>
                      <InputNumber min={1} max={200} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Trọng số" name={['metaTitle', 'weight']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={100} style={{ width: 100 }} />
                </Form.Item>
              </Card>
            </Col>

            {/* Meta Description */}
            <Col span={8}>
              <Card size="small" title="📄 Meta Description (10đ)" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Min" name={['metaDescription', 'minLength']} rules={[{ required: true }]}>
                      <InputNumber min={1} max={500} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Max" name={['metaDescription', 'maxLength']} rules={[{ required: true }]}>
                      <InputNumber min={1} max={500} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Trọng số" name={['metaDescription', 'weight']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={100} style={{ width: 100 }} />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          <Row gutter={24}>
            {/* Meta Keywords */}
            <Col span={8}>
              <Card size="small" title="🏷️ Meta Keywords (5đ)" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Min" name={['metaKeywords', 'minCount']} rules={[{ required: true }]}>
                      <InputNumber min={0} max={50} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Max" name={['metaKeywords', 'maxCount']} rules={[{ required: true }]}>
                      <InputNumber min={0} max={50} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Trọng số" name={['metaKeywords', 'weight']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={100} style={{ width: 100 }} />
                </Form.Item>
              </Card>
            </Col>

            {/* Headings */}
            <Col span={8}>
              <Card size="small" title="📑 Headings (10đ)" style={{ marginBottom: 16 }}>
                <Form.Item label="Yêu cầu H1" name={['headings', 'requireH1']} valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="Số H1 tối đa" name={['headings', 'maxH1Count']} rules={[{ required: true }]}>
                  <InputNumber min={1} max={5} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Yêu cầu H2" name={['headings', 'requireH2']} valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="Trọng số" name={['headings', 'weight']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={100} style={{ width: 100 }} />
                </Form.Item>
              </Card>
            </Col>

            {/* Images Alt */}
            <Col span={8}>
              <Card size="small" title="🖼️ Images Alt (10đ)" style={{ marginBottom: 16 }}>
                <Form.Item label="Yêu cầu Alt text" name={['images', 'requireAlt']} valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item label="Trọng số" name={['images', 'weight']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={100} style={{ width: 100 }} />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          {/* CONTENT QUALITY - 30 điểm */}
          <h3 style={{ marginTop: 24 }}>📝 Content Quality (30 điểm)</h3>

          <Row gutter={24}>
            {/* Content Length */}
            <Col span={8}>
              <Card size="small" title="📏 Độ dài nội dung (10đ)" style={{ marginBottom: 16 }}>
                <Form.Item label="Tối thiểu (từ)" name={['contentLength', 'minWords']} rules={[{ required: true }]}>
                  <InputNumber min={50} max={5000} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Trọng số" name={['contentLength', 'weight']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={100} style={{ width: 100 }} />
                </Form.Item>
              </Card>
            </Col>

            {/* Keyword Density */}
            <Col span={8}>
              <Card size="small" title="🎯 Mật độ từ khóa (10đ)" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Min (%)" name={['keywordDensity', 'minPercent']} rules={[{ required: true }]}>
                      <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Max (%)" name={['keywordDensity', 'maxPercent']} rules={[{ required: true }]}>
                      <InputNumber min={0} max={10} step={0.1} style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label="Trọng số" name={['keywordDensity', 'weight']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={100} style={{ width: 100 }} />
                </Form.Item>
              </Card>
            </Col>

            {/* Links */}
            <Col span={8}>
              <Card size="small" title="🔗 Liên kết (10đ)" style={{ marginBottom: 16 }}>
                <Form.Item label="Link nội bộ min" name={['links', 'minInternal']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={50} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Link ngoài min" name={['links', 'minExternal']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={50} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Link ngoài max" name={['links', 'maxExternal']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Trọng số" name={['links', 'weight']} rules={[{ required: true }]}>
                  <InputNumber min={0} max={100} style={{ width: 100 }} />
                </Form.Item>
              </Card>
            </Col>
          </Row>

          {/* SITE COMPLIANCE - 20 điểm */}
          <h3 style={{ marginTop: 24 }}>⚙️ Site Compliance (20 điểm)</h3>

          <Row gutter={24}>
            <Col span={24}>
              <Card size="small" title="🔧 Technical Requirements (20đ)" style={{ marginBottom: 16 }}>
                <Row gutter={24}>
                  <Col span={8}>
                    <Form.Item label="Yêu cầu Robots.txt" name={['technical', 'requireRobotsTxt']} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item label="Yêu cầu Sitemap" name={['technical', 'requireSitemap']} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Yêu cầu Favicon" name={['technical', 'requireFavicon']} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item label="Yêu cầu Doctype" name={['technical', 'requireDoctype']} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Yêu cầu Encoding" name={['technical', 'requireEncoding']} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                    <Form.Item label="Trọng số" name={['technical', 'weight']} rules={[{ required: true }]}>
                      <InputNumber min={0} max={100} style={{ width: 100 }} />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                Lưu cấu hình
              </Button>
              <Button onClick={handleReset} size="large">
                Khôi phục mặc định
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

