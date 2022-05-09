import React from 'react';
import { withRouter } from "react-router";
import {
  Form,
  FormInput,
  FormGroup,
  Button,
  Card,
  CardBody,
} from 'shards-react';

import {
  Table,
  Pagination,
  Select,
  Row,
  Col,
  Divider,
  Slider,
  Rate,
} from 'antd';
import { RadarChart } from 'react-vis';
import { format } from 'd3-format';

import MenuBar from '../components/MenuBar';
const gridStyle = {
    width: '25%',
    textAlign: 'center',
  };

class Introduction extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MenuBar />
        <Card title="Card Title">
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
            <Card.Grid style={gridStyle}>Content</Card.Grid>
        </Card>
      </div>
    );
  }
}

export default withRouter(Introduction);