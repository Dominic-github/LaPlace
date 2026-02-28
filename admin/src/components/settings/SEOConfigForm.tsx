import { Form, InputNumber, Switch, Card, Row, Col, Alert } from 'antd';

interface SEOConfigFormProps {
  // No props needed - will be part of parent form
}

export const SEOConfigForm: React.FC<SEOConfigFormProps> = () => {
  return (
    <div>
      <Alert
        message="Cấu hình tính điểm SEO"
        description={
          <div>
            <strong>Tổng điểm: 100</strong>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li>📄 Page Analysis: 50 điểm</li>
              <li>📝 Content Quality: 30 điểm</li>
              <li>⚙️ Site Compliance: 20 điểm</li>
            </ul>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {/* PAGE ANALYSIS - 50 điểm */}
      <Card 
        title="📄 PAGE ANALYSIS (50 điểm)" 
        size="small" 
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          {/* URL */}
          <Col span={8}>
            <h4>URL (5đ)</h4>
            <Form.Item name={['seo_config', 'url', 'minLength']} label="Min Length">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'url', 'maxLength']} label="Max Length">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'url', 'weight']} label="Trọng số">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* Meta Title */}
          <Col span={8}>
            <h4>Meta Title (10đ)</h4>
            <Form.Item name={['seo_config', 'metaTitle', 'minLength']} label="Min Length">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'metaTitle', 'maxLength']} label="Max Length">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'metaTitle', 'weight']} label="Trọng số">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* Meta Description */}
          <Col span={8}>
            <h4>Meta Description (10đ)</h4>
            <Form.Item name={['seo_config', 'metaDescription', 'minLength']} label="Min Length">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'metaDescription', 'maxLength']} label="Max Length">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'metaDescription', 'weight']} label="Trọng số">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          {/* Meta Keywords */}
          <Col span={8}>
            <h4>Meta Keywords (5đ)</h4>
            <Form.Item name={['seo_config', 'metaKeywords', 'minCount']} label="Min Count">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'metaKeywords', 'maxCount']} label="Max Count">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'metaKeywords', 'weight']} label="Trọng số">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* Headings */}
          <Col span={8}>
            <h4>Headings (10đ)</h4>
            <Form.Item name={['seo_config', 'headings', 'requireH1']} label="Require H1" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['seo_config', 'headings', 'maxH1Count']} label="Max H1 Count">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'headings', 'requireH2']} label="Require H2" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['seo_config', 'headings', 'weight']} label="Trọng số">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* Images */}
          <Col span={8}>
            <h4>Images Alt (10đ)</h4>
            <Form.Item name={['seo_config', 'images', 'requireAlt']} label="Require Alt" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item name={['seo_config', 'images', 'weight']} label="Trọng số">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* CONTENT QUALITY - 30 điểm */}
      <Card 
        title="📝 CONTENT QUALITY (30 điểm)" 
        size="small" 
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          {/* Content Length */}
          <Col span={8}>
            <h4>Content Length (10đ)</h4>
            <Form.Item name={['seo_config', 'contentLength', 'minWords']} label="Min Words">
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'contentLength', 'weight']} label="Trọng số">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* Keyword Density */}
          <Col span={8}>
            <h4>Keyword Density (10đ)</h4>
            <Form.Item name={['seo_config', 'keywordDensity', 'minPercent']} label="Min %">
              <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'keywordDensity', 'maxPercent']} label="Max %">
              <InputNumber min={0} max={100} step={0.1} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'keywordDensity', 'weight']} label="Trọng số">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          {/* Links */}
          <Col span={8}>
            <h4>Links (10đ)</h4>
            <Form.Item name={['seo_config', 'links', 'minInternal']} label="Min Internal">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'links', 'minExternal']} label="Min External">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'links', 'maxExternal']} label="Max External">
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={['seo_config', 'links', 'weight']} label="Trọng số">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* SITE COMPLIANCE - 20 điểm */}
      <Card
        title="⚙️ SITE COMPLIANCE (20 điểm)"
        size="small"
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <h4>Technical Requirements (20đ)</h4>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name={['seo_config', 'technical', 'requireRobotsTxt']} label="Require robots.txt" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item name={['seo_config', 'technical', 'requireSitemap']} label="Require sitemap.xml" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['seo_config', 'technical', 'requireFavicon']} label="Require Favicon" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item name={['seo_config', 'technical', 'requireDoctype']} label="Require Doctype" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={['seo_config', 'technical', 'requireEncoding']} label="Require Encoding" valuePropName="checked">
                  <Switch />
                </Form.Item>
                <Form.Item name={['seo_config', 'technical', 'weight']} label="Trọng số">
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};


