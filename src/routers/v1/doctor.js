const express = require('express');
app = express();
const userRepository = require("../../repositories/user");
const checkAdminRole = require('../../middlewares/authentication');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const router = express.Router();

const getOtp = async (req, res) => {
    try {
        console.log("req: ", req);
        const otpCode = // TODO call a function that return otpCode

            res.status(200).json({message: otpCode})
    } catch (e) {
        console.log("getOtp ERROR: ", e.message);
        res.status(500).json({message: e.message})
    }
};


const createNewDoctor = async (req, res) => {
        try {
            //TODO validate otpCode and then create new doctor

        } catch
            (e) {
            res.status(500).json({message: e.message})
        }
    }
;


const loginDoctor = async (req, res) => {
    try {
        // TODO check if user registered and generate jwtToken if he/she registered
        res.json({message: 'success', tokenType: 'Bearer', accessToken: jwtToken})

    } catch (e) {
        console.log("loginDoctor ERROR: ", e.message);
        res.status(500).json({message: e.message})
    }
};


const getListOfDoctors = async (req, res) => {
    try {
        const result = //TODO return doctorList
        res.json({message: result})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};

router.get('/', getOtp);
router.post('/', createNewDoctor);
router.get('/', loginDoctor);
router.get('/', checkAdminRole.checkRolesAccess, getListOfDoctors);
module.exports = router;