import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './ui/Nav';  // Import the Nav component

function App() {
  return (
    <div>
      <Nav />  {/* Display the Nav component */}

      {/* This is where the child components will be rendered */}
      <Outlet />
    </div>
  );
}

export default App;
