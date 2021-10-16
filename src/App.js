import Welcome from './pages/Welcome';
import Product from './pages/Product';
import Features from './pages/Features';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// admin section
import AdminPage from './pages/AdminPage';

// tracking section
import TracksPage from './pages/TracksPage';
import TrackingOrder from './pages/TrackingOrder';

// history section
import HistoryPage from './pages/HistoryPage';

import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <Router>
          <Switch>
            <Route path="/" exact component = {Welcome}/>
            <Route path="/Product" exact component = {Product}/>
            <Route path="/Features" exact component = {Features}/>
            <Route path="/AboutUs" exact component = {AboutUs}/>
            <Route path="/Login" exact component = {Login}/>
            <Route path="/SignUp" exact component = {SignUp}/>
            <Route path="/Dashboard" exact component = {AdminPage}/>
            <Route path="/Tracking" exact component = {TracksPage}/>
            <Route path="/TrackingOrder" exact component = {TrackingOrder}/>
            <Route path="/History" exact component = {HistoryPage}/>
          </Switch>
      </Router>
    </>
  );
}

export default App;
