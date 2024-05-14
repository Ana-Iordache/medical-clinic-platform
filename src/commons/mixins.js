const generalMixin = {
    data: () => ({
        rules: {
            requiredField: value => !!value || "This field is required.",
            tenCharacters: value => value.length == 10 || "This field should be 10 charcaters long.",
            thirthteenCharacters: value => value.length == 13 || "This field should be 13 charcaters long.",
            password: value => (value.length >= 6 && value.search(/[a-z]/) >= 0 && value.search(/[A-Z]/) >= 0 && value.search(/[0-9]/) >= 0) || "Password is not valid."
        },
        dayOfWeeks: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    }),
    methods: {
        onlyNumbersInput(value) {
            return value.replace(/[^0-9]/g, '');
        },
        getStringDayOfWeek(number) {
            return this.dayOfWeeks[number];
        },
        getValueIfNotEmpty(value) {
            return value ? value : "-";
        },
        /**
         * 
         * @param {String} dateAndTimeString 
         * @returns A date parsed from a string in format '2022-07-28T09:40:00.000Z'
         */
        parseDateAndTimeString(dateAndTimeString) {
            return new Date(dateAndTimeString);
        },
        /**
         * 
         * @param {Date} date 
         * @returns A string with time form a date in format "hh:mm"
         */
        getTimeFromDate(date) {
            return `${date.getHours()}:${date.getMinutes()}`
        },
        /**
         * 
         * @param {Date} date 
         * @returns A string with date from a date in format "dd Month yyyy"
         */
        getDateStringFromDate(date) {
            return `${date.getDate()} ${this.months[date.getMonth()]} ${date.getFullYear()}`
        }
    }
}

export default generalMixin;