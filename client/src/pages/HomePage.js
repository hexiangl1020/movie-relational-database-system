import React from 'react';
import { Table, Pagination, Select } from 'antd';

import MenuBar from '../components/MenuBar';
import { getcharacterMbtiList,getmbtiMatches,gettop5mvmbti } from '../fetcher';
const { Column, ColumnGroup } = Table;
const { Option } = Select;

const characterColumns = [
  {
    title: '',
    dataIndex: 'img_url',
    key: 'img_url',
    render:  img_url => <img style={{ width: '10vw', height: '10vw'}} src={img_url} />
  },
  {
    title: 'Name',
    dataIndex: 'Name',
    key: 'Name',
    // sorter: (a, b) => a.Name.localeCompare(b.Name),
    //render: (text, row) => <a href={`/players?id=${row.PlayerId}`}>{text}</a>,
  },
  {
    title: 'Movie Name',
    dataIndex: 'primaryTitle',
    key: 'primaryTitle',
    // sorter: (a, b) => a.movie_id.localeCompare(b.movie_id),
  },
  {
    title: 'mbti',
    dataIndex: 'mbti',
    key: 'mbti',
  },
];

const top5Columns = [
  {
    title: 'movie_title',
    dataIndex: 'movie_title',
    key: 'movie_title',
  },

  {
    title: 'mbti',
    dataIndex: 'mbti',
    key: 'mbti',
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
    this.top5MbtiOnChange=this.top5MbtiOnChange.bind(this)
    this.goToMatch = this.goToMatch.bind(this)
    this.goToMovie = this.goToMovie.bind(this)

  }
  goToMatch(mvid, name) {
    window.location = `/characterInfo/${mvid}/${name}`
  }

  goToMovie(mvid) {
    window.location = `/movie/${mvid}`
  }

  MbtiOnChange(value) {
    getcharacterMbtiList(value).then(res => {
      this.setState({ allcharacters: res.results })
    })
  }

  top5MbtiOnChange(value) {
    gettop5mvmbti(value).then(res => {
      console.log(res)
      this.setState({ top5: res.results })
    })
  }

  componentDidMount() {
    // TASK 2: this value should be used as a parameter to call getAllMatches in fetcher.js with the parameters page and pageSize set to null
    // then, matchesResults in state should be set to the results returned - see a similar function call in componentDidMount()
    getcharacterMbtiList('').then(res => {
      this.setState({ allcharacters: res.results })
    })
    // getmbtiMatches(null, null, 'ESFP').then(res => {
    //   this.setState({ matchesResults: res.results })
    // })
    gettop5mvmbti('ISTJ').then(res => {
      this.setState({ top5: res.results })
    })
  }

  render() {
    return (
      <div>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>All characters in our database</h3>
          <Select defaultValue="" style={{ width: 200 }} onChange={this.MbtiOnChange}>
            <Option value="">All types</Option>        
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
          <Table
            dataSource={this.state.allcharacters}
            columns={characterColumns}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {this.goToMatch(record.movie_id, record.Name)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
              };
            }}
            pagination={{
              pageSizeOptions: [5, 10],
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
          />
        </div>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h3>Top5 Movies With Most MBTI Characters</h3>
          <Select defaultValue="ISTJ" style={{ width: 200 }} onChange={this.top5MbtiOnChange}>
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
          
          <Table
            dataSource={this.state.top5}
            columns={top5Columns}
            onRow={(record, rowIndex) => {
              return {
                onClick: event => {this.goToMovie(record.movie_id)}, // clicking a row takes the user to a detailed view of the match in the /matches page using the MatchId parameter  
              };
            }}
          />
        </div>

      </div>
    );
  }
}

export default HomePage;
