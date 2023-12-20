import React, { useState } from 'react';
import Modal from 'react-modal';
import './Addlink.css'
const AddLinkModal = ({ isOpen, onClose, onSave }) => {
  const [link, setLink] = useState('');

  const handleSave = () => {
    onSave(link);
    setLink('');
    onClose();
  };

  return (

    <Modal isOpen={isOpen} onRequestClose={onClose} className='Container' >
      
      <div className='Model'>
      <h2 className='header'>Add Link</h2>
      <input
        type="text"
        placeholder="Enter link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <br></br>
      <div className='mark2' onClick={handleSave}><p>Save</p></div>
      <div className='count2' onClick={onClose}><p>Cancel</p></div>
      </div>
    </Modal>

  );
};

export default AddLinkModal;
