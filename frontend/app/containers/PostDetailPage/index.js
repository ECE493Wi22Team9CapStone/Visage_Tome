// react librairies
import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

// react mui library
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import FaceIcon from '@mui/icons-material/Face';

// custom librairies and definitions
import messages from './messages';
import H1 from 'components/H1';
import H2 from 'components/H2';
import LoadingIndicator from 'components/LoadingIndicator';
import { BACKEND_URL } from 'utils/constants';

class PostDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      postId: props.location.pathname.split('/')[2],
      liked: false,
      comment: ""
    }
    
    this.onLikeButtonClick = this.onLikeButtonClick.bind(this);
    this.onCommentSend = this.onCommentSend.bind(this);
  }

  onImageClick = (image) => {
    window.open(`${BACKEND_URL + image}`, '_blank');
  }

  onLikeButtonClick = () => {
    if (this.state.liked) {
      return;
    }
    axios.post(`${BACKEND_URL}/posts/${this.state.postId}/like/`)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            post: res.data,
            liked: true
          });
        } else {
          console.log("Failed to like post: ", res);
        }
      })
      .catch(err => {
        console.log("Failed to like post: ", err);
      });
  }

  onCommentSend = () => {
    axios.post(`${BACKEND_URL}/posts/${this.state.postId}/comment/`, {
      content: this.state.comment
    })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            post: res.data,
            comment: ""
          });
        } else {
          console.log("Failed to comment post: ", res);
        }
      })
      .catch(err => {
        console.log("Failed to send comment: ", err);
      });
  }

  componentDidMount() {
    axios.get(`${BACKEND_URL}/posts/${this.state.postId}`)
      .then(res => {
        if (res.status === 200) {
          this.setState({
            post: res.data
          });
        } else {
          console.log("Failed to get post: ", res);
        }
      })
      .catch(err => {
        console.log("Failed to get post: ", err);
      });
  }

  render() {
    if (this.state.post === null) {
      return <LoadingIndicator />
    }

      return (
        <div>
          <Helmet>
            <title>Post Detail Page </title>
          </Helmet>
          
          <Stack
            component="form"
            sx={{
              width: '100%'
            }}
            spacing={2}
            noValidate
            autoComplete="off"
          >
            <H1>
              <FormattedMessage {...messages.images} />
            </H1>

            <ImageList variant="masonry" cols={3}>
              {this.state.post.images.map((item) => (
                  <ImageListItem 
                      key={item}
                      onClick={() => this.onImageClick(item)}
                  >
                  <img
                      src={`${BACKEND_URL + item}?w=248&fit=crop&auto=format`}
                      loading="lazy"
                  />
                  </ImageListItem>
              ))}
            </ImageList>
            
            <H2>
              <FormattedMessage {...messages.tags} />
            </H2>

            <Stack 
              direction={"row"} 
              spacing={2}
            >
              {this.state.post.tags.split(",").map((tag) => (
                <Chip key={tag} color="primary" label={tag} />
              ))}
            </Stack>
            <H1>
              <FormattedMessage {...messages.detail} />
            </H1>

            <TextField
              id="title"
              type="text"
              label="Title"
              variant="standard"
              InputProps={{
                  readOnly: true,
              }}
              value={this.state.post.title}
            />

            <TextField
              id="author"
              type="text"
              label="Author"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
              value={this.state.post.display_name}
            />  

            <TextField
              multiline
              fullWidth
              id="description"
              type="text"
              label="Description"
              variant="standard"
              InputProps={{
                readOnly: true,
              }}
              value={this.state.post.description}
            />  

            <Stack 
              direction={"row"} 
              spacing={2}
            >
              <TextField
                id="created_date"
                type="text"
                label="Created Date"
                variant="standard"
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  width: '50%'
                }}
                value={moment(this.state.post.date_posted).format('YYYY-MM-DD HH:mm:ss')}
              />

              <TextField
                id="Expiry Date"
                type="text"
                label="Expiry Date"
                variant="standard"
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  width: '50%'
                }}
                value={moment(this.state.post.date_expiry).format('YYYY-MM-DD HH:mm:ss')}
              />

            </Stack>
            
            <Stack 
              sx={{
                position: 'relative',
                alignItems: 'right',
                justifyContent: 'right',
              }} 
              direction={"row"} 
            >
              <TextField 
                id="num_likes" 
                variant="standard"
                sx={{
                  mt: '50px',
                  width: '10%'
                }} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ThumbUpIcon 
                        color= {this.state.liked ? "success" : "action"} 
                        fontSize="large"
                        onClick={() => { this.onLikeButtonClick() }}
                      />
                    </InputAdornment>
                  ),
                  disableUnderline: true
                }}
                value={this.state.post.likes}
              />

              <TextField 
                id="num_comments" 
                variant="standard"
                sx={{
                  mt: '50px',
                  width: '8%'
                }} 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CommentIcon
                        color="primary" 
                        fontSize="large"
                      />
                    </InputAdornment>
                  ),
                  disableUnderline: true
                }}
                value={this.state.post.comments.length}
              />
            </Stack>

            <TextField 
              id="add_comment" 
              variant="outlined"
              label="Add Comment"
              placeholder="Add your comment here"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                      <SendIcon
                        color="primary"
                        onClick={() => { this.onCommentSend() }}
                      />
                  </InputAdornment>
                )
              }}
              value={this.state.comment}
              onChange={(event) => this.setState({comment: event.target.value})}
            />

            {/* https://codesandbox.io/s/comment-box-with-material-ui-10p3c */}
            {this.state.post.comments.map((comment) => (
              <Paper style={{ padding: "30px 20px" }} elavation={6}>
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item >
                    <FaceIcon 
                      color="primary"
                      fontSize="large" 
                    />
                  </Grid>
                  <Grid justifyContent="left" item xs zeroMinWidth>
                    <h4 style={{ margin: 0, textAlign: "left" }}>{comment.username}</h4>
                    <p style={{ textAlign: "left" }}>
                      {comment.content}
                    </p>
                    <p style={{ textAlign: "left", color: "gray" }}>
                      {"posted " + moment(comment.date).fromNow()}
                    </p>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Stack>
        </div>
      );
  }
}

export default PostDetailPage;