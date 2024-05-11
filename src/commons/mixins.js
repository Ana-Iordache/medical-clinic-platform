const generalMixin = {
    data: () => ({
        rules: {
            requiredField: value => !!value || "This field is required.",
            tenCharacters: value => value.length == 10 || "This field should be 10 charcaters long.",
            thirthteenCharacters: value => value.length == 13 || "This field should be 13 charcaters long.",
            password: value => (value.length >= 6 && value.search(/[a-z]/) >= 0 && value.search(/[A-Z]/) >= 0 && value.search(/[0-9]/) >= 0) || "Password is not valid."
        }
    }),
    methods: {
        onlyNumbersInput(value) {
            return value.replace(/[^0-9]/g, '');
        }
    }
}

export default generalMixin;