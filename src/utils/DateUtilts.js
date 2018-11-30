
const monthNames = [
  "January", "February", "March",
  "April", "May", "June",
  "July", "August", "September",
  "October", "November", "December"
];


// I did not come up with this function. It was found on stackoverflow.
// it takes the mod of the number and checks if its 1st, 2nd or rd. 

export function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

export default function getMonth(dateMonthIndex) {

return monthNames[dateMonthIndex.getMonth()];


}
