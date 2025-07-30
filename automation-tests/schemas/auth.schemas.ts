export const loginSuccessSchema = {
    type: "object",
    properties: {
        success: {
            type: "boolean",
            const: true
        },
        token: {
            type: "string",
            pattern: "^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$", // JWT pattern
            minLength: 10
        }
    },
    required: ["success", "token"],
    additionalProperties: false
};

// Login Error Response Schema
export const loginErrorSchema = {
    type: "object",
    properties: {
        success: {
            type: "boolean",
            const: false
        },
        message: {
            type: "string",
            enum: ["Invalid credentials", "User not found", "Invalid password"]
        }
    },
    required: ["success", "message"],
    additionalProperties: false
};

// Register Success Response Schema
export const registerSuccessSchema = {
    type: "object",
    properties: {
        message: {
            type: "string",
            const: "User registered"
        }
    },
    required: ["message"],
    additionalProperties: false
};

// Register Error Response Schema
export const registerErrorSchema = {
    type: "object",
    properties: {
        message: {
            type: "string",
            enum: ["Username already exists", "Email already exists", "Invalid input"]
        }
    },
    required: ["message"],
    additionalProperties: false
};

// Generic Auth Error Schema (for validation errors, etc.)
export const authValidationErrorSchema = {
    type: "object",
    properties: {
        success: {
            type: "boolean",
            const: false
        },
        message: {
            type: "string"
        },
        errors: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    field: { type: "string" },
                    message: { type: "string" }
                }
            }
        }
    },
    required: ["success", "message"],
    additionalProperties: false
};