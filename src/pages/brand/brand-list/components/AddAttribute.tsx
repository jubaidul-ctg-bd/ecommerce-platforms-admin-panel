import { message, Transfer } from 'antd';
import React from 'react';
import { associateTerm, queryAttributes } from '../service';

class AddAttribute extends React.Component {
  state = {
    mockData: [],
    targetKeys: [],
  };

  componentDidMount() {
    this.getMock();
  }

  getMock = async() => {
    const targetKeys = [];
    const mockData = await queryAttributes();

    const data = this.props.values.terms;

    this.props.values.terms.forEach(element => {
      if(element.isDynamic) targetKeys.push(element.id);
    });
       
    this.setState({ mockData, targetKeys });
  };

  // filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleChange = async(targetKeys) => {

    let value = this.props.values;
    this.setState({ targetKeys });
    value.associateTerm = targetKeys;

    const hide = message.loading('Submitting');
    try {
      await associateTerm({ ...value });
      hide();
      message.success('Submitted Succesfully');
      return true;
    } catch (error) {
      hide();
      message.error('Submit Faild!');
      return false;
    }
  };

  handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  render() {
    return (
      <Transfer
        dataSource={this.state.mockData}
        showSearch
        rowKey={record => record.id}
        // filterOption={this.filterOption}
        targetKeys={this.state.targetKeys}
        onChange={this.handleChange}
        onSearch={this.handleSearch}
        render={item => item.title}
      />
    );
  }
}
export default AddAttribute;