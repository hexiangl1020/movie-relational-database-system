import React from 'react';
import { withRouter } from 'react-router';
import {
  Form,
  FormInput,
  FormGroup,
  Button,
  Card,
  CardBody,
  CardTitle,
  Progress,
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
import { getmvmatches, getmvmbtipct } from '../fetcher';
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const matchmovieColumns = [
  {
    title: 'movie_id',
    dataIndex: 'movie_id',
    key: 'movie_id',

    //render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>,
  },
  {
    title: 'primaryTitle',
    dataIndex: 'primaryTitle',
    key: 'primaryTitle',
  },
  {
    title: 'startYear',
    dataIndex: 'startYear',
    key: 'startYear',
  },
  {
    title: 'averageRating',
    dataIndex: 'averageRating',
    key: 'averageRating',
  },
];

const moviepctColumns = [
  {
    title: 'movie_id',
    dataIndex: 'movie_id',
    key: 'movie_id',
    //render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>,
  },
  {
    title: 'mbti',
    dataIndex: 'mbti',
    key: 'mbti',
  },
  {
    title: 'percentage',
    dataIndex: 'percentage',
    key: 'percentage',
    sorter: (a, b) => a.percentage - b.percentage,
  },
];

class MoviePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PageNumber: 1,
      PageSize: 10,
      movieResults: [],
      movie_idQuery: '',
      pctresults: [],
    };
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
    //this.movieOnChange=this.movieOnChange.bind(this)
  }

  handleQueryChange(event) {
    this.setState({ movie_idQuery: event.target.value });
  }

  updateSearchResults() {
    //TASK 23: call getPlayerSearch and update playerResults in state. See componentDidMount() for a hint
    getmvmatches(this.state.movie_idQuery).then((res) => {
      this.setState({ movieResults: res.results });
    });

    getmvmbtipct(this.state.movie_idQuery).then((res) => {
      this.setState({ pctresults: res.results });
    });
  }

  componentDidMount() {
    const { mvid } = this.props.match.params;
    this.setState({ movie_idQuery: mvid });

    getmvmatches(mvid).then((res) => {
      this.setState({ movieResults: res.results[0] });
    });

    getmvmbtipct(mvid).then((res) => {
      this.setState({ pctresults: res.results });
    });

    //gettop5mvmbti(null).then(res => {
    //  this.setState({ top5: res.results })
    //})
  }

  render() {
    return (
      <div className='movieProfile'>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <Card>
            <CardBody>
              <Row gutter='30' align='middle' justify='center'>
                <Col flex={2} style={{ textAlign: 'left' }}>
                  <h3>{this.state.movieResults.primaryTitle}</h3>
                </Col>
              </Row>
              <Row gutter='30' align='middle' justify='left'>
                <Col>
                  <h5>Start Year: {this.state.movieResults.startYear}</h5>
                </Col>
              </Row>
              <Row gutter='30' align='middle' justify='left'>
                <Col>
                  <h5>
                    AverageRating: {this.state.movieResults.averageRating}
                  </h5>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
        <Divider />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Percentage of Each MBTI type of characters in this movie</h3>
          <Table
            dataSource={this.state.pctresults}
            columns={moviepctColumns}
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(MoviePage);
