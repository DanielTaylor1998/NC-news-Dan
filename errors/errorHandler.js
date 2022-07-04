exports.invalidPathError = (req, res) => {
    res.status(404).send({ msg: "Invalid Path !"})
}