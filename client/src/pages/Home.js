import React from 'react';
// user query hook
import { useQuery } from '@apollo/client';
// thought query is imported here from utils folder
import { QUERY_THOUGHTS } from '../utils/queries';
// importing the thought component
import ThoughtList from '../components/ThoughtList';

const Home = () => {
  // use useQuery hook to make query request
  // 'loading' is apollo method to address the asyncronous function
  // every graphQl response comes in the form of a big 'data' object
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // this syntax is called optioal chaining
  // it negates the need to check if an object existsbefore accessing its properties  
  // trasnslates to if data exists access the date if not save an empty array
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  return (
    <main>
      <div className="flex-row justify-space-between">
        <div className="col-12 mb-3">
          {/* conditional with tirinary operator */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
