// require('dotenv').config();
//
// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
// const uploadManager = require('./src/services/upload-manager/cloudinary')
//
// app.use(bodyParser.json());
// app.use(fileUpload());
// app.listen(5000, () => {
//     console.log("Example app listening at http://%s:%s", 5000)
//     if (process.env.IS_MOCK === 'true') console.log('Mock mode ....')
// });
// app.post('/upload',upload)
//
// async function upload(req, res) {
//     console.log('req.files : ' , req.files);
//     const image = req.files.image;
//     console.log('request body : ',req.body);
//     try {
//         const result = await uploadManager.uploadToCloudinary(image)
//         res.json({message: `fileName uoloaded`, result: {imageLink :result.url}});
//
//     } catch (e) {
//         console.log('error upload image to cloudinary ', e)
//         res.status(500).json({message:"Problem with uploading image", result:e.message})
//     }
//
// }
// setImmediate(function y(){console.log("Immediate")})
//
// console.log("1")
// console.log("2")
// setTimeout(function x(){console.log("Timeout")},0)
// console.log("3")
// console.log("4")
// function pr() {
//     var b = 3
//     const e = 5
//     let t = 9
//     y = 6
//
//     for (let i = 0; i < 2; i++) {
//         var g = 4
//         const u = 5
//         let k = 9
//         console.log("b: ", b)
//         console.log("e: ", e)
//         console.log("t: ", t)
//     }
//     console.log("g: ", g)
//     console.log("u: ", u)
//     console.log("k: ", k)
//     console.log("i: ", i)
//
// }

// console.log("y :", y)

// pr()

// var x =1;
// if(true) {
//     const x =2;
//     console.log(x)
// }


var x =1;
function A (){
    let x = 2;
    console.log(x)
}
A()

console.log("r: ",x)

