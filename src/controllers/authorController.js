const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const { isValid, validateEmail } = require("../validator/validator");

////////////////////////////POST AUTHOR API/////////////////////////////////

const createAuthor = async function (req, res) {
    try {
        let author = req.body;
        if (!isValid(author.fname)) {
            return res.status(400).send({ status: false, msg: "fname is required" })
        }

        if (!isValid(author.lname)) {
            return res.status(400).send({ status: false, msg: "lname is required" })
        }

        if (!isValid(author.email)) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }

        if (!validateEmail(author.email)) {
            return res.status(400).send({ status: false, msg: "email is not correct" })
        }
        const checkEmailId = await authorModel.findOne({ email: author.email })
        if (checkEmailId) {
            return res.status(400).send({ status: false, msg: "email is already used" })
        }
        if (!isValid(author.title)) {
            return res.status(400).send({ status: false, msg: "title must be required" })
        }

        let authorCreated = await authorModel.create(author)
        res.status(201).send({
            status: true,
            data: authorCreated
        })

    } catch (error) {
        res.status(500).send({ msg: error.message })

    }
};

//////////////////////////////POST LOGIN API//////////////////////////////

const loginAuthor = async function (req, res) {
    try{
    let userName = req.body.email
    let password = req.body.password
    let author = await authorModel.findOne({ email: userName, password: password })
    if (!author) {
        res.status(400).send({ status: false, msg: "username or the password is not corerct" })
    }
    else {
        let token = jwt.sign({
            authorId: author._id.toString(),
            batch: "radon",
            organisation: "FunctionUp"
        }, "msTeamRoom-10")
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, token: token })
    }
}catch (error) {
    res.status(500).send({ msg: error.message })
  
  }
}

module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;































































