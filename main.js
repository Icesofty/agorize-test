import moment from "moment";
import { Event } from "./event";

let startDate = moment("2016-07-01 10:30"); // July 1st, 10:30
let endDate = moment("2016-07-01 14:00"); // July 1st, 14:00
let recurringDay = "Friday";

new Event(true, true, startDate, endDate, recurringDay); // weekly recurring opening in calendar

startDate = moment("2016-07-08 11:30"); // July 8th 11:30
endDate = moment("2016-07-08 12:30"); // July 8th 12:30
new Event(false, false, startDate, endDate, null); // intervention scheduled

const fromDate = moment("2016-07-04 10:00");
const toDate = moment("2016-07-10 10:00");

const availabilities = Event.prototype.availabilities(fromDate, toDate);

if (availabilities) {
  availabilities.forEach((element) => {
    console.log(
      "I'm available from " +
        element.day +
        ", at " +
        element.hours.slice(0, -1).join(", ").replaceAll("TAKEN,", "").trim() +
        " and " +
        element.hours.slice(-1)
    );
  });
} else console.log("I'm currently not available in this dates.");
