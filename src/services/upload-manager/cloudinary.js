const cloudinary = require('cloudinary').v2;
const utils = require('../../utils/utils')
const Promise = require('bluebird');
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const uploadToCloudinary = (image) => {
    console.log('uploadToCloudinary image ',image)
    const filesDir = "./tempFiles"
    const path = filesDir + "/" + utils.generateRandomString(20) + ".png"
    console.log('uploadToCloudinary image dest path',path)

    return new Promise((resolve, reject) => {
        image.mv(path, function (err) {
            if (err) {
                return reject('Move image failed ', err)
            }
            if (utils.validateFileSize(path, 2000000000)) {

                cloudinary.uploader.upload(path, {folder: process.env.CLOUDINARY_FOLDER}, function (err, result) {
                    fs.unlink(path)
                    if (err) {
                        console.log('error uploading cloudinary ', err)
                        return reject('Upload image failed ...', err)

                    }
                    console.log('result of cloudinary ', result.url)
                    resolve(result.url)


                });
            }
            else {
                return reject('cant upload file larger than tow megabyte', err)
            }

        });

    })
}

module.exports = {
    uploadToCloudinary
}
