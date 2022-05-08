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
import Chart from "react-apexcharts";
import MenuBar from '../components/MenuBar';
import { getmvmatches,getmvmbtipct,getMovieCharacterList} from '../fetcher';
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const characterColumns = [
  {
    title: '',
    dataIndex: 'img_url',
    key: 'img_url',
    render:  img_url => img_url=='https://www.personality-database.com/images/profile_transparent.png' || img_url==null ? <img style={{ width: '10vw', height: '10vw'}} src='https://www.booksie.com/files/profiles/22/mr-anonymous_230x230.png' /> : <img style={{ width: '10vw', height: '10vw'}} src={img_url} /> 
  },
  {
    title: 'Character',
    dataIndex: 'Name',
    key: 'Name',
  },
  {
    title: 'MBTI',
    dataIndex: 'mbti',
    key: 'mbti',
  },
  {
    title: 'Actor',
    dataIndex: 'primaryName',
    key: 'primaryName',
  }
];

class MoviePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      PageNumber: 1,
      PageSize: 10,
      movieResults:[],
      movieCharacters:[],
      movie_idQuery:'',
      pctresults:[],
      series: [],
      options: {},
      labels: []
    };
    this.handleQueryChange = this.handleQueryChange.bind(this)
    this.updateSearchResults = this.updateSearchResults.bind(this)
    this.goToCharacter = this.goToCharacter.bind(this)

  }

  goToCharacter(mvid, name) {
    window.location = `/characterInfo/${mvid}/${name}`
  }
  
  handleQueryChange(event) {
    this.setState({ movie_idQuery: event.target.value });
  }

  updateSearchResults() {
    getmvmatches(this.state.movie_idQuery).then(res => {
        this.setState({ movieResults: res.results })
    })

    getmvmbtipct(this.state.movie_idQuery).then(res => {
      this.setState({ pctresults: res.results })
    })

    getmvmbtipct(this.state.movie_idQuery).then((res) => {
      this.setState({ pctresults: res.results });
    });
  }

  componentDidMount() {
    const { mvid } = this.props.match.params;
    this.setState({ movie_idQuery: mvid });

    getmvmatches(mvid).then(res => {
      this.setState({ movieResults: res.results[0] })
    })

    getMovieCharacterList(mvid).then(res => {
      console.log(res.results[3].img_url==null)
      this.setState({ movieCharacters: res.results })
    })
    

    getmvmbtipct(mvid).then(res => {
      this.setState({ pctresults: res.results });
          for (var i = 0; i < this.state.pctresults.length; i++){
            this.setState({ primaryNameQuery: res.results[0].primaryName})
            this.setState({
                series: this.state.series.concat(this.state.pctresults[i].percentage)
              });
            
            
            this.setState({
                labels: this.state.labels.concat(this.state.pctresults[i].mbti)
              });
            }
          this.setState({options : {labels: this.state.labels}})
        });
  }

  render() {
    return (
      <div className='movieProfile'>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <Card style={{ width: '50vw', margin: '0 auto', background: '#fcf9e8'}}>
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
        {this.state.movieCharacters.length>0 ? (
          <div className='movieCharacters' style={{ width: '70vw', margin: '0 auto', marginTop: '3vh' }}>
            <Table
              dataSource={this.state.movieCharacters}
              columns={characterColumns}
              style={{cursor:'pointer'}}
              onRow={(record, rowIndex) => {
                return {
                  onClick: event => {this.goToCharacter(record.movie_id, record.Name)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
                };
              }}
            >
            </Table>
            <Divider />
          </div>): null}
        {this.state.pctresults.length>0 ? (<div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>MBTI Percentage</h3>
          <div className="ActorPercentPage">
              <div className="row">
                  <div className="mixed-chart">
                      <Chart options={this.state.options} series={this.state.series} type="pie" width={750} />
                  </div>
              </div>
          </div>
        </div>) : null}

      </div>
    );
  }
}

export default withRouter(MoviePage);
