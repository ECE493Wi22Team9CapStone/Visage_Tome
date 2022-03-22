/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { useEffect, memo } from 'react';
import { Helmet } from 'react-helmet';
// import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
// import { connect } from 'react-redux';
// import { compose } from 'redux';
// import { createStructuredSelector } from 'reselect';

// import { useInjectReducer } from 'utils/injectReducer';
// import { useInjectSaga } from 'utils/injectSaga';
// import {
//   makeSelectRepos,
//   makeSelectLoading,
//   makeSelectError,
// } from 'containers/App/selectors';
// import H2 from 'components/H2';
// import ReposList from 'components/ReposList';
// import AtPrefix from './AtPrefix';
// import CenteredSection from './CenteredSection';
// import Form from './Form';
// import Input from './Input';
// import Section from './Section';
// import messages from './messages';
// import { loadRepos } from '../App/actions';
// import { changeUsername } from './actions';
// import { makeSelectUsername } from './selectors';
// import reducer from './reducer';
// import saga from './saga';
// const key = 'home';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import { Pagination, PaginationItem } from '@mui/material';

import LoadingIndicator from 'components/LoadingIndicator';
import axios from 'axios';

import { BACKEND_URL } from '../../utils/constants';
import { ImageListItemBar, Stack } from '@mui/material';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      totalPages: 1,
    }

    this.onPageChange = this.onPageChange.bind(this);
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
    let postList;
    if (this.state.posts.length > 0) {
      postList = (
        <ImageList variant="masonry" cols={3} gap={10}>
          {this.state.posts.map((item) => { 
            return item.images.map((image, index) => (
              <ImageListItem 
                key={item.id + "-" + index}
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


// export function HomePage({
//   username,
//   loading,
//   error,
//   repos,
//   onSubmitForm,
//   onChangeUsername,
// }) {
//   useInjectReducer({ key, reducer });
//   useInjectSaga({ key, saga });

//   useEffect(() => {
//     // When initial state username is not null, submit the form to load repos
//     if (username && username.trim().length > 0) onSubmitForm();
//   }, []);

//   const reposListProps = {
//     loading,
//     error,
//     repos,
//   };

//   return (
//     <article>
//       <Helmet>
//         <title>Home Page</title>
//         <meta
//           name="description"
//           content="A React.js Boilerplate application homepage"
//         />
//       </Helmet>
//       <div>
//         <CenteredSection>
//           <H2>
//             <FormattedMessage {...messages.startProjectHeader} />
//           </H2>
//           <p>
//             <FormattedMessage {...messages.startProjectMessage} />
//           </p>
//         </CenteredSection>
//         <Section>
//           <H2>
//             <FormattedMessage {...messages.trymeHeader} />
//           </H2>
//           <Form onSubmit={onSubmitForm}>
//             <label htmlFor="username">
//               <FormattedMessage {...messages.trymeMessage} />
//               <AtPrefix>
//                 <FormattedMessage {...messages.trymeAtPrefix} />
//               </AtPrefix>
//               <Input
//                 id="username"
//                 type="text"
//                 placeholder="mxstbr"
//                 value={username}
//                 onChange={onChangeUsername}
//               />
//             </label>
//           </Form>
//           <ReposList {...reposListProps} />
//         </Section>
//       </div>
//     </article>
//   );
// }

// HomePage.propTypes = {
//   loading: PropTypes.bool,
//   error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
//   repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
//   onSubmitForm: PropTypes.func,
//   username: PropTypes.string,
//   onChangeUsername: PropTypes.func,
// };

// const mapStateToProps = createStructuredSelector({
//   repos: makeSelectRepos(),
//   username: makeSelectUsername(),
//   loading: makeSelectLoading(),
//   error: makeSelectError(),
// });

// export function mapDispatchToProps(dispatch) {
//   return {
//     onChangeUsername: evt => dispatch(changeUsername(evt.target.value)),
//     onSubmitForm: evt => {
//       if (evt !== undefined && evt.preventDefault) evt.preventDefault();
//       dispatch(loadRepos());
//     },
//   };
// }

// const withConnect = connect(
//   mapStateToProps,
//   mapDispatchToProps,
// );

// export default compose(
//   withConnect,
//   memo,
// )(HomePage);

export default HomePage;
