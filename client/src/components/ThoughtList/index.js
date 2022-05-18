import React from 'react';
import { Link } from 'react-router-dom';
// will enable us to get the id param from the url
import { useParams } from 'react-router-dom'

//  will recieve twi params a tittle and thoughts array through destructuring
const ThoughtList = ({ thoughts, title }) => {
  // use params returns an object with an object key value pair that 
  // looks just like this but with an actual id value
  const { id: thoughtId } = useParams();
  console.log(thoughtId);

  // Checks for any thoughts
  if (!thoughts.length) {
    return <h3>No Thoughts Yet</h3>;
  }

  return (
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map(thought => (
          // keys help react keep track of changes and what needs to be rendered when something changes
          // must be unique
          <div key={thought._id} className="card mb-3">
            <p className="card-header">
              <Link
                // this attribute will change the path which will triger a component to render in the app.js Rout component
                to={`/profile/${thought.username}`}
                style={{ fontWeight: 700 }}
                className="text-light"
              >
                {thought.username}
              </Link>{' '}
              thought on {thought.createdAt}
            </p>
            <div className="card-body">
              <Link to={`/thought/${thought._id}`}>
                <p>{thought.thoughtText}</p>
                <p className="mb-0">
                  Reactions: {thought.reactionCount} || Click to{' '}
                  {thought.reactionCount ? 'see' : 'start'} the discussion!
                </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;
