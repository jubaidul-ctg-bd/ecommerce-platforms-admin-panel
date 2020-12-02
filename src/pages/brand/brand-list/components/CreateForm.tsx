import React from 'react';
import { AutoComplete, Modal } from 'antd';
import autoHeight from '@/pages/dashboard/analysis/components/Charts/autoHeight';

interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="Add Attribute"
      visible={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
      width={1000}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
