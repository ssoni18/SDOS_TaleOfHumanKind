import React from 'react';
import Counter from './Counter';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const columnContent = [
  {
    limit: 100,
    type:" Collaborations with Organizations"
  },
  {
    limit: 200,
    type:" Volunteers across globe"
  },
  {
    limit: 300,
    type: "People Impacted so far"
  },
];

export default function App() {
  return (
    <>
      <Container fluid>
        <Row>
          {columnContent.map((content, index) => (
            <Col key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Counter limit={content.limit} description={content.type}/>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}
