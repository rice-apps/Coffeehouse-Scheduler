
export const getScheduled = (shiftDetails) => {
    if (shiftDetails.preferences) {
        // Check user preference objects for # scheduled
        let scheduled = shiftDetails.preferences.filter(prefObj => prefObj.scheduled == true);
        return scheduled;
    }
    // Otherwise return blank
    return [];
}

export const filterByPreference = (shiftDetails, preference) => {
    if (shiftDetails.preferences) {
        // Check user preference objects for # scheduled
        let filtered = shiftDetails.preferences.filter(prefObj => prefObj.preference == preference);
        return filtered;
    }
    // Otherwise return blank
    return [];
}

export const getPreferenceTitle = (preferenceNum) => {
    const preferenceNum2Title = {
        0: "Undetermined",
        1: "Preferred",
        2: "Available",
        3: "Not Preferred",
        4: "Unavailable"
    }
    return preferenceNum2Title[preferenceNum]
}

export const dayAbbrev2Name = (abbrev) => {
    let abbreviationsToNames = {
        'M': "Mon",
        'T': "Tues",
        'W': "Wed",
        'R': "Thurs",
        'F': "Fri",
        'S': "Sat",
        'U': "Sun"
    };

    return abbreviationsToNames[abbrev];
}