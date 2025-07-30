// playwright-api-tests/auth.spec.ts
import { test, expect, request } from '@playwright/test';
import {
  loginSuccessSchema,
  loginErrorSchema,
  registerSuccessSchema,
  registerErrorSchema
} from '../../schemas/auth.schemas';
import { SchemaValidator } from '../../utils/schemaValidator';
const baseURL = 'http://localhost:4000';

test.describe('Authentication API', () => {
  test('POST /api/register - success', { tag: ['@auth', '@register', '@positive'] }, async () => {
    const context = await request.newContext({ baseURL });
    const res = await context.post('/api/register', {
      data: {
        username: 'user_' + Date.now(),
        password: '12345678'
      }
    });
    expect(res.status(), 'register success response status : 201').toBe(201);
    const body = await res.json();
    expect(body.message, 'register success response message : User registered').toBe('User registered');

    SchemaValidator.validateResponse(registerSuccessSchema, body, 'register success response');
  });

  test('POST /api/register - duplicate username', { tag: ['@auth', '@register', '@negative'] }, async () => {
    const context = await request.newContext({ baseURL });
    await context.post('/api/register', {
      data: { username: 'testuser', password: '12345678' }
    });
    const res = await context.post('/api/register', {
      data: { username: 'testuser', password: '12345678' }
    });
    expect(res.status(), 'register error response status : 400').toBe(400);
    const body = await res.json();
    SchemaValidator.validateResponse(registerErrorSchema, body, 'register error response');
  });

  test('POST /api/login - success', { tag: ['@auth', '@login', '@positive'] }, async () => {
    const context = await request.newContext({ baseURL });
    const res = await context.post('/api/login', {
      data: { username: 'testuser', password: '12345678' }
    });

    expect(res.status(), 'login success response status : 200').toBe(200);
    const body = await res.json();

    SchemaValidator.validateResponse(loginSuccessSchema, body);

    expect(body.success, 'login success response success : true').toBe(true);
    expect(body.token, 'login success response token : truthy').toBeTruthy();
    expect(typeof body.token, 'login success response token type : string').toBe('string');
  });

  test('POST /api/login - invalid password', { tag: ['@auth', '@login', '@negative'] }, async () => {
    const context = await request.newContext({ baseURL });
    const res = await context.post('/api/login', {
      data: { username: 'testuser', password: 'wrongpass' }
    });
    expect(res.status(), 'login error response status : 401').toBe(401);

    const body = await res.json();
    SchemaValidator.validateResponse(loginErrorSchema, body, 'login error response');
  });
});
