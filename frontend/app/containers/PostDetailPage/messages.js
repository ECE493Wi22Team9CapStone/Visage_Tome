import { defineMessages } from 'react-intl';

export const scope = 'VisageTome.containers.PostDetailPage';

export default defineMessages({
  detail: {
    id: `${scope}.detail`,
    defaultMessage: 'Post Details',
  },
  images: {
    id: `${scope}.images`,
    defaultMessage: 'Post Images',
  },
  tags: {
    id: `${scope}.tags`,
    defaultMessage: 'Image Tags',
  },
  delete: {
    id: `${scope}.delete`,
    defaultMessage: 'Delete This Post',
  },
  deleteDialogTitle: {
    id: `${scope}.deleteDialogTitle`,
    defaultMessage: 'Are you sure you want to delete this post?',
  },
  deleteDialogDescription: {
    id: `${scope}.deleteDialogDescription`,
    defaultMessage: 'This will remove all images, tags, likes, and comments associated with this post. This action cannot be undone.',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  confirm: {
    id: `${scope}.confirm`,
    defaultMessage: 'Confirm',
  },
  lifespan: {
    id: `${scope}.lifespan`,
    defaultMessage: 'Lifespan',
  }
});