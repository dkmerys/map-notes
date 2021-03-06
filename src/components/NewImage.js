import React, { useState, useEffect } from 'react';
import { storage, firebase } from '../firebase'
import PropTypes from 'prop-types';
import { useFirestore } from 'react-redux-firebase';
import { Container, Input } from 'semantic-ui-react';


function NewImage(props){
  const {setForm, visibleForm} = props;
  // const [image, setImage] = useState([]);
  const [fileUrl, setFileUrl] = useState(null);
  const firestore = useFirestore();

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    const storageRef = storage.ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
  };

  const whenSubmitClicked = async (event) => {
    event.preventDefault();
    console.log(fileUrl)
    setForm(!visibleForm);
    const imageName = event.target.imageName.value;
    if (!fileUrl) {
      return;
    }
    await firestore.collection('images').add({
      imageName: imageName,
      imageURL: fileUrl,
      annotations: []
    });
  };

  return(
    <React.Fragment>
      <div class='ui center aligned container'>
        <form onSubmit={whenSubmitClicked}>
          <div class='ui focus input'>
            <input
              type='text'
              name='imageName'
              placeholder='Image Name' />
          </div>
          <input 
            type='file'
            name='imageURL'
            onChange={onFileChange} />
          <button class='ui button' type='submit'>Add Image</button>
        </form>
      </div>
    </React.Fragment>
  );
}

export default NewImage;

