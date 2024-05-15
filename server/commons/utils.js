function extractBirthdateFromIdentityNumber(idNumber) {
    // Extract the birthdate part (first 6 characters)
    const birthdatePart = idNumber.substring(1, 7); // YYMMDD

    const year = parseInt(birthdatePart.substring(0, 2), 10);
    const month = parseInt(birthdatePart.substring(2, 4), 10);
    const day = parseInt(birthdatePart.substring(4, 6), 10);

    // Determine the full birth year based on the century identifier (first digit of CNP)
    const firstDigit = idNumber[0];
    let fullYear;

    // Determine century based on the first digit of CNP
    if (['1', '2'].includes(firstDigit)) {
        fullYear = 1900 + year;
    } else if (['3', '4'].includes(firstDigit)) {
        fullYear = 1800 + year;
    } else if (['5', '6', '7', '8'].includes(firstDigit)) {
        fullYear = 2000 + year;
        // For temporary residents the birth year is also assumed to be in the 2000s
    }

    const birthdate = `${day}/${month}/${fullYear}`;

    return birthdate;
}

function extractAgeFromBirthdate(birthdateString) {
    // Parse the birthdate string into day, month, and year components
    const [day, month, year] = birthdateString.split('/').map(component => parseInt(component, 10));

    // Create a Date object from the parsed components
    const birthdate = new Date(year, month - 1, day);

    // Get the current date
    const currentDate = new Date();

    // Calculate the age
    let age = currentDate.getFullYear() - birthdate.getFullYear();

    // Adjust age based on the month and day of the birthdate
    // Subtract 1 year if the current date is before the birthday in the current year
    if (currentDate.getMonth() < birthdate.getMonth() || (currentDate.getMonth() === birthdate.getMonth() && currentDate.getDate() < birthdate.getDate())) {
        age--;
    }

    return age;
}

function extractGenderFromIdentityNumber(idNumber) {
    const firstDigit = idNumber[0];
    let gender = '';
    if (['1', '3', '5', '7'].includes(firstDigit)) {
        gender = 'Male';
    } else if (['2', '4', '6', '7'].includes(firstDigit)) {
        gender = 'Female';
    } 

    return gender;
}

/**
 * Set the time for a date.
 * @param {String} dateString 
 * @param {String} stringTime 
 */
function setTimeForDate(dateString, stringTime) {
    const date = new Date(dateString);
    const [hours, minutes] = stringTime.split(':').map(num => parseInt(num));
    date.setHours(hours + 3);
    date.setMinutes(minutes);
    // TODO: check if it is ok to add 3 hours, because date is in UTC
    // but when parse to string is in EEST and ir is correct
    return date;
}

module.exports = {
    extractBirthdateFromIdentityNumber,
    extractAgeFromBirthdate,
    extractGenderFromIdentityNumber,
    setTimeForDate
}