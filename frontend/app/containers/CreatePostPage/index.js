/**
 * CreatePostPage
 *
 * This component let user create a new post
 * Related Function Requirements:
 *  FR3 - Create.Post
 *  FR4 - Image.AutoTagging
 *  FR5 - Delete.Post
 */

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
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CircularProgress from '@mui/material/CircularProgress';
import StyleIcon from '@mui/icons-material/Style';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';

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
      tags: [],
      images: [],
      video: null,
      isCreated: false,
      displayError: "",
      titleError: "",
      tagError: "",
      imgError: "",
      tagging: "inactive",
      snackBarStatus: "inactive"
    }

    this.snackBarMessages = {
      inactive: {
        severity: "info",
        message: "",
      },
      taggingSuccess: {
        severity: "success",
        message: <FormattedMessage {...messages.taggingSuccess} />,
      },
      taggingFailed: {
        severity: "error",
        message: <FormattedMessage {...messages.taggingFailed} />,
      },
      maximumUpload: {
        severity: "error",
        message: <FormattedMessage {...messages.maximumUpload} />,
      }
    }

    this.onUpload = this.onUpload.bind(this);
    this.onImageRemove = this.onImageRemove.bind(this);
    this.onCreateClick = this.onCreateClick.bind(this);
    this.onTagClick = this.onTagClick.bind(this);
  }

  onUpload = (event) => {
    const ext = event.target.files[0].name.split('.').pop();

    if (ext === "jpg" || ext === "jpeg" || ext === "png") {
      if (this.state.images.length < 6) {
        this.setState({
          images: [...this.state.images, ...event.target.files],
          imgError: ""
        });
      } else {
        this.setState({
          snackBarStatus: "maximumUpload"
        });
      }
    } else if (ext === "mp4") {
      if (this.state.video === null) {
        this.setState({
          video: event.target.files[0]
        });
      } else {
        this.setState({
          snackBarStatus: "maximumUpload"
        });
      }
    }
  }

  onImageRemove = (item) => {
    this.setState({
      images: this.state.images.filter(image => image !== item)
    });
  }

  onTagClick = () => {
    if (this.state.images.length != 0) {
      let formData = new FormData();
      for (let i = 0; i < this.state.images.length; i++) {
        formData.append('images', this.state.images[i]);
      }
  
      let backendUrl = `${BACKEND_URL}/tagging/`;
      
      this.setState({
        tagging: "active"
      });
      axios.post(backendUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            tags: [...this.state.tags, ...res.data.tags],
            tagging: "inactive",
            snackBarStatus: "taggingSuccess"
          });
        }
      })
      .catch(err => {
        this.setState({
          tagging: "inactive",
          snackBarStatus: "taggingFailed"
        });
      });
    }
  }
  
  
  onCreateClick = () => {
    let fieldCheck = true;
    if (this.state.displayName.length === 0 || !this.state.displayName.trim()) {
      this.setState({displayError: "You need to enter a name"});
      fieldCheck = false;
    }

    if (this.state.postTitle.length === 0 || !this.state.postTitle.trim()) {
      this.setState({titleError: "You need a title"});
      fieldCheck = false;
    }

    if (this.state.tags.join(',').length === 0 || !this.state.tags.join(',').trim()) {

      this.setState({tagError: "You need at least one tag"});
      fieldCheck = false;
    }
    
    if (this.state.images.length === 0) {
      this.setState({imgError: "You need at least one image to create a post"});
      fieldCheck = false;
    }

    if (fieldCheck != false) {
      let formData = new FormData();
      formData.append('display_name', this.state.displayName);
      formData.append('title', this.state.postTitle);
      formData.append('description', this.state.postDescription);
      formData.append('tags', this.state.tags.join(','));
      for (let i = 0; i < this.state.images.length; i++) {
        formData.append('images', this.state.images[i]);
      }
      if (this.state.video !== null) {
        formData.append('video', this.state.video);
      }

      let backendUrl = `${BACKEND_URL}/posts/`;
      
      let headers = {
        'Content-Type': 'multipart/form-data'
      };
      if (localStorage.getItem('token') != null) {
        headers['Authorization'] = `Token ${localStorage.getItem('token')}`;
      }
      axios.post(backendUrl, formData, {
        headers: headers
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
          
          <Snackbar
            open={this.state.snackBarStatus !== "inactive"}
            autoHideDuration={5000}
            onClose={() => this.setState({snackBarStatus: "inactive"})}
          >
            <Alert 
              onClose={() => this.setState({snackBarStatus: "inactive"})} 
              severity={this.snackBarMessages[this.state.snackBarStatus].severity}
              sx={{ width: '100%' }}
              variant="filled"
            >
              {this.snackBarMessages[this.state.snackBarStatus].message}
            </Alert>
          </Snackbar>

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
              required
              id="display-name"
              type="text"
              label="Display Name"
              variant="outlined"
              value={this.state.displayName}
              onChange={(event) => this.setState({displayName: event.target.value, displayError: ""})}
              error = {this.state.displayError.length > 0}
              helperText = {this.state.displayError}
            />
            
            <TextField
              required
              id="post-title"
              type="text"
              label="Post Title"
              variant="outlined"
              value={this.state.postTitle}
              onChange={(event) => this.setState({postTitle: event.target.value, titleError: ""})}
              error = {this.state.titleError.length > 0}
              helperText = {this.state.titleError}
            />

            <TextField
              multiline
              fullWidth
              id="post-description"
              type="text"
              label="Post Description (Optional)"
              variant="outlined"
              value={this.state.postDescription}
              onChange={(event) => this.setState({postDescription: event.target.value})}
            />
            
            <ImageList variant="masonry" cols={3} >
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
            
            {this.state.video != null && (
              <>
                <video
                  src={`${URL.createObjectURL(this.state.video)}`}
                  type="video/mp4" 
                  controls 
                />

                <Button
                  variant="contained"
                  component="label"
                  color="error"
                  onClick={() => this.setState({video: null})}
                >
                  <FormattedMessage {...messages.deleteVideo} />
                </Button>
              </>
            )}

            <Stack
              spacing={1}
              direction="row"
              sx={{
                width: '100%'
              }}
            >
              <Button
                variant="contained"
                component="label"
                sx={{
                  width: '50%'
                }}
                startIcon={<AddPhotoAlternateIcon />}
              >
                <FormattedMessage {...messages.upload} />
                <input
                  type="file"
                  accept="image/jpg, image/jpeg, image/png, video/mp4"
                  onChange={this.onUpload}
                  hidden
                />
              </Button>

              <Button
                variant="contained"
                component="label"
                disabled={this.state.images.length == 0 || this.state.tagging == "active"}
                onClick={this.onTagClick}
                sx={{
                  width: '50%'
                }}
                startIcon={<StyleIcon />}
              >
                {this.state.tagging === "active" ? <CircularProgress size={20} /> : <FormattedMessage {...messages.tagImages} />}
              </Button>
            </Stack>
            <Typography color="red">{this.state.imgError}</Typography>

            <Autocomplete
              multiple
              freeSolo
              options={[]}
              id="post-tags"
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                <Chip color="primary" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
              <TextField
                required
                {...params}
                variant="outlined"
                label="Tags"
                placeholder="Add some tags to your image, press ENTER to add"
                error = {this.state.tagError.length > 0}
                helperText={this.state.tagError}
              />
              )}
              value={this.state.tags}
              onChange={(event, value) => this.setState({tags: value, tagError: ""})}
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
              <Button startIcon={<CancelIcon />} variant='contained' color='error' href='/'>
                <FormattedMessage {...messages.cancel} />
              </Button>
              <Button startIcon={<SaveIcon />} variant='contained' color='success' onClick={this.onCreateClick}>
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
