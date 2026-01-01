// We are creating a new class (a blueprint) called ApiError
// This class is meant to represent an error that comes from an API (backend server)
class ApiError extends Error {

    // The constructor is a special function that runs automatically
    // when we create a new object from this class using "new ApiError(...)"
    constructor(
        statusCode,                       // HTTP status code (example: 404, 500)
        message = "Something went wrong", // Default error message if none is provided
        errors = [],                      // An array to store extra error details
        statck = ""                       // Stack trace (note: "statck" is misspelled)
    ) {

        // Calling the constructor of the parent class (Error)
        // This sets up the built-in Error object properly
        // Without this, JavaScript will throw an error
        super(message);

        // "this" refers to the current object being created from this class
        // Think of "this" as: "this particular error object"

        // Storing the status code inside this error object
        this.statusCode = statusCode;

        // Setting data to null because this error response does not contain data
        this.data = null;

        // success is false because this object represents an error
        this.success = false;

        // Saving the error message inside the object
        this.message = message;


        this.errors = errors;

        // Saving the stack trace value
        // (again, note the spelling mistake: statck instead of stack)
        this.statck = stack;

        // If a stack trace was manually provided
        if (statck) {

            // Use the provided stack trace
            this.statck = stack;

        } else {

            // Automatically generate a stack trace
            // This shows where the error happened in the code
            // "this.constructor" refers to the current class (ApiError)
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }