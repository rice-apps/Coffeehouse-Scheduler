const _isUserScheduled = (shift, user) => {
    let filtered = shift.preferences.filter(prefObj => {
        // Check preference object is scheduled
        let scheduled = prefObj.scheduled;
        // Check that this pref obj corresponds to the right user
        let equalNetid = prefObj.user.netid == user.netid;

        // Having scheduled first will check a lot less objects
        return scheduled && equalNetid;
    }); 

    // If filtered includes at least one instance of the user as being scheduled, then they are scheduled
    return filtered.length > 0 ? true : false;
}

export const getUserScheduled = (schedule, user) => {
    let scheduledShifts = Object.keys(schedule).flatMap(dayName => {
        // Filter shifts to only those where the user is scheduled
        let filtered = schedule[dayName].filter(shift => _isUserScheduled(shift, user));
        return filtered;
    });

    console.log(scheduledShifts);

    return scheduledShifts;
}

const _dayAbbrev2FullName = (abbrev) => {
    let abbreviationsToNames = {
        'M': "Monday",
        'T': "Tuesday",
        'W': "Wednesday",
        'R': "Thursday",
        'F': "Friday",
        'S': "Saturday",
        'U': "Sunday"
    };

    return abbreviationsToNames[abbrev];
}

export const shiftToTime = (shift) => {
    let dayAbbrev = shift.day;
    let hour = shift.hour;

    let dayString = _dayAbbrev2FullName(dayAbbrev);
    // TODO: Replace this with a function; it is repeated logic with Calendar.js
    let timePeriod = (hour > 11) && (hour < 24) ? ("PM") : ("AM")
    let time = ((hour - 1) % 12) + 1;
    let timeString = time + " " + timePeriod;

    return timeString + ", " + dayString;
}