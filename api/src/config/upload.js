const multer = require('multer')
const path = require('path')

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'temp'),
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
        }
    }),
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.m') {
            return callback(new Error('Extensão inválida'))
        }

        callback(null, true)
    },
    limits: {
        fieldNameSize: 300,
        fileSize: 1 * 1024 * 1024, //1MB
    }
}