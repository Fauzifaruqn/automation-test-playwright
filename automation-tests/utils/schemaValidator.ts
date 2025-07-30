import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { expect } from '@playwright/test';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export class SchemaValidator {
    static validate(schema: object, data: any): { isValid: boolean; errors?: string[] } {
        const validate = ajv.compile(schema);
        const isValid = validate(data);

        if (!isValid) {
            const errors = validate.errors?.map(error => {
                const path = error.instancePath || error.schemaPath;
                return `${path}: ${error.message}`;
            }) || [];

            return { isValid: false, errors };
        }

        return { isValid: true };
    }

    static validateResponse(schema: object, response: any, description: string = '') {
        const result = this.validate(schema, response);

        if (!result.isValid) {
            expect.soft(result.isValid, {
                message: `❌ Schema validation failed${description ? ` for ${description}` : ''}:
${(result.errors || []).join('\n')}`
            }).toBe(true);
        } else {
            expect(result.isValid, `✅ Schema valid${description ? ` for ${description}` : ''}`).toBe(true);
        }

        return true;
    }
}
