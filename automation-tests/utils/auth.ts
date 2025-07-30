// utils/auth.ts
import { APIRequestContext } from '@playwright/test';

export async function loginAndGetToken(apiContext: APIRequestContext): Promise<string> {
    const loginResponse = await apiContext.post('/api/login', {
        data: {
            username: 'testuser',
            password: '12345678'
        }
    });

    if (loginResponse.status() !== 200) {
        throw new Error(`Login failed: ${loginResponse.status()}`);
    }

    const responseBody = await loginResponse.json();
    return responseBody.token;
}
