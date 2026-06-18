/**
 * Request validation middleware using Zod schemas
 * @param {import('zod').ZodSchema} schema 
 */
export const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const validated = schema.parse(req[source]);
    req[source] = validated;
    return next();
  } catch (error) {
    return next(error);
  }
};

export default validate;
