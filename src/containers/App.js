import React, { Component } from 'react';
import './App.css';
import FormContainer from './FormContainer'
import RentPaymentList from '../components/RentPaymentList'
import DifferentAPI from '../api'

// App.js is my top level main component
// I'm setting the main application state in this component.



class App extends Component {

    constructor(props) {
      super(props);
      this.state = {
        isDeveloperMode: false,
        renderTable: false,
        data: [],
        isLoading: false,
        error: null,
        leaseID: null,
        start_date: '',
        payment_day: '',
        frequency: '',
        end_date: '',
        rent: null
        
      }
      
      this.getData = this.getData.bind(this);
      this.getError = this.getError.bind(this);
      
    }
    
    
    // Putting the api call in the componentDidMount lifecycle. Also not that I need to check if
    // there is a leaseID in state. If not then the user have not enterred anything yet or error has occured.
    
    componentDidMount() {
    
      console.log('component didmount');
      
      if (this.state.leaseID) {
      this.fetchData();
    }
    else {}
      }
    
    
    // The fetch API gets the lease data and sets the componenet state with the data.
    // Then the other compoenents will rerender with this new compoenents state.
    
    fetchData() {
      
      fetch(`${DifferentAPI}${this.state.leaseID}`)
        .then(response => response.json())
        .then(resData => this.setState((prevState) => (
          {...prevState, renderTable: true, data: resData, start_date: resData.start_date, 
            payment_day: resData.payment_day, frequency: resData.frequency, 
            end_date: resData.end_date, rent: resData.rent  }
        ) ))
        .catch(error => this.setState((prevState) => ({...prevState, error: true })));
        
      console.log('fetch called');
    }
    
    
    getData(val){
      console.log(this.state.toString());
        this.setState( (prevState) => ({...prevState, leaseID: val}));
            console.log(this.state);    
      this.fetchData();
      console.log(this.state);
    }
    
    getError() {
      // if error found in input string then dont render table and clear app state information, set leaseID to null
      //so table wont render on component mount.
        this.setState( (prevState) => ({...prevState, renderTable: false, leaseID: null, start_date: '', 
          payment_day: '', frequency: '', 
          end_date: '', rent: ''}))
        
    }
    
    
    // display state is for me to see what is happening in state and if the app is performing correctly.
    // Im also console logging alot of the current state in the app. 
    displayState() {
      console.log(this.state);
      return (
        <div>
      <div><h1>Data in state to checkup on app</h1></div>
      <div><h1>Lease ID in State is: {this.state.leaseID}</h1></div>   
      <div>render table  in State is: {this.state.renderTable.toString()}</div> 
      <div>payment day  in State is: {this.state.payment_day}</div> 
      <div>startdate  day  in State is: {this.state.start_date}</div>
      <div>end date  in State is: {this.state.end_date}</div> 
      <div>frequency  in State is: {this.state.frequency}</div>
      <div>rent  in State is: {this.state.rent}</div>
      <div>http request to: {DifferentAPI}{this.state.leaseID}</div>
      </div> 
    )
    }
    
    
    //this function displays the lease table and sends the state data into the RentPaymentList compoenent to render
    // the list
    
    leaseTable(isDisplay) {
      if (isDisplay) {
        return  <RentPaymentList start_date={this.state.start_date} 
          payment_day={this.state.payment_day} frequency={this.state.frequency} 
          end_date={this.state.end_date} rent={this.state.rent}></RentPaymentList>
      }
      else return <div><h1>Please enter your Lease ID</h1></div>
          
    }
  
  
  // I put in the container components to render and also conditiontally render depeneding on application state
  // the table and developer mode.
  
  
  render() {

  console.log(`http request to: ${DifferentAPI}${this.state.leaseID}`)
    return (
    <div className="App">
    
    <label><input type="checkbox" value="check" onChange={(e) => this.setState( (prevState) => ({...prevState, isDeveloperMode: !prevState.isDeveloperMode}))} /> Set Developer mode </label>
    <div className='Developer'>{this.state.isDeveloperMode && this.displayState()}</div>
    <FormContainer sendData={this.getData} sendError={this.getError}></FormContainer>
    
    <div className='LeaseTable'>{this.leaseTable(this.state.renderTable)}</div>
      
  
    </div>
    );
  }
  
  
}

export default App;
