/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import {Switch, Route, Redirect} from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import CreatePostPage from 'containers/CreatePostPage/Loadable';
import PostDetailPage from 'containers/PostDetailPage/Loadable';
import AdminPage from 'containers/AdminPage/Loadable'
import Header from 'components/Header';
import Footer from 'components/Footer';

import GlobalStyle from '../../global-styles';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - Visage Tome"
        defaultTitle="Visage Tome"
      >
        <meta name="description" content="Winter 2022 ECE 493 Capstone Project" />
      </Helmet>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/create" component={CreatePostPage} />
        <Route path="/post/:id" component={PostDetailPage} />
        <Route path="/admin">
          {localStorage.getItem('admin') === 'true' ? <AdminPage/> : <Redirect to="/"/>}
        </Route>
        <Route path="" component={NotFoundPage} />
      </Switch>
      <Footer />
      <GlobalStyle />
    </AppWrapper>
  );
}
