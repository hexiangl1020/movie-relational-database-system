import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";
import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Rate 
} from 'antd'
import { RadarChart } from 'react-vis';
import { format } from 'd3-format';

import MenuBar from '../components/MenuBar';
import { getmvmatches,getmvmbtipct} from '../fetcher';
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
  
  }
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
  }
];

class MoviePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PageNumber: 1,
      PageSize: 10,
      movieResults:[],
      movie_idQuery:'',
      pctresults:[]
    };
    this.handleQueryChange = this.handleQueryChange.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)
    //this.movieOnChange=this.movieOnChange.bind(this)

  }

  handleQueryChange(event) {
    this.setState({ movie_idQuery: event.target.value })
  }

  updateSearchResults() {

    //TASK 23: call getPlayerSearch and update playerResults in state. See componentDidMount() for a hint
    getmvmatches(this.state.movie_idQuery).then(res => {
        this.setState({ movieResults: res.results })
    })

    getmvmbtipct(this.state.movie_idQuery).then(res => {
      this.setState({ pctresults: res.results })
    })

}

  componentDidMount() {

    getmvmatches(this.state.movie_idQuery).then(res => {
      this.setState({ movieResults: res.results })
    })

    getmvmbtipct(this.state.movie_idQuery).then(res => {
      this.setState({ pctresults: res.results })
    })

    //gettop5mvmbti(null).then(res => {
    //  this.setState({ top5: res.results })
    //})
  }

  render() {
    return (
      <div>
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>MovieID</label>
                    <FormInput placeholder="tt0058385" value={this.state.movie_idQuery} onChange={this.handleQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResults}>Search</Button>
                        </FormGroup></Col>
            </Row>

        </Form>
        <Divider />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Search a movie by movieID</h3>
          <Table
            dataSource={this.state.movieResults}
            columns={matchmovieColumns}
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
          />
        </div>
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

export default MoviePage;