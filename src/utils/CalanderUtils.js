import getMonth, {ordinal_suffix_of} from './DateUtilts'



export function getStartPeroidAdjustment(startDate, paymentDay) {
  let startPeroid = {};
  
  const startDay = new Date(startDate);
  const paymentDayIndex = dayIndex(paymentDay);

  const dateInterval = nextDay(startDay, paymentDayIndex);
  const dateBeforePaymentDay = getDayBeforePaymentDayIndex(startDay, paymentDayIndex);
  //const startPeroidLastDate =  dateInterval.getMonth();

  //const formatedStartDay = `${getMonth(startDay)}, ${ordinal_suffix_of(startDay.getDate())} ${startDay.getFullYear()}`;

  startPeroid[0] = {From: startDay, To:dateBeforePaymentDay, Days: Math.floor((Date.UTC(dateInterval.getFullYear(), dateInterval.getMonth(), dateInterval.getDate()) - Date.UTC(startDay.getFullYear(), startDay.getMonth(), startDay.getDate()) ) /(1000 * 60 * 60 * 24))};
  
  return startPeroid[0];

  
}




export function getRentFrequencyDates(startDate, paymentDay, paymentFrequency, rentEndDate, rentAmtPerWeek) {
   let dates = [];
  
  
  if (paymentFrequency === 'monthly') {
    
    // assuming that 'montly' means Per Calendar Montly then we would take the start date and calculate to end of the current month.
    // then calcuate the "from" as the start of the new calendar month and To: as the end of the new calander month.
    // we keep calculating until the lease end date is reached.
    // during the calculations of the date we also calculate the number of days in that period.
    // We get the rent amount of the calander month by weekly amount / 7 then multi by number of days.
    
    
dates = getRentFrequencyDatesPCM(startDate, rentEndDate, rentAmtPerWeek);
   
}
else {
  
  dates = getRentFrequencyDatesWeeklyForthnighly(startDate, paymentDay, paymentFrequency, rentEndDate, rentAmtPerWeek);
}
  return dates;

}


// for the case it is weekly or fortnightly then this function will be used.
function getRentFrequencyDatesWeeklyForthnighly(startDate, paymentDay, paymentFrequency, rentEndDate, rentAmtPerWeek) {
   
   
     
     // work out number of days in the rent requency by input 'weekly, fortnightly or monthly. if monthly
     // then we need to calculate using per calendar month: getRentFrequencyDatesPCM
     const frequencyObj = {weekly: 7, fortnightly: 14, monthly: true};
     const frequencyDays = frequencyObj[paymentFrequency];



     
     // work out the dates for start of the rent to the main rent interval

     
     const startDay = new Date(startDate);
     const paymentDayIndex = dayIndex(paymentDay);




     //const dateInterval = nextDay(startDay, paymentDayIndex);
     const dateBeforePaymentDay = getDayBeforePaymentDayIndex(startDay, paymentDayIndex);
     
     let dates = [];
     let currentDate = nextDay(startDay,paymentDayIndex);
     let endDate = new Date(rentEndDate);

     
     let noOfDays = getNoOfDaysInclusive(startDay, dateBeforePaymentDay);
     
     // use function to workout the rent due over that time:
     let rentDue = calculateRentAmount(noOfDays, rentAmtPerWeek)
     
     // push data object into the array to display
     dates.push({From: startDay, To: dateBeforePaymentDay, Days: noOfDays, Amount: rentDue});

// work out the main rent interval and push to dates array. 
// the addDays function is used to add days to the currentDate pointer to then check if that currentDate pointer
// reaches the end date for the lease.

         let addDays = function(days) {
         let date = new Date(this.valueOf());
         date.setDate(date.getDate() + days);
         return date;
       };
       
       
  // In this while statement I'm checking to see if the currentDate point has reached the end of lease. If not then continue pushing
  // the date of the new rent frequency period to the array.     
     while (currentDate <= endDate) {
       let toDate = new Date(currentDate);
     toDate.setDate(currentDate.getDate() + (frequencyDays - 1));
     if (toDate < endDate)
         {
     noOfDays = getNoOfDaysInclusive(currentDate, toDate);
       let rentDueMainPeriod = calculateRentAmount(noOfDays, rentAmtPerWeek)
     
     dates.push({From: currentDate, To: toDate, Days: noOfDays, Amount: rentDueMainPeriod});
     currentDate = addDays.call(currentDate, frequencyDays);
   }
   else 
   {
     toDate = new Date(rentEndDate)
     
     noOfDays = getNoOfDaysInclusive(currentDate, toDate);
       let rentDueEndPeriod = calculateRentAmount(noOfDays, rentAmtPerWeek)
     dates.push({From: currentDate, To: toDate, Days: noOfDays, Amount: rentDueEndPeriod});
     currentDate = addDays.call(currentDate, frequencyDays);
   }


     }


     return dates;
     
   
 }


// this function is for the case that the lease is on a canander montlhy period. It sets a pointer at start date of lease
// then finds the last day of the current month using {getMonth() + 1, 0} with next month index 0. which is the last day of the
// current month.

function getRentFrequencyDatesPCM(startDate, rentEndDate, rentAmtPerWeek) {


  // work out the dates for start of the rent to the main rent interval


  const startDay = new Date(startDate);


  //const dateInterval = nextDay(startDay, paymentDayIndex);
  const dateOfLastDayOfCurrentMonth = new Date(startDay.getFullYear(), startDay.getMonth() + 1, 0);
  console.log(dateOfLastDayOfCurrentMonth);

  let dates = [];
  //let currentDate = nextDay(startDay,paymentDayIndex);
  let endDate = new Date(rentEndDate);


  let noOfDays = getNoOfDaysInclusive(startDay, dateOfLastDayOfCurrentMonth);

  // use function to workout the rent due over that time:
  let rentDue = calculateRentAmount(noOfDays, rentAmtPerWeek)

  // push data object into the array to display
  dates.push({From: startDay, To: dateOfLastDayOfCurrentMonth, Days: noOfDays, Amount: rentDue});



let firstDayOfNextMonth = new Date(startDay.getFullYear(), startDay.getMonth() + 1, 1);


// In this while loop I'm checking to see if the next internval ( first day of Next Month) pointer has reached the end of the lease. 
// In this loop I then set the todate to next month and see if that has reach the end of lease.
// If it has not then I will push the dates (first day of next month and also last day of the next month) into the array
// When we reach the end



  while (firstDayOfNextMonth <= endDate) {
    let toDate = new Date(firstDayOfNextMonth.getFullYear(), firstDayOfNextMonth.getMonth() + 1, 0);

  if (toDate < endDate)
      {
  noOfDays = getNoOfDaysInclusive(firstDayOfNextMonth, toDate);
    let rentDueMainPeriod = calculateRentAmount(noOfDays, rentAmtPerWeek)
let pushdate = new Date(firstDayOfNextMonth);
  dates.push({From: pushdate, To: toDate, Days: noOfDays, Amount: rentDueMainPeriod});

    
  firstDayOfNextMonth.setMonth(firstDayOfNextMonth.getMonth() + 1);

}
else 
{

  toDate = new Date(rentEndDate)

  noOfDays = getNoOfDaysInclusive(firstDayOfNextMonth, toDate);
    let rentDueEndPeriod = calculateRentAmount(noOfDays, rentAmtPerWeek)
    let finalFrequencyStartDate = new Date(firstDayOfNextMonth);
    
  dates.push({From: finalFrequencyStartDate, To: toDate, Days: noOfDays, Amount: rentDueEndPeriod});
  

  
firstDayOfNextMonth.setMonth(firstDayOfNextMonth.getMonth() + 1);


}


  }


  return dates;

}


// these are some of the helper functions that I used while working on serveral solutions for the problem.

export function formatDate(dateToFormat){


  return (getMonth(dateToFormat) + `,  `+ ordinal_suffix_of(dateToFormat.getDate()) +',  '+ dateToFormat.getFullYear());

}

// this imports the suffix to get '30th', '3rd' .. ect. Solution Code was found on stackoverflow.

export function getDateSuffix(date) {
  return ordinal_suffix_of(date.getDate())
}

export function dayName(dateString) {

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
let d = new Date(dateString);

let dayName = days[d.getDay()];

return dayName
}

function calculateRentAmount(numberOfDays, rentAmountPerWeek){
  return numberOfDays * (rentAmountPerWeek / 7)
}

export function findNextMonday(date1) {
var d = new Date(date1);
d.setDate(d.getDate() + (1 + 7 - d.getDate()) % 7);
return d;
}

export function dayIndex(day) {
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
return days.indexOf(day);
}

// export function startWeekInterval(dayStart, paymentday) {
// return this.dayIndex(paymentday) - this.dayIndex(dayStart);
// 
// }



export function dayOfMonth(date) {
const d = new Date(date);
return d.getDate();

}



export function nextDay(date, dayIndex) {

const d = new Date(date);

d.setDate( d.getDate() + (dayIndex + ( 7-d.getDay() ) ) % 7);
return d;
}

function getDayBeforePaymentDayIndex(date, dayIndex){
  const d = new Date(date);

  d.setDate( d.getDate() + (dayIndex + ( 6-d.getDay() ) ) % 7);
  return d;
}

// export function noDaysToStartInterval(dateStart, dateIntervalStart ) {
// const startDay = new Date(dateStart);
// const dateInterval = new Date(dateIntervalStart);
// 
//   //d.setDate( d.getDate() + (dayIndex + ( 7-d.getDay() ) ) % 7);
//   return Math.floor((Date.UTC(dateInterval.getFullYear(), dateInterval.getMonth(), dateInterval.getDate()) - Date.UTC(startDay.getFullYear(), startDay.getMonth(), startDay.getDate()) ) /(1000 * 60 * 60 * 24));
// 
// }

function getNoOfDaysInclusive(date1, date2) {
// add 1 day to make it inclusive of date2
  return Math.floor( 1 + (((date2) - (date1)) / (1000 * 60 * 60 * 24)));

}

// export function getDates(startDate, endDate) {
// var dates = [],
//   currentDate = startDate,
//   addDays = function(days) {
//     var date = new Date(this.valueOf());
//     date.setDate(date.getDate() + days);
//     return date;
//   };
// while (currentDate <= endDate) {
// dates.push(currentDate);
// currentDate = addDays.call(currentDate, 14);
// }
// console.log(dates);
// return dates;
// }

// export function dates() {
// var dates = this.getDates(new Date('2018-08-09'), new Date('2018-08-20'));
// dates.forEach( (date) => {
//   console.log(date)
// })
// }

// 
// export function startPeriod(dateStart, paymentDay){
// 
// const startDay = new Date(dateStart);
// const intervalDayIndex = this.dayIndex(paymentDay);
// 
// const dateInterval = this.nextDay(startDay, intervalDayIndex);
// const startPeroidLastDate =  dateInterval.getMonth();
// 
// console.log(`dateInterval is ${dateInterval}`);
//   const startPeriodObject = {From: startDay, To:startPeroidLastDate, Days: Math.floor((Date.UTC(dateInterval.getFullYear(), dateInterval.getMonth(), dateInterval.getDate()) - Date.UTC(startDay.getFullYear(), startDay.getMonth(), startDay.getDate()) ) /(1000 * 60 * 60 * 24))};
//   //d.setDate( d.getDate() + (dayIndex + ( 7-d.getDay() ) ) % 7);
//   return JSON.stringify(startPeriodObject);
// 
// 
// }
