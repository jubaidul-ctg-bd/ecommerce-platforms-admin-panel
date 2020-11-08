
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { queryRule, removeRule } from './service';
import { TableListParams } from './data';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import  proSettings  from '../../../../config/defaultSettings';


function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}



 class PicturesWall extends React.Component {
  // image = request('http://localhost:3000/cats');
  // console.log(image);
  /**
   *
   */
  // getRuls= async()=>{
  //   return await queryRule();
  // }

   state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],

  };

  componentDidMount() {
    // fetch the project name, once it retrieves resolve the promsie and update the state. 
    this.getRules().then(result => this.setState({
      fileList: result
    }))
  }

  async getRules() {
    // replace with whatever your api logic is.
    const value=await queryRule();
    console.log('query rules:',value);
    
    return value;
  }
  
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    
    console.log('query rule', await queryRule());
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleRemove = async (file: TableListParams) => {
    
    console.log('query rule', file);
    try {
      await removeRule({name: file.name,});
      message.success('Deleted successfully, will refresh soon');
      return true;
    } catch (error) {
      message.error('Deletion failed, please try again');
      return false;
    }
    
  };

  handleChange = ({ fileList }) => this.getRules().then(result => this.setState({
    fileList: result
  }))

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <PageHeaderWrapper>
        <Upload
          action={proSettings.baseUrl+"/media/upload"}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          name="icon"
        >
          {uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default PicturesWall;
