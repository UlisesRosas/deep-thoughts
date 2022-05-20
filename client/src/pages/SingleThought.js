import React from 'react';
// importing the query hook
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom'
import { QUERY_THOUGHT } from '../utils/queries';
import Auth from '../utils/auth';
import ReactionForm from '../components/ReactionForm';
import ReactionList from '../components/ReactionList';

const SingleThought = props => {
  // gets the id form the browser params
  const { id: thoughtId } = useParams();
// loading and data is destructured from the use query hook
// allows us to use the query and pass the object in to the data var
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId }
  });
// if there is data then thought data gets loaded if not then an empt object does to prevent error
  const thought = data?.thought || {};

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
<div>
  <div className="card mb-3">
    <p className="card-header">
      <span style={{ fontWeight: 700 }} className="text-light">
        {thought.username}
      </span>{' '}
      thought on {thought.createdAt}
    </p>
    <div className="card-body">
      <p>{thought.thoughtText}</p>
    </div>
  </div>

  {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
  {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
</div>
  );
};

export default SingleThought;
