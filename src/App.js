import Welcome from './pages/Welcome';
import Product from './pages/Product';
import Features from './pages/Features';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// admin section
import AdminPage from './pages/AdminPage';

// menu section
import MenuPage from './pages/MenuPage';

// qr section
import QrPage from './pages/Qrpage';

// tracking section
import TracksPage from './pages/TracksPage';
import TrackingOrder from './pages/TrackingOrder';

// history section
import HistoryPage from './pages/HistoryPage';

// transaction section
import TransactionPage from './pages/TransactionPage';

// profile section
import Profile from './pages/Profile';

// coin section
import EatsyCoin from './pages/EatsyCoin'

// client/customer section
import Customer from './Client/Customer';
import Tracking from './Client/Tracking';

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
            <Route path="/MenuPage" exact component = {MenuPage}/>
            <Route path="/QrPage" exact component = {QrPage}/>
            <Route path="/Tracking" exact component = {TracksPage}/>
            <Route path="/TrackingOrder" exact component = {TrackingOrder}/>
            <Route path="/History" exact component = {HistoryPage}/>
            <Route path="/Transaction" exact component = {TransactionPage}/>
            <Route path="/Profile" exact component = {Profile}/>
            <Route path="/EatsyCoin" exact component = {EatsyCoin}/>
            <Route path="/Client/Customer" exact component = {Customer}/>
            <Route path="/Client/Tracking" exact component = {Tracking}/>
          </Switch>
      </Router>
    </>
  );
}

export default App;
