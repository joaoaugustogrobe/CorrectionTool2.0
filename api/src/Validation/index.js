const schemas = require('./schemas');
const { checkSchema, validationResult } = require('express-validator');

module.exports = {

    validate: (req, res, next) => {
        console.log('validating', `${req.method}${req.route && req.route.path}`)
        const schema = schemas[`${req.method}${req.route && req.route.path}`];
        if (schema) {
            console.log(schema)
            checkSchema(schema);
            console.log(validationResult(req));
            return res.status(200).send(validationResult(req))
        }
        next();
    },

    mapErrors: validationResult.withDefaults({
        formatter: error => error.msg
    })
};