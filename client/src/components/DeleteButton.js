import { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Button, Icon, Confirm } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../util/graphql';

function DeleteButton({ postId, callback }) {
  const [confirmOpen, setComfirmOpen] = useState(false);
  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy) {
      setComfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      let newPosts = [...data.getPosts];
      newPosts = newPosts.filter(p => p.id !== postId);
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          ...data,
          getPosts: newPosts,
        },
      });
      if (callback) callback();
    },
    variables: {
      postId,
    },
  });
  return (
    <>
      <Button
        as="div"
        floated="right"
        color="red"
        onClick={() => setComfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confirmOpen}
        onCancel={() => setComfirmOpen(false)}
        onConfirm={deletePost}
      />
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

export default DeleteButton;
