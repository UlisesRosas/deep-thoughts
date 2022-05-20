import React from 'react';
// user query hook
import { useQuery } from '@apollo/client';
// // thought query and query me is imported here from utils folder to have the ability to use the query
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
// importing the thought component
import ThoughtList from '../components/ThoughtList';
// importing the friends list component
import FriendList from '../components/FriendList';
// we also need to check for authentication on this page
import Auth from '../utils/auth';

const Home = () => {
  // use useQuery hook to make query request
  // 'loading' is apollo method to address the asyncronous function
  // every graphQl response comes in the form of a big 'data' object
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  // this syntax is called optioal chaining
  // it negates the need to check if an object existsbefore accessing its properties  
  // trasnslates to if data exists access the date if not save an empty array
  const thoughts = data?.thoughts || [];
  console.log(thoughts);

  // this will pass in the token to the loggedin method we imported
  const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className="flex-row justify-space-between">
        {/* conditionaly defines the styling of the div it eill mskr mre dpace in the right hand side if logged in for more content */}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {/* if loading a loading bar appears */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
        {/* conditionallu renders this portion if logged in and userDate are true if not it id null */}
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
