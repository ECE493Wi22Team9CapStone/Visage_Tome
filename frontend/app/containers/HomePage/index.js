/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import { Redirect } from 'react-router-dom';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Pagination from '@mui/material/Pagination';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Stack from '@mui/material/Stack';

import LoadingIndicator from 'components/LoadingIndicator';
import axios from 'axios';

import { BACKEND_URL } from '../../utils/constants';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      totalPages: 1,
      postId: null
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
    axios.get(`${BACKEND_URL}/posts/?page=${page}`)
    .then(res => {
      console.log(res.data);
      this.setState({
        posts: res.data.posts,
        totalPages: res.data.count
      })
    })
    .catch(err => {
      console.log("Failed to get posts: ", err);
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
    if (this.state.posts.length > 0) {
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
    } else {
      postList = <LoadingIndicator />
    }

    return (
      <div>
        <Helmet>
          <title>Home Page</title>
          <meta
            name="description"
            content="A React.js Boilerplate application homepage"
          />
        </Helmet>
        
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
          {postList}

        </Stack>
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
      </div>
    );
  }
}

export default HomePage;
