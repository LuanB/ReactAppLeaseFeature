import React, {Component} from 'react';  
import './ContainerStyles.css'



// this compoenent holds the form to accept the lease id. I use Regex to check that it is an alphanumeric string. I use 
// the component state to set error and is loading component state. 
// if the input is valid then I send that data to the parent component. 


class FormContainer extends Component {  


  constructor(props) {
    super(props);
    
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    
    this.state = {
      IsLoading: false,
      Error: false
        }
    
    }
  


  handleFormSubmit(e) {
    e.preventDefault();
    const validRegEx = /^[0-9a-zA-Z]+$/;
    const leaseID = e.target.elements.LeaseIDInput.value.trim().match(validRegEx);
  
  if(leaseID) {  

    console.log('lease id in forms container is ',leaseID)
    this.props.sendData(leaseID);
    this.setState((prevState) => ({...prevState, Error: false }))
  }
  
  else {

  
  this.setState((prevState) => ({...prevState, Error: true }))
  this.props.sendError();
  console.log('error in input');
  }
  
  }
  

  
  render() {
  
    
    
    return (
      <div className='LeaseIDInputForm'>
      <form className="container" onSubmit={this.handleFormSubmit}>
      <label className='LeaseLabel' htmlFor="leaseID">LeaseID: </label>
      
      <div className='InputAndButton'>
      <input type="text" name="LeaseIDInput" id='leaseID' placeholder='Your Lease ID'/>
      
      <button style={{margin: 10}}>Fetch List of Rent Payment</button>
      </div>
      </form>
      
      <div><h1>{this.state.Error && <div>Input Error. Your LeaseID is not an alphanumeric string</div>}</h1></div>
      
      </div>
    );
  }
  
}

export default FormContainer;
