exports.invalidPathError = (req, res) => {
    res.status(404).send({ msg: "Invalid Path !"})
}

exports.customErrorHandler = (err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg : err.msg})
    } else next(err)
}

exports.badIdhandler = (err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({ msg : "invalid ID !"})
    } else next(err)
}

//Last Error Handler - Only for errors without a handler
exports.unhandlesErrorHandler = (err, req, res, next) => {
    if (err) {
    console.error(err)
    res.sendStatus(500).send({ msg : "Unhandled Error!"});
    }
}