import React from 'react';
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
import { rankbymbti } from '../fetcher';
const wideFormat = format('.3r');
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const actorColumns = [
  //   {
  //       title: 'actor_id',
  //       dataIndex: 'actor_id',
  //       key: 'actor_id',
  //     //   sorter: (a, b) => a.actor_id.localeCompare(b.actor_id),
  //   },
  {
    title: 'primaryName',
    dataIndex: 'primaryName',
    key: 'primaryName',
    sorter: (a, b) => a.primaryName.localeCompare(b.primaryName),
    // render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>,
  },
  {
    title: 'mbti',
    dataIndex: 'mbti',
    key: 'mbti',
    sorter: (a, b) => a.mbti.localeCompare(b.mbti),
  },
  {
    title: 'count',
    dataIndex: 'count',
    key: 'count',
    sorter: (a, b) => a.count - b.count,
  },
  // TASK 19: copy over your answers for tasks 7 - 9 to add columns for potential, club, and value
];

class ActorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actor_id: '',
      primaryNameQuery: '',
      mbtiQuery: '',
      countQuery: '',
      actorsResults: [],
      pctresults: [],
    };

    this.updateSearchResults = this.updateSearchResults.bind(this);

    this.handlePrimaryNameQueryChange =
      this.handlePrimaryNameQueryChange.bind(this);
    this.handleActorIdQueryChange = this.handleActorIdQueryChange.bind(this);
    this.handlembtiQueryChange = this.handlembtiQueryChange.bind(this);
    this.handleCountQueryChange = this.handleCountQueryChange.bind(this);
    // this.handleRatingChange = this.handleRatingChange.bind(this);
    // this.handlePotentialChange = this.handlePotentialChange.bind(this);
  }

  goToActorPtc(actid) {
    console.log(actid);
    window.location = `/actorpct/${actid}`;
  }

  handleActorIdQueryChange(event) {
    this.setState({ actor_id: event.target.value });
  }

  handlePrimaryNameQueryChange(event) {
    this.setState({ primaryNameQuery: event.target.value });
  }

  handlembtiQueryChange(event) {
    // TASK 20: update state variables appropriately. See handleNameQueryChange(event) for reference
    this.setState({ mbtiQuery: event.target.value });
  }

  handleCountQueryChange(event) {
    // TASK 21: update state variables appropriately. See handleNameQueryChange(event) for reference
    this.setState({ countQuery: event.target.value });
  }

  //   handleRatingChange(value) {
  //     this.setState({ ratingLowQuery: value[0] });
  //     this.setState({ ratingHighQuery: value[1] });
  //   }

  //   handlePotentialChange(value) {
  //     // TASK 22: parse value and update state variables appropriately. See handleRatingChange(value) for reference
  //     this.setState({ potLowQuery: value[0] });
  //     this.setState({ potHighQuery: value[1] });
  //   }

  updateSearchResults() {
    //TASK 23: call getPlayerSearch and update playerResults in state. See componentDidMount() for a hint
    rankbymbti(
      //   this.state.nameQuery,
      //   this.state.nationalityQuery,
      //   this.state.clubQuery,
      //   this.state.ratingHighQuery,
      //   this.state.ratingLowQuery,
      //   this.state.potHighQuery,
      //   this.state.potLowQuery,
      null
    ).then((res) => {
      this.setState({ actorsResults: res.results });
    });
    console.log(this.state.actorsResults);
  }

  componentDidMount() {
    rankbymbti(null).then((res) => {
      this.setState({ actorsResults: res.results });
    });
    console.log(this.state.actorsResults);
  }

  render() {
    return (
      <div className='ActorPage'>
        <MenuBar />
        {/* <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
            <Row>
                <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                    <label>Actor ID</label>
                    <FormInput placeholder="nm000000" value={this.state.actor_id} onChange={this.handleActorIdQueryChange} />
                </FormGroup></Col>
                <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                            <Button style={{ marginTop: '4vh' }} onClick={this.goToActorPtc(this.state.actor_id)}>Search</Button>
                        </FormGroup></Col>
            </Row>

        </Form> */}
        <Divider />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Actors</h3>
          <Table
            dataSource={this.state.actorsResults}
            columns={actorColumns}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  this.goToActorPtc(record.actor_id);
                }, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter
              };
            }}
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
          />
        </div>
        {/* <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Percentage of MBTI types of characters the actor played </h3>
          <Table
            dataSource={this.state.pctresults}
            columns={actorpctColumns}
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
          />
          </div> */}
      </div>
    );
  }
}

export default ActorPage;
