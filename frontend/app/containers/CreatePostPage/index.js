import React from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

import H1 from 'components/H1';
import messages from './messages';

const Input = styled('input')({
	display: 'none',
});

class CreatePostPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    }

    this.onImageUpload = this.onImageUpload.bind(this);
    this.onImageRemove = this.onImageRemove.bind(this);
  }

  toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });

  onImageUpload = (event) => {
    console.log("here");
    this.setState({
      images: [...this.state.images, ...event.target.files]
    });
  }

  onImageRemove = (item) => {
    this.setState({
      images: this.state.images.filter(image => image !== item)
    });
  }
  
	render() {
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
          />
          
          <TextField
            id="post-title"
            type="text"
            label="Post Title"
            variant="outlined"
          />

          <TextField
            multiline
            id="post-description"
            type="text"
            label="Post Description"
            variant="outlined"
            rows={4}
          />
          
          <ImageList cols={4}>
            {this.state.images.map((item) => (
              <ImageListItem 
                key={item}
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
            Upload File
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
            <Button variant='contained' color='error'>
              <FormattedMessage {...messages.cancel} />
            </Button>
            <Button variant='contained' color='success'>
              <FormattedMessage {...messages.create} />
            </Button>
          </Stack>
        </Stack>
      </div>
    );
	}
}

export default CreatePostPage;
