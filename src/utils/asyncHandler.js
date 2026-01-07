

// This is a higher-order function that wraps async route handlers
// It helps us handle errors automatically without writing try-catch in every route
const asyncHandler = (requestHandler) => {

    return (req, res, next) => {

        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
        
    }
    // (req, res, next) This is useful because our requestHandler might be async or might return a Promise
    // Promise.resolve() converts the result into a Promise (whether it's already a Promise or not)
    // .catch() catches any errors that happen in the requestHandler
    // Instead of crashing, we pass the error to next() which sends it to Express error handler
    //             .catch((err) => next(err));
}

export { asyncHandler }


// const asyncHandler = (requestHandler) => {
//     // Return a middleware function that Express will call for each request
//     return (req, res, next) => {
//
//
//         Promise.resolve(requestHandler(req, res, next))
//
//
//     }
// }

// export { asyncHandler }


// const asyncHandler = (fn)  => async (req, res, next) => {
//     try {
//         await fn(req, res, next)

//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message || "Internal Server Error"
//         })
//     }
// }

// a function which can accpet parameters and can return them are called higher order functions
