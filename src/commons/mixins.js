const generalMixin = {
    data: () => ({
        rules: {
            requiredField: value => !!(value && value.trim()) || "This field is required.",
            tenCharacters: value => value.length == 10 || "This field should be 10 charcaters long.",
            thirthteenCharacters: value => value.length == 13 || "This field should be 13 charcaters long.",
            password: value => (value.length >= 6 && value.search(/[a-z]/) >= 0 && value.search(/[A-Z]/) >= 0 && value.search(/[0-9]/) >= 0) || "Password is not valid."
        },
        dayOfWeeks: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        professionalDegrees: ["Medic generalist", "Medic rezident", "Medic specialist", "Medic primar", "Psiholog"],
        specializations: []
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
         * @returns A string with date from a date in format "dd Month yyyy"
         */
        getDateStringFromDate(date) {
            return `${date.getDate()} ${this.months[date.getMonth()]} ${date.getFullYear()}`
        },
        /**
         * Parses the hour reveiced as a parameter (in format HH:MM) to a date.
         * @param {String} timeString should be in format HH:MM
         * @returns The current date with hours parsed from timeString.
         */
        parseTimeToDate(timeString) {
            const [hours, minutes] = timeString.split(':').map(num => parseInt(num));
            const currentTime = new Date();
            currentTime.setHours(hours);
            currentTime.setMinutes(minutes);
            currentTime.setSeconds(0);
            return currentTime;
        },
        /**
         * Formats the time as 'HH:MM' string from a date.
         * @param {Date} date 
         * @param {Boolean} inUTC
         * @returns The time from date as a string in format 'HH:MM'
         */
        formatTimeFromDate(date, inUTC) {
            let hours;
            let minutes;

            if (inUTC) {
                hours = date.getUTCHours();
                minutes = date.getUTCMinutes();
            } else {
                hours = date.getHours();
                minutes = date.getMinutes();
            }

            hours = hours.toString().padStart(2, '0');
            minutes = minutes.toString().padStart(2, '0');

            return `${hours}:${minutes}`;
        },
        async getSpecializations() {
            const services = await this.loadServices();
            const specializations = services.map(service => service.name);
            return specializations;
        },
        loadServices() {
            return new Promise(resolve => {
                this.axios.get('/services')
                    .then(response => resolve(response.data))
                    .catch(() => resolve([]));
            })
        },
    }
}

export default generalMixin;