/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'VisageTome.containers.HomePage';

export default defineMessages({
  noPostsFound: {
    id: `${scope}.noPostsFound`,
    defaultMessage: 'No posts found',
  }
});
