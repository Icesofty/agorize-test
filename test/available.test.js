import { assert, expect, test } from "vitest";
import moment from "moment";
import { Event } from "../event";

let startDate = moment("2016-07-01 10:30"); // July 1st, 10:30
let endDate = moment("2016-07-01 14:00"); // July 1st, 14:00
let recurringDay = "Friday";

new Event(true, true, startDate, endDate, recurringDay); // weekly recurring opening in calendar

startDate = moment("2016-07-08 10:30"); // July 8th 11:30
endDate = moment("2016-07-08 13:00"); // July 8th 12:30
new Event(false, false, startDate, endDate, null); // intervention scheduled

const fromDate = moment("2016-07-04 10:00");
const toDate = moment("2017-01-08 10:00");

let availabilities = Event.prototype.availabilities(fromDate, toDate);

if (availabilities.length < 1) {
  availabilities = [false, { day: "December 15th 2022", hours: [] }];
}

test("Check if date range have a Friday", () => {
  availabilities.forEach((element) => {
    expect(moment(element.day, "MMMM Do YYYY").format("dddd")).toBe("Friday");
  });
});

test("Check if hours are available", () => {
  let success = false;
  availabilities.forEach((element) => {
    element.hours.forEach((hour) => {
      if (hour !== "TAKEN") success = true;
    });
  });

  expect(success).toBe(true);

  if (availabilities[1]) {
    availabilities.forEach((element) => {
      console.log(
        "I'm available from " +
          element.day +
          ", at " +
          element.hours
            .slice(0, -1)
            .join(", ")
            .replaceAll("TAKEN,", "")
            .trim() +
          " and " +
          element.hours.slice(-1)
      );
    });
  } else console.log("I'm currently not available in this dates.");
});
