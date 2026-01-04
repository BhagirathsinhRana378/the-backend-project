class apiResponce {
    constructor(success, message, data = null) {

        this.statusCode = statusCode
        this.success = statusCode < 400
        this.message = message
        this.data = data

    }
}

export {apiResponce};