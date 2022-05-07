import React from 'react';
import { withRouter } from "react-router-dom";
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
import Chart from "react-apexcharts";

import MenuBar from '../components/MenuBar';
import { actorpct } from '../fetcher';
const wideFormat = format('.3r');

const actorColumns = [
//   {
//       title: 'actor_id',
//       dataIndex: 'actor_id',
//       key: 'actor_id',
//       sorter: (a, b) => a.actor_id.localeCompare(b.actor_id),
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
    title: 'percentage',
    dataIndex: 'percentage',
    key: 'percentage',
    sorter: (a, b) => a.count - b.count,
  }
  // TASK 19: copy over your answers for tasks 7 - 9 to add columns for potential, club, and value
];

class ActorPercentPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actor_id: '',
      primaryNameQuery: '',
      mbtiQuery: '',
      percentageQuery: '',
      actorsResults: [],
      pctresults: [],
      series: [],
      options: {
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: [],
        responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
      }
    };
    

    this.updateSearchResults = this.updateSearchResults.bind(this);
    
    this.handlePrimaryNameQueryChange = this.handlePrimaryNameQueryChange.bind(this);
    this.handleActorIdQueryChange = this.handleActorIdQueryChange.bind(this);
    this.handlembtiQueryChange =
      this.handlembtiQueryChange.bind(this);
    this.handlepercentageQueryChange = this.handlepercentageQueryChange.bind(this);
    // this.handleRatingChange = this.handleRatingChange.bind(this);
    // this.handlePotentialChange = this.handlePotentialChange.bind(this);
  }

//   goToActorPtc(actid) {
//     window.location = `/actorpct/${actid}`
//   }

  handleActorIdQueryChange(event){
    this.setState({ actor_id: event.target.value });
  }

  handlePrimaryNameQueryChange(event) {
    this.setState({ primaryNameQuery: event.target.value });
  }

  handlembtiQueryChange(event) {
    // TASK 20: update state variables appropriately. See handleNameQueryChange(event) for reference
    this.setState({ mbtiQuery: event.target.value });
  }

  handlepercentageQueryChange(event) {
    // TASK 21: update state variables appropriately. See handleNameQueryChange(event) for reference
    this.setState({ percentageQuery: event.target.value });
  }

  updateSearchResults() {
    //TASK 23: call getPlayerSearch and update playerResults in state. See componentDidMount() for a hint
    actorpct(
      this.state.actor_id
    ).then((res) => {
      this.setState({ actorsResults: res.results });
    });
    for (let i = 0; i < this.setState.actorsResults.length; i++){
        this.series.append(this.setState.actorsResults[i].mbti);
        this.options.labels.append(this.setState.actorsResults[i].percentage);
    }

  }

  componentDidMount() {
    const { actid } = this.props.match.params;
    this.setState({ actor_id: actid });
    actorpct(
        actid
        ).then((res) => {
          this.setState({ actorsResults: res.results });

        });
    console.log(this.state.actorsResults);

  }

  render() {
    return (
      <div>
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
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
          />
        </div>
        <Divider />
        <div id="chart">
            <Chart options={this.state.options} series={this.state.series} type="pie" width={380} />
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

export default withRouter(ActorPercentPage);
