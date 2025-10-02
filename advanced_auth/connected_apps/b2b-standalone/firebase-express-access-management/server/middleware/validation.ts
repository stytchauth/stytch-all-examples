import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

// Validation schemas
export const schemas = {
  signUp: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(50).optional().allow(''),
  }),

  signIn: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  createOrganization: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional().allow(''),
  }),

  createAccessRequest: Joi.object({
    resourceName: Joi.string().min(1).max(100).required(),
    reason: Joi.string().min(10).max(500).required(),
  }),

  approveDenyRequest: Joi.object({
    action: Joi.string().valid('approve', 'deny').required(),
    reason: Joi.string().min(5).max(500).required(),
  }),
};

// Generic validation middleware
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body);

    if (error) {
      res.status(400).json({
        error: 'Validation error',
        details: error.details.map((detail) => detail.message),
      });
      return;
    }

    next();
  };
};
