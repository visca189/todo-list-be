import { NextFunction, Request, Response } from 'express';
import z, { ZodError } from 'zod';
import { ValidationError } from '../../express-bootstrap';

interface RequestProperties {
  params: string;
  body: string;
  query: string;
}

type Schemas = {
  [K in keyof RequestProperties]?: z.ZodObject<any, any>;
};

export function validateData(schemas: Schemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const key in schemas) {
        const schema = schemas[key];
        schema.parse(req[key]);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));

        throw new ValidationError('invalid parameters', errorMessages);
      } else {
        throw error;
      }
    }
  };
}
