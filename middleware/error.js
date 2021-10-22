const errorResponse = (err, req, res, next) => {
    // let error = { ...err };
    console.log(err);
    res.status(err.statusCode || 500).json({
        err: err.code,
        message: err.message
    });
}

module.exports = errorResponse;