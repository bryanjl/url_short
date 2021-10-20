const errorResponse = (err, req, res, next) => {
    // let error = { ...err };
    // console.log(err);
    res.status(err.statusCode).json({
        err: err.code,
        message: err.message
    });
}

module.exports = errorResponse;