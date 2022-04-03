/**
 * HomePage
 *
 * This component let user create a new post
 * Related Function Requirements:
 *  FR8 - View.Posts
 *  FR9 - Search.Post
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Pagination from '@mui/material/Pagination';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import LoadingIndicator from 'components/LoadingIndicator';
import axios from 'axios';

import { BACKEND_URL } from '../../utils/constants';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null,
      totalPages: 1,
      postId: null,
      searchText: "",
      status: this.props.location.state ? this.props.location.state.status : null,
    }

    this.onPageChange = this.onPageChange.bind(this);
    this.onImageClick = this.onImageClick.bind(this);
    this.requestPosts = this.requestPosts.bind(this);
  }

  onImageClick = (postId) => {
    this.setState({
      postId: postId,
    });
  }  
  
  requestPosts = (page) => {
    axios.get(`${BACKEND_URL}/posts/?page=${page}&search=${this.state.searchText}`)
    .then(res => {
      this.setState({
        posts: res.data.posts,
        totalPages: res.data.pages
      })
    })
    .catch(err => {
      console.log("Failed to get posts: ", err);
    });
  }

  handleSearch = (text) => {
    // setState is async, so use callback to make sure value is set before making request
    this.setState({
      searchText: text
    }, () => {
      this.requestPosts(1);
    });
  }

  componentDidMount() {
    this.requestPosts(1);
  }

  onPageChange(page) {
    this.requestPosts(page);
  }

  render() {
    if (this.state.postId !== null) {
      return <Redirect to = {{
        pathname: `/post/${this.state.postId}`
      }} />
    }

    let postList;
    if (this.state.posts != null && this.state.posts.length > 0) {
      postList = (
        <ImageList variant="masonry" cols={3} gap={10}>
          {this.state.posts.map((item) => { 
            return item.images.map((image, index) => (
              <ImageListItem 
                key={item.id + "-" + index}
                onClick={() => this.onImageClick(item.id)}
              >
                <img
                  src={`${BACKEND_URL + image}?w=248&fit=crop&auto=format`}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.title}
                  subtitle={<span>by: {item.display_name}</span>}
                  // position="below"
                />
              </ImageListItem>
            ));
          })}
        </ImageList>
      );
    } else if (this.state.posts === null) {
      postList = <center><LoadingIndicator /></center>
    } else {
      postList = <center> <FormattedMessage {...messages.noPostsFound} /> </center>
    }

    return (
      <div>
        <Helmet>
          <title>Home Page</title>
          <meta
            name="description"
            content="ECE 493 Capstone Project - Visage Tome"
          />
        </Helmet>
        
        <Snackbar
          open={this.state.status === "deletePostSuccess"}
          autoHideDuration={5000}
          onClose={() => this.setState({status: ""})}
          anchorOrigin={{ 
            vertical: "top", 
            horizontal: 'center',
          }}
        >
          <Alert 
            onClose={() => this.setState({status: ""})} 
            severity="success" 
            sx={{ width: '100%' }}
            variant="filled"
          >
            Post Successfully Deleted
          </Alert>
        </Snackbar>

        <Stack
          component="form"
          sx={{
            width: '100%',
            // border: '1px solid #ccc',
          }}
          spacing={2}
          noValidate
          autoComplete="off"
        >
          <Paper elavation={12}>
            <TextField
              fullWidth
              id="search-post"
              type="text"
              placeholder="Search by title, author, or tags"
              variant="outlined"
              value={this.state.searchText}
              onChange={(event) => this.handleSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                      <IconButton aria-label="search">
                        <SearchIcon  />
                      </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                      <IconButton onClick={() => this.handleSearch("")}>
                        <ClearIcon fontSize='small' />
                      </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Paper>

          {postList}

          <Pagination 
            count={this.state.totalPages} 
            sx={{
              'display': 'flex',
              'alignItems': 'center',
              'justifyContent': 'center',
            }} 
            color="primary"
            size="large"
            boundaryCount={2}
            onChange={(e, page) => {this.onPageChange(page)}}
            showFirstButton 
            showLastButton
          />
        </Stack>
        
      </div>
    );
  }
}

export default HomePage;
