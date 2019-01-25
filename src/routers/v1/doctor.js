const express = require('express');
app = express();
const doctorRepository = require("../../repositories/doctor");

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const router = express.Router();

const getListOfDoctorsByCategory = async (req, res) => {
    try {
        const result = doctorRepository.searchDoctorByCategory(req.query.categoryId)
        res.json({message: result})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const getListOfDoctorsFullTextSearch = async (req, res) => {
    try {
        const result = doctorRepository.searchDoctorFullText(req.query);
        res.json({message: result})
    } catch (e) {
        res.status(500).json({message: e.message})
    }
};


const getDoctorListController = async (req, res) => {
    try {
       
        if(req.query.categoryId){
            await getListOfDoctorsByCategory(req,res)
        }
        else await getListOfDoctorsFullTextSearch(req,res)

    }catch (e) {
        console.log("getDoctorListController ERROR: ", e.message)
    }
};



router.get('/', getDoctorListController);
module.exports = router;