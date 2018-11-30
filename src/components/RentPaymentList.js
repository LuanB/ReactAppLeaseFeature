import React from 'react';
import {getRentFrequencyDates, getDateSuffix} from '../utils/CalanderUtils'
import getMonth from '../utils/DateUtilts'
import './ComponentStyles.css'



 const RentPaymentList = (props) => {
  
  return (
    <div>
      <table className="DisplayTable">
        <tbody>
        <tr><th>From</th><th>To</th><th>Days</th><th>Amount</th></tr>
        
        {getRentFrequencyDates(props.start_date, props.payment_day, props.frequency, props.end_date, props.rent)
        .map((dynamicData, index) => (
          <tr key={index}> <td>{getMonth(dynamicData.From)}, <span>&nbsp;&nbsp;</span> 
          {getDateSuffix(dynamicData.From)} <span>&nbsp;&nbsp;</span> 
          {dynamicData.From.getFullYear()}</td> 
          <td>{getMonth(dynamicData.To)},<span>&nbsp;&nbsp;</span>{getDateSuffix(dynamicData.To)} <span>&nbsp;&nbsp;</span> 
          {dynamicData.To.getFullYear()}</td> <td style={{textAlign:'right'}}>{dynamicData.Days}</td>
          <td>{(dynamicData.Amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }</td> </tr>  ))} 
      </tbody>
      </table> 
      
      </div>
  )
}

export default RentPaymentList
