const validate = (schema) => {
    return (req, res, next) => {
        let errors = [];

        // Validate body
        if (schema._ids._byKey.has("body")) {
            const { error } = schema.extract("body").validate(req.body, { abortEarly: false });
            if (error) errors = errors.concat(error.details.map(d => d.message));
        }

        // Validate query
        if (schema._ids._byKey.has("query")) {
            const { error } = schema.extract("query").validate(req.query, { abortEarly: false });
            if (error) errors = errors.concat(error.details.map(d => d.message));
        }

        // Validate params
        if (schema._ids._byKey.has("params")) {
            const { error } = schema.extract("params").validate(req.params, { abortEarly: false });
            if (error) errors = errors.concat(error.details.map(d => d.message));
        }

        if (errors.length > 0) {
            return res.status(400).json({
                status: 400,
                message: "Validation Error",
                errors
            });
        }

        next();
    };
};

module.exports = validate;