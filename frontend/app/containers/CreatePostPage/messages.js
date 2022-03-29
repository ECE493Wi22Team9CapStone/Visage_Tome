import { defineMessages } from 'react-intl';

export const scope = 'VisageTome.containers.CreatePostPage';

export default defineMessages({
    header: {
      id: `${scope}.header`,
      defaultMessage: 'Create a New Post',
    },
    cancel: {
      id: `${scope}.cancel`,
      defaultMessage: 'Cancel',
    },
    create: {
      id: `${scope}.create`,
      defaultMessage: 'Create',
    },
    upload: {
      id: `${scope}.upload`,
      defaultMessage: 'Upload Image(s)',
    },
    tagImages: {
      id: `${scope}.tagImages`,
      defaultMessage: 'Tag Images',
    },
    taggingSuccess: {
      id: `${scope}.taggingSuccess`,
      defaultMessage: 'Successfully tagged images',
    },
    taggingFailed: {
      id: `${scope}.taggingFailed`,
      defaultMessage: 'Failed to tag images, please try again'
    }
});