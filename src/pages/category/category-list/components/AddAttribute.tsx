import { Modal, Transfer } from 'antd';
import React from 'react';
import { queryAttributes } from '../service';



class AddAttribute extends React.Component {
  state = {
    mockData: [],
    targetKeys: [],
  };

  
  
  componentDidMount() {
    this.getMock();
  }


  getMock = () => {
    const temp = async() => {
      let val = await queryAttributes()
      this.setState({ mockData: val });
    }
    const targetKeys = [];
    const mockData = temp;

    
    //queryAttributes()

    // for (let i = 0; i < 20; i++) {
    //   const data = {
    //     key: i.toString(),
    //     title: `content${i + 1}`,
    //     description: `description of content${i + 1}`,
    //     chosen: Math.random() * 2 > 1,
    //   };
    //   if (data.chosen) {
    //     targetKeys.push(data.key);
    //   }
    //   mockData.push(data);
    // }
    this.setState({ targetKeys });
  };

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  render() {
    return (
      
        <Transfer
          dataSource={this.state.mockData}
          showSearch
          filterOption={this.filterOption}
          targetKeys={this.state.targetKeys}
          onChange={this.handleChange}
          onSearch={this.handleSearch}
          render={item => item.title}
        />
    );
  }
}


export default AddAttribute;
