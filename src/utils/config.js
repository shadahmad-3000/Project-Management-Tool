const Joi = require("joi");
const { status: httpStatus } = require("http-status");
// Load env variables once
const dotenv = require("dotenv");
const ApiError = require("./apiError");
dotenv.config();

// Define validation schema
const envSchema = Joi.object(
    {
        PORT: Joi.number().default(3000),
        MONGO_URI: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(10).required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        NODE_ENV: Joi.string().valid("development", "production", "test").default("development")
    }
).unknown(true); // allow extra env variables

// Validate process.env
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Config validation error: ${error.message}`);
};

// Export clean config
module.exports = {
    PORT: envVars.PORT,
    MONGO_URI: envVars.MONGO_URI,
    JWT_SECRET: envVars.JWT_SECRET,
    JWT_EXPIRES_IN: envVars.JWT_EXPIRES_IN,
    NODE_ENV: envVars.NODE_ENV
};
