const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    return next({
      statusCode: 400,
      message: error.details[0].message,
    });
  }

  req.validatedData = value; 
  next();
};

export default validate;