import React from 'react';
import { withRouter } from "react-router";
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
import { getPlayerSearch, getPlayer, getCharacter, getMovie,getCharacterSameActorMBTI,getCharacterSameMBTI } from '../fetcher';
const wideFormat = format('.3r');
const { Column, ColumnGroup } = Table;

const sameMbtiColumns = [
  {
    title: 'img',
    dataIndex: 'img_url',
    key: 'img_url',
    render:  img_url => <img src={img_url} />
  },
  {
    title:'Character Name',
    dataIndex:'Name',
    key:'Name'
  },
  {
    title: 'Movie Title',
    dataIndex: 'movie_title',
    key: 'movie_title',
  }
];

class PlayersPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameQuery: '',
      nationalityQuery: '',
      clubQuery: '',
      ratingHighQuery: 100,
      ratingLowQuery: 0,
      potHighQuery: 100,
      potLowQuery: 0,
      selectedPlayerId: window.location.search
        ? window.location.search.substring(1).split('=')[1]
        : 229594,
      selectedPlayerDetails: null,
      playersResults: [],


      movieId:'',
      characterName:'',
      mbti:'',
      img_url:'',
      movieDetails:null,
      sameActorMbti:[],
      sameMbti:[]
    };



    this.updateSearchResults = this.updateSearchResults.bind(this);
    this.handleNameQueryChange = this.handleNameQueryChange.bind(this);
    this.handleNationalityQueryChange =
      this.handleNationalityQueryChange.bind(this);
    this.handleClubQueryChange = this.handleClubQueryChange.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handlePotentialChange = this.handlePotentialChange.bind(this);
  }

  handleNameQueryChange(event) {
    this.setState({ nameQuery: event.target.value });
  }

  handleClubQueryChange(event) {
    // TASK 20: update state variables appropriately. See handleNameQueryChange(event) for reference
    this.setState({ clubQuery: event.target.value });
  }

  handleNationalityQueryChange(event) {
    // TASK 21: update state variables appropriately. See handleNameQueryChange(event) for reference
    this.setState({ nationalityQuery: event.target.value });
  }

  handleRatingChange(value) {
    this.setState({ ratingLowQuery: value[0] });
    this.setState({ ratingHighQuery: value[1] });
  }

  handlePotentialChange(value) {
    // TASK 22: parse value and update state variables appropriately. See handleRatingChange(value) for reference
    this.setState({ potLowQuery: value[0] });
    this.setState({ potHighQuery: value[1] });
  }

  updateSearchResults() {
    //TASK 23: call getPlayerSearch and update playerResults in state. See componentDidMount() for a hint
    getPlayerSearch(
      this.state.nameQuery,
      this.state.nationalityQuery,
      this.state.clubQuery,
      this.state.ratingHighQuery,
      this.state.ratingLowQuery,
      this.state.potHighQuery,
      this.state.potLowQuery,
      null,
      null
    ).then((res) => {
      this.setState({ playersResults: res.results });
    });
  }

  componentDidMount() {
    const { movieId, name } = this.props.match.params;

    this.setState({ movieId: movieId });
    this.setState({ characterName:name })

    // getPlayerSearch(
    //   this.state.nameQuery,
    //   this.state.nationalityQuery,
    //   this.state.clubQuery,
    //   this.state.ratingHighQuery,
    //   this.state.ratingLowQuery,
    //   this.state.potHighQuery,
    //   this.state.potLowQuery,
    //   null,
    //   null
    // ).then((res) => {
    //   this.setState({ playersResults: res.results });
    // });

    // TASK 25: call getPlayer with the appropriate parameter and set update the correct state variable.
    // See the usage of getMatch in the componentDidMount method of MatchesPage for a hint!
    getCharacter(movieId, name).then((res) => {
      const result = res.results[0];
      this.setState({ mbti: result.mbti });
      this.setState({ img_url: result.img_url });
    });

    getMovie(movieId).then((res) => {
      const result = res.results[0];
      this.setState({ movieDetails: result });
    });

    getCharacterSameMBTI(movieId, name).then((res) => {
      const result = res.results;
      this.setState({ sameMbti: result });
    });

    getCharacterSameActorMBTI(movieId, name).then((res) => {
      const result = res.results;
      this.setState({ sameActorMbti: result });
    });
  }

  render() {
    return (
      <div>
        <MenuBar />
          <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
            <Card>
              <CardBody>
                <Row gutter='30' align='middle' justify='center'>
                  <Col flex={2} style={{ textAlign: 'left' }}>
                    <h3>{this.state.characterName}</h3>
                  </Col>

                  <Col flex={2} style={{ textAlign: 'right' }}>
                    <img
                      src={this.state.img_url}
                      referrerpolicy='no-referrer'
                      alt={null}
                      style={{ height: '15vh' }}
                    />
                  </Col>
                </Row>
                <Row gutter='30' align='middle' justify='left'>
                  <Col>
                    <h5>MBTI: {this.state.mbti}</h5>
                  </Col>
                </Row>
                <Row gutter='30' align='middle' justify='left'>
                  <Col>
                    <h5>Movie: {this.state.movieDetails && this.state.movieDetails.primaryTitle}</h5>
                  </Col>
                </Row>
              </CardBody> 
            </Card>
            <Divider />
            {this.state.sameMbti.length>0 ? (
              <div className='sameMbtiActor'>
                <Row gutter='30' align='middle' justify='center'>
                  <h5>Other "{this.state.mbti}" Characters</h5> 
                </Row>
                <Table
                  dataSource={this.state.sameMbti}
                  columns={sameMbtiColumns}
                  pagination={{
                    pageSizeOptions: [5, 10],
                    defaultPageSize: 5,
                    showQuickJumper: true,
                  }}
                >
                </Table>
              </div>): null}


            <Divider />
            {this.state.sameActorMbti.length>0 ? (
              <div className='sameMbtiActor'>
                <Row gutter='30' align='middle' justify='center'>
                  <h5>Other "{this.state.mbti}" Characters played by {this.state.sameActorMbti[0].primaryName}</h5> 
                </Row>
                <Table
                  dataSource={this.state.sameActorMbti}
                >
                  <Column title='Character Name' dataIndex='character_name' key='character_name' />
                  <Column title='Movie Title' dataIndex='movie_title' key='movie_title' />
                </Table>
              </div>): null}
          </div>
      </div>
    );
  }
}

export default withRouter(PlayersPage);
