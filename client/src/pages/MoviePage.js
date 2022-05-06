import React from 'react';
import moment from 'moment';
import { Form, FormInput, FormGroup, Button } from 'shards-react';

import { Table, Row, Col, Divider, DatePicker, Slider } from 'antd';

import { getAllMovies } from '../fetcher';

import MenuBar from '../components/MenuBar';

const { Column } = Table;

class MoviesPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      titleQuery: '',
      startYearLow: 1000,
      startYearHigh: 3000,
      ratingLow: 0,
      ratingHigh: 10,
      moviesResults: [],
    };

    this.handleTitleQueryChange = this.handleTitleQueryChange.bind(this);
    this.handleYearQueryChange = this.handleYearQueryChange.bind(this);
    this.handleRatingQueryChange = this.handleRatingQueryChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
    this.goToMovieProfile = this.goToMovieProfile.bind(this);
  }

  handleTitleQueryChange(event) {
    console.log('aaa');
    console.log(event.target.value);
    this.setState({
      titleQuery: event.target.value,
    });
  }

  handleYearQueryChange(dates, dateStrings) {
    // console.log(typeof dateStrings[0]);
    this.setState({
      startYearLow: parseInt(dateStrings[0], 10),
      startYearHigh: parseInt(dateStrings[1], 10),
    });
    console.log(this.state);
  }

  handleRatingQueryChange(value) {
    console.log('aaa');
    console.log(value);
    this.setState({
      ratingLow: value[0],
      ratingHigh: value[1],
    });
  }
  goToMovieProfile(movieId) {
    window.location = `/movie/${movieId}`;
  }

  updateSearchResults() {
    console.log(this.state);
    getAllMovies(
      this.state.titleQuery,
      this.state.startYearLow,
      this.state.startYearHigh,
      this.state.ratingLow,
      this.state.ratingHigh,
      null,
      null
    ).then((res) => {
      console.log(res);
      this.setState({ moviesResults: res.results });
    });
  }

  componentDidMount() {
    console.log('mount');
    getAllMovies(
      this.state.titleQuery,
      this.state.startYearLow,
      this.state.startYearHigh,
      this.state.ratingLow,
      this.state.ratingHigh,
      null,
      null
    ).then((res) => {
      this.setState({ moviesResults: res.results });
    });
  }

  render() {
    return (
      <div>
        <MenuBar />
        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
          <Row>
            <Col flex={2}>
              <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Title</label>
                <FormInput
                  placeholder='Movie Title'
                  value={this.state.titleQuery}
                  onChange={this.handleTitleQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <label>Release Year</label>
                <DatePicker.RangePicker
                  picker='year'
                  onChange={this.handleYearQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                <Row>
                  <label>Rating</label>
                </Row>
                <Slider
                  range
                  defaultValue={[0, 10]}
                  step={0.1}
                  max={10}
                  onChange={this.handleRatingQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: '10vw' }}>
                <Button
                  style={{ marginTop: '4vh' }}
                  onClick={this.updateSearchResults}
                >
                  Search
                </Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <Divider />
        <Table
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                this.goToMovieProfile(record.movie_id);
              }, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter
            };
          }}
          dataSource={this.state.moviesResults}
          pagination={{
            pageSizeOptions: [5, 10],
            defaultPageSize: 5,
            showQuickJumper: true,
          }}
        >
          <Column
            title='Title'
            dataIndex='primaryTitle'
            key='primaryTitle'
            sorter={(a, b) => a.primaryTitle.localeCompare(b.primaryTitle)}
          />
          <Column
            title='Release Date'
            dataIndex='startYear'
            key='startYear'
            sorter={(a, b) => a.startYear.localeCompare(b.startYear)}
          />
          <Column
            title='Rating'
            dataIndex='averageRating'
            key='averageRating'
            sorter={(a, b) => a.averageRating.localeCompare(b.averageRating)}
          />
        </Table>
      </div>
    );
  }
}

export default MoviesPage;
