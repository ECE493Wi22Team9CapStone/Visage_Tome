import React from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import H1 from 'components/H1';
import messages from './messages';
import { BACKEND_URL } from '../../utils/constants';
import { Redirect } from 'react-router-dom';

class CreatePostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "",
      postTitle: "",
      postDescription: "",
      tags: "",
      images: [],
      isCreated: false,
    }

    this.onImageUpload = this.onImageUpload.bind(this);
    this.onImageRemove = this.onImageRemove.bind(this);
    this.onCreateClick = this.onCreateClick.bind(this);
  }

  onImageUpload = (event) => {
    this.setState({
      images: [...this.state.images, ...event.target.files]
    });
  }

  onImageRemove = (item) => {
    this.setState({
      images: this.state.images.filter(image => image !== item)
    });
  }
  
  onCreateClick = () => {
    let formData = new FormData();
    formData.append('display_name', this.state.displayName);
    formData.append('title', this.state.postTitle);
    formData.append('description', this.state.postDescription);
    formData.append('tags', this.state.tags.join(','));
    for (let i = 0; i < this.state.images.length; i++) {
      formData.append('images', this.state.images[i]);
    }

    let backendUrl = `${BACKEND_URL}/posts/`;

    axios.post(backendUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(res => {
      if (res.status === 200) {
        this.setState({
          isCreated: true
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
  }

	render() {
    if (this.state.isCreated) {
      return <Redirect to={{
        pathname: '/',
        state: { from: '/create', status: 'success' }
      }} />  
    }
    else {
      return (
        <div>
          <Helmet>
            <title>Create Post Page</title>
          </Helmet>
          <H1>
            <FormattedMessage {...messages.header} />
          </H1>
          
          <Stack
            component="form"
            sx={{
            width: '100%'
            }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="display-name"
              type="text"
              label="Display Name"
              variant="outlined"
              value={this.state.displayName}
              onChange={(event) => this.setState({displayName: event.target.value})}
            />
            
            <TextField
              id="post-title"
              type="text"
              label="Post Title"
              variant="outlined"
              value={this.state.postTitle}
              onChange={(event) => this.setState({postTitle: event.target.value})}
            />

            <TextField
              multiline
              fullWidth
              id="post-description"
              type="text"
              label="Post Description"
              variant="outlined"
              value={this.state.postDescription}
              onChange={(event) => this.setState({postDescription: event.target.value})}
            />
            
            <ImageList variant="masonry" cols={3}>
              {this.state.images.map((item) => (
                <ImageListItem 
                  key={item.name}
                  onClick={() => this.onImageRemove(item)}
                >
                  <img
                    src={`${URL.createObjectURL(item)}`}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>

            <Button
              variant="contained"
              component="label"
            >
              <FormattedMessage {...messages.upload} />
              <input
                type="file"
                accept="image/*"
                onChange={this.onImageUpload}
                hidden
              />
            </Button>

            <Autocomplete
              multiple
              freeSolo
              options={[]}
              noOptionsText="Press Enter to add"
              id="post-tags"
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                <Chip color="primary" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Add some tags to your image"
              />
              )}
              onChange={(event, value) => this.setState({tags: value})}
            />

            <Stack 
              sx={{
                'position': 'relative',
                'alignItems': 'center',
                'justifyContent': 'center',
              }} 
              direction={"row"} 
              spacing={5}
            >
              <Button variant='contained' color='error' href='/'>
                <FormattedMessage {...messages.cancel} />
              </Button>
              <Button variant='contained' color='success' onClick={this.onCreateClick}>
                <FormattedMessage {...messages.create} />
              </Button>
            </Stack>
          </Stack>
        </div>
      );
    }
	}
}

export default CreatePostPage;
