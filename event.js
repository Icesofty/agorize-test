import moment from "moment";

const eventList = [];

export const Event = function (
  opening,
  recurring,
  startDate,
  endDate,
  recurringDay
) {
  this.opening = opening;
  this.recurring = recurring;
  this.startDate = startDate;
  this.endDate = endDate;
  this.recurringDay = recurringDay;

  eventList.push(this);
};

Event.prototype.availabilities = function (fromDate, toDate) {
  let format = "HH:mm";
  const availableDays = [];
  const recurringHours = [];
  let recurringWeekDay;
  const availabilities = [];

  // Fetch reccuring data
  eventList.forEach((element) => {
    if (element.recurring) {
      let startDate = element.startDate.clone();
      recurringWeekDay = element.recurringDay;
      while (startDate.isBefore(element.endDate, "hour")) {
        recurringHours.push(startDate.format(format));
        startDate.add(30, "minutes");
      }
    }
  });

  // Get next available days from date range
  let recurringDays = fromDate.clone();

  while (recurringDays.isSameOrBefore(toDate)) {
    if (recurringDays.format("dddd") === recurringWeekDay)
      availableDays.push(recurringDays.format("MMMM Do YYYY"));
    recurringDays.add(1, "days");
  }

  // Check and return all availabilities for date range
  availableDays.forEach((day, index) => {
    availabilities.push({ day: day, hours: [] });

    eventList.forEach((element) => {
      if (
        !element.recurring &&
        element.startDate.format("MMMM Do YYYY") === day
      ) {
        // Delete already booked hours
        let startHourBooked = moment(element.startDate.format(format), format);
        let endHourBooked = moment(element.endDate.format(format), format);

        recurringHours.forEach((hour) => {
          let availableHour = moment(hour, format);

          if (
            availableHour.isBefore(startHourBooked) ||
            availableHour.isSameOrAfter(endHourBooked)
          ) {
            availabilities[index].hours.push(availableHour.format(format));
          } else {
            availabilities[index].hours.push("TAKEN");
          }
        });
      }
    });

    if (availabilities[index].hours.length === 0)
      availabilities[index].hours = recurringHours;
  });

  return availabilities;
};
