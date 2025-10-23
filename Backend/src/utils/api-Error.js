// Centralized Error Handler Middleware
class ApiError extends Error{
    constructor(
        statusCode,
        message = "Somthing Went Wrong",
        error =[],
        stack = ""
    ){
        super(message);//super is used to call the constructor of the parent class
        this.statusCode = statusCode;
        this.error = error;
        this.success = false;
        this.data = null;

        if(stack) {
            this.stack = stack;
        }else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError};