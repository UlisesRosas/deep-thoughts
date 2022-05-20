import React from 'react';
// this will enable the use of link which changes the URL while still staying on
// the same page and letting React make the changes
import { Link } from 'react-router-dom';
// import allows for identification
import Auth from '../../utils/auth';

const Header = () => {
// will cary out the logout functionlity
const logout = event => {
  // this prevents the <a> tag from carrying out its default actions and allows logOut function to handle it
  // it will remove token from localstorage and refresh the app
  event.preventDefault();
  Auth.logout();
};


  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        {/* link appears as an <a> in the inspector tool */}
        {/* the link changes the path */}
        <Link to="/">
          <h1>Deep Thoughts</h1>
        </Link>

        <nav className="text-center">
          {/* this condirionally renders the navigation and after the ':' is our alternative  */}
          {Auth.loggedIn() ? (
            <>
              <Link to="/profile">Me</Link>
              <a href="/" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
