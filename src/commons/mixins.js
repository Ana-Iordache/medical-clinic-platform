const generalMixin = {
    data: () => ({
        rules: {
            requiredField: value => !!value || "This field is required!",
        }
    })
}

export default generalMixin;