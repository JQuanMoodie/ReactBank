/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {HashRouter as Router, Route} from 'react-router-dom';
import axios from 'axios';  // Library used to send asynchronous HTTP requests to RESTful endpoints (APIs)

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0.00,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'John Doe',
        memberSince: '11/22/99',
      },
    };
    this.creditComponentDidMount();
    this.debitComponentDidMount();
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  // Add Debit Method
  addDebit = (e) => {
    e.preventDefault();
    const description = e.target.description.value;
    let temp = parseFloat(e.target.amount.value);
    const amount = parseFloat(temp.toFixed(2));
    if (description && amount) {
      const newDebit = {
        id: Date.now(),
        description,
        amount,
        date: new Date().toISOString()
      };
      
      this.setState((prevState) => ({
        debitList: [...prevState.debitList, newDebit],
        accountBalance: parseFloat((prevState.accountBalance - amount).toFixed(2)) // Update balance
      }));
    }

    // Reset form
    e.target.reset();
  };

  // Add Credit Method
  addCredit = (e) => {
    e.preventDefault();
    const description = e.target.description.value;
    let temp = parseFloat(e.target.amount.value);
    const amount = parseFloat(temp.toFixed(2));

    if (description && amount) {
      const newCredit = {
        id: Date.now(),  // Use current timestamp as a unique ID
        description,
        amount,
        date: new Date().toISOString()
      };
      this.setState((prevState) => ({
        creditList: [...prevState.creditList, newCredit],
        accountBalance: parseFloat((prevState.accountBalance + amount).toFixed(2)) // Update balance
      }));

    }

    // Reset form
    e.target.reset();
  };

  // Make async API call to retrieve data from remote website
  async creditComponentDidMount() {
    let linkToAPI = 'https://johnnylaicode.github.io/api/credits.json';  // Link to remote website API endpoint for credits

    // Await for promise (completion) returned from API call
    try {  // Accept success response as array of JSON objects (users)
      let response = await axios.get(linkToAPI);
      console.log(response);  // Print out response
      // To get data object in the response, need to use "response.data"
      this.setState({creditList: response.data});  // Store received data in state's "creditList" object
    } 
    catch (error) {  // Print out errors at console when there is an error response
      if (error.response) {
        // The request was made, and the server responded with error message and status code.
        console.log(error.response.data);  // Print out error message (e.g., Not Found)
        console.log(error.response.status);  // Print out error status code (e.g., 404)
      }    
    }
  }
  async debitComponentDidMount() {
    let linkToAPI = 'https://johnnylaicode.github.io/api/debits.json';  // Link to remote website API endpoint for debit

    // Await for promise (completion) returned from API call
    try {  // Accept success response as array of JSON objects (users)
      let response = await axios.get(linkToAPI);
      console.log(response);  // Print out response
      // To get data object in the response, need to use "response.data"
      this.setState({debitList: response.data});  // Store received data in state's "creditList" object
    } 
    catch (error) {  // Print out errors at console when there is an error response
      if (error.response) {
        // The request was made, and the server responded with error message and status code.
        console.log(error.response.data);  // Print out error message (e.g., Not Found)
        console.log(error.response.status);  // Print out error status code (e.g., 404)
      }    
    }
    this.updateAccountBalance();
  }

  // Update Account Balance
  updateAccountBalance(){
    let temp = 0.0;
    for (let i = 0; i < this.state.creditList.length; i++)
    {
      temp += this.state.creditList[i].amount;
    }
    for (let i = 0; i < this.state.debitList.length; i++)
    {
      temp -= this.state.debitList[i].amount;
    }
    let roundedNum = parseFloat(temp.toFixed(2));
    this.setState({accountBalance: roundedNum});
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} accountBalance={this.state.accountBalance} addCredit={this.addCredit}/>) 
    const DebitsComponent = () => (<Debits debits={this.state.debitList} accountBalance={this.state.accountBalance} addDebit={this.addDebit}/>) 
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/ReactBankWebsite">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;