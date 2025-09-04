import multer from 'multer'

const storage = multer.diskStorage({
    filename: function(req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload = multer({storage})
export default upload

//what i found we use multer when user uploaded form data with multimedia and need to send fields and files in separate parts of req 