exports.invalidPathError = (req, res) => {
    res.status(404).send({ msg: "Invalid Path !"})
}

exports.customErrorHandler = (err, req, res, next) => {
    if(err.status && err.msg) {
        res.status(err.status).send({ msg : err.msg})
    } else next(err)
}

exports.invalidSyntaxForType = (err, req, res, next) => {
    if(err.code === '22P02') {
        res.status(400).send({ msg : "Your body or request has the wrong input type"})
    } else next(err)
}

exports.malformedBodyHandler = (err, req, res, next) => {
    if(err.code === '23502') {
        res.status(400).send({ msg : "The body is missing fields or Malformed !"})
    } else next(err)
}

exports.foreignKeyInvalidInsertHandler = (err, req, res, next) => {
    if (err.code === '23503' && err.constraint === 'comments_author_fkey') {
        res.status(404).send({ msg : "This user does not exist !"})     //Specific to comments table
    } else if (err.code === '23503' && err.constraint === 'comments_article_id_fkey') {
        res.status(404).send({ msg : "This article id does not exist !"}) 
    } 
    else next(err)
}

//Last Error Handler - Only for errors without a handler
exports.unhandlesErrorHandler = (err, req, res, next) => {
    if (err) {
    console.error(err)
    res.sendStatus(500).send({ msg : "Unhandled Error!"});
    }
}