const multer = require('multer')
const path = require('path')

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'temp'),
        filename: (req, file, cb) => {
            console.log(file)
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
        }
    })
}