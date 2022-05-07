
   
import React from 'react';
import { Table, Pagination, Select } from 'antd';

import MenuBar from '../components/MenuBar';
import { getcharacterMbtiList,getmbtiMatches,gettop5mvmbti } from '../fetcher';
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const characterColumns = [
  {
    title: 'Name',
    dataIndex: 'Name',
    key: 'Name',
    sorter: (a, b) => a.Name.localeCompare(b.Name),
    //render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>,
  },
  {
    title: 'movie_id',
    dataIndex: 'movie_id',
    key: 'movie_id',
    sorter: (a, b) => a.movie_id.localeCompare(b.movie_id),
  },
  {
    title: 'mbti',
    dataIndex: 'mbti',
    key: 'mbti',
  },
  // TASK 7: add a column for Potential, with the ability to (numerically) sort ,
  {
    title: 'img_url',
    dataIndex: 'img_url',
    key: 'img_url',
  }
];

const top5Columns = [
  
  {
    title: 'movie_id',
    dataIndex: 'movie_id',
    key: 'movie_id',
    sorter: (a, b) => a.movie_id.localeCompare(b.movie_id),
  },

  {
    title: 'movie_title',
    dataIndex: 'movie_title',
    key: 'movie_title',
    sorter: (a, b) => a.movie_title.localeCompare(b.movie_id),
  },

  {
    title: 'mbti',
    dataIndex: 'mbti',
    key: 'mbti',
    sorter: (a, b) => a.mbti.localeCompare(b.mbti),
  }
];

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allcharacters: [],
      PageNumber: 1,
      PageSize: 10,
      matchesResults:[],
      top5:[],
    };
    this.MbtiOnChange=this.MbtiOnChange.bind(this)
    this.goToMatch = this.goToMatch.bind(this)

  }
  goToMatch(matchId) {
    window.location = `/mbti_matches/${matchId}`
  }

  MbtiOnChange(value) {
    // TASK 2: this value should be used as a parameter to call getAllMatches in fetcher.js with the parameters page and pageSize set to null
    // then, matchesResults in state should be set to the results returned - see a similar function call in componentDidMount()
    getmbtiMatches(null,null,value).then(res => {
      this.setState({ matchesResults: res.results })
    })
  }

  componentDidMount() {
    // TASK 2: this value should be used as a parameter to call getAllMatches in fetcher.js with the parameters page and pageSize set to null
    // then, matchesResults in state should be set to the results returned - see a similar function call in componentDidMount()
    getcharacterMbtiList(null).then(res => {
      this.setState({ allcharacters: res.results })
    })

    getmbtiMatches(null, null, 'ESFP').then(res => {
      this.setState({ matchesResults: res.results })
    })

    gettop5mvmbti(null).then(res => {
      this.setState({ top5: res.results })
    })
  }

  render() {
    return (
      <div>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>All characters in our database</h3>
          <Table
            dataSource={this.state.allcharacters}
            columns={characterColumns}
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
          />
        </div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <h3>Search characters for a given MBTI type</h3>
          <Select defaultValue="ESFP" style={{ width: 120 }} onChange={this.MbtiOnChange}>
            <Option value="ISTJ">The Inspector ISTJ</Option>        
            <Option value="ISTP">The Crafter ISTP</Option>
            <Option value="ISFJ">The Protector ISFJ</Option>
            <Option value="ISFP">The Artist ISFP</Option>
            <Option value="INFJ">The Advocate INFJ</Option>
            <Option value="INFP">The Mediator INFP</Option>        
            <Option value="INTJ">The Architect INTJ</Option>
            <Option value="INTP">The Thinker INTP</Option>
            <Option value="ESTP">The Persuader ESTP</Option>
            <Option value="ESTJ">The Director ESTJ</Option>
            <Option value="ESFP">The Performer ESFP</Option>
            <Option value="ESFJ">The Caregiver ESFJ</Option>        
            <Option value="ENFP">The Champion ENFP</Option>
            <Option value="ENFJ">The Giver ENFJ</Option>
            <Option value="ENTP">The Debater ENTP</Option>
            <Option value="ENTJ">The Commander ENTJ</Option>
          </Select>
          
          <Table onRow={(record, rowIndex) => {
    return {
      onClick: event => {this.goToMatch(record.MatchId)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
    };
  }} dataSource={this.state.matchesResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
          <Column title="Name" dataIndex="Name" key="Name"/>
          <Column title="movie_id" dataIndex="movie_id" key="movie_id"/> 
          </Table>
        </div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Top5movie with most characters for a given MBTI type</h3>
          <Table
            dataSource={this.state.top5}
            columns={top5Columns}
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

export default HomePage;
