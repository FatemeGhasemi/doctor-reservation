const express = require('express');
app = express();
const userRepository = require("../../repositories/user");

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const router = express.Router();

const createNewUser = async (req, res) => {
    try {
        await userRepository.createUser(req.body.phoneNumber)

    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

router.post('/', createNewUser());
