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
import { getCharacter, getMovie,getCharacterSameActorMBTI,getCharacterSameMBTI } from '../fetcher';
const wideFormat = format('.3r');
const { Column, ColumnGroup } = Table;

const sameMbtiColumns = [
  {
    title: '',
    dataIndex: 'img_url',
    key: 'img_url',
    render:  img_url => img_url=='https://www.personality-database.com/images/profile_transparent.png' || img_url==null ? <img style={{ width: '10vw', height: '10vw'}} src='https://www.booksie.com/files/profiles/22/mr-anonymous_230x230.png' /> : <img style={{ width: '10vw', height: '10vw'}} src={img_url} /> 
  },
  {
    title:'Character',
    dataIndex:'Name',
    key:'Name'
  },
  {
    title: 'Movie Title',
    dataIndex: 'movie_title',
    key: 'movie_title',
  }
];

class CharacterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieId:'',
      characterName:'',
      mbti:'',
      img_url:'',
      movieDetails:null,
      sameActorMbti:[],
      sameMbti:[]
    };
    this.goToMovie = this.goToMovie.bind(this);
    this.goToCharacter = this.goToCharacter.bind(this)

  }

  goToMovie(){
    window.location = `/movie/${this.state.movieDetails.movie_id}`;
  }

  goToCharacter(mvid, name) {
    window.location = `/characterInfo/${mvid}/${name}`
  }

  componentDidMount() {
    const { movieId, name } = this.props.match.params;

    this.setState({ movieId: movieId });
    this.setState({ characterName:name })
    
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
            <Card style={{ width: '50vw', margin: '0 auto', background: '#fcf9e8'}}>
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
                      style={{ height: '20vh' }}
                    />
                  </Col>
                </Row>
                <Row gutter='30' align='middle' justify='left'>
                  <Col>
                    <h5>MBTI: {this.state.mbti}</h5>
                  </Col>
                </Row>
                <Row gutter='30' align='middle' justify='left' style={{cursor:'pointer'}} onClick={this.goToMovie}>
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
                  style={{cursor:'pointer'}}
                  columns={sameMbtiColumns}
                  pagination={{
                    pageSizeOptions: [5, 10],
                    defaultPageSize: 5,
                    showQuickJumper: true,
                  }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: event => {this.goToCharacter(record.movie_id, record.Name)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
                    };
                  }}
                >
                </Table>
              </div>): null}


            <Divider />
            {this.state.sameActorMbti.length>0 ? (
              <div className='sameMbtiActor'>
                <Row gutter='30' align='middle' justify='center'>
                  <h5>Other "{this.state.mbti}" Characters Played by {this.state.sameActorMbti[0].primaryName}</h5> 
                </Row>
                <Table
                  style={{cursor:'pointer'}}
                  dataSource={this.state.sameActorMbti}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: event => {this.goToCharacter(record.movie_id, record.character_name)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
                    };
                  }}
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

export default withRouter(CharacterPage);
