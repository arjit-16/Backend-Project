// const asyncHandler = (requestHandler) => {
//     return (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((error) => next(error));
//     };
// };

// export {asyncHandler};





// const asyncHandler = (fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }













// const asyncHandler = (requestHandler) => {
//     async(req,res,next) => {
//         try {
//             await requestHandler(req,res,next)
//         } catch (error) {
//             res.status(error.code || 500).json({
//                 success: false,
//                 message: error.message
//             })
//         }
//     }
// }

// export {asyncHandler}




const asyncHandler = (requestHandler) => {
    return async (req,res,next) => {
        try {
           await requestHandler(req,res,next)
        } catch (error) {
            res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}}

export {asyncHandler}

// const as=asyncHandler(fn())