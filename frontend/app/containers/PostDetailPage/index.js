// react librairies
import React from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';

// react mui library
import Stack from '@mui/material/Stack';

// custom librairies and definitions
import messages from './messages';
import H1 from 'components/H1';
import LoadingIndicator from 'components/LoadingIndicator';
import { BACKEND_URL } from 'utils/constants';

class PostDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: null,
            postId: props.location.pathname.split('/')[2]
        }
    }


    componentDidMount() {
        axios.get(`${BACKEND_URL}/posts/${this.state.postId}`)
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        post: res.data
                    })
                } else {
                    console.log("Failed to get post: ", res);
                }
            })
            .catch(err => {
                console.log("Failed to get post: ", err);

            })
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
                
              </Stack>
            </div>
        );
    }
}

export default PostDetailPage;