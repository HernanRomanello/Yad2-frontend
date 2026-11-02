import { test as base, expect } from '@playwright/test';
import { AdCreationPage } from '../../pages/AdCreationPage';
import { apiBaseURL, isLoopback } from '../utils/registration';

export interface AdState {
  submissions: Record<string, unknown>[]; uploads: number; authenticated: boolean;
  failure?: '500' | 'network'; uploadFailure?: boolean;
}
export const test = base.extend<{ ad: AdCreationPage; state: AdState; safeNetwork: void }>({
  state: async ({}, use) => use({ submissions: [], uploads: 0, authenticated: true }),
  safeNetwork: [async ({ context, baseURL, state }, use) => {
    if (!baseURL || !isLoopback(baseURL)) throw new Error('Ad tests require a loopback frontend.');
    const unexpected: string[] = [];
    await context.route('**/*', async route => {
      const req = route.request(); const url = new URL(req.url()); const path = url.pathname.toLowerCase();
      const json = (body: unknown, status = 200) => route.fulfill({ status, json: body });
      if (url.origin === new URL(baseURL).origin && path === '/assets/json/citylists.txt') return json([{ city_name_he: 'עיר בדיקה' }]);
      if (url.origin === new URL(baseURL).origin && path === '/assets/json/streetlists.txt') return json([{ City_Name: 'עיר בדיקה', Street_Name: 'רחוב בדיקה' }]);
      if (url.origin === new URL(apiBaseURL).origin) {
        if (path === '/api/users/user/userstatistics' && req.method() === 'GET') return json({});
        if (path === '/api/users/user' && req.method() === 'GET') return json(state.authenticated ? { name: 'QA', phoneNumber: '0501234567', email: 'qa@example.invalid' } : {}, state.authenticated ? 200 : 401);
        if (path === '/api/users/createadvertisement' && req.method() === 'POST') {
          state.submissions.push(req.postDataJSON());
          if (state.failure === 'network') return route.abort('failed');
          return json({}, state.failure === '500' ? 500 : 200);
        }
        if (path === '/api/imageupload/uploadimage' && req.method() === 'POST') {
          state.uploads++;
          if (state.uploadFailure) return route.abort('failed');
          return json({ fileUrl: `${baseURL}/assets/images/ad1.jpg` });
        }
        if (req.method() === 'GET' && ['/api/advertisement/getadvertisements', '/api/users/getadvertisements', '/api/users/getfavorites', '/api/users/user/getlastsearches', '/api/users/user/getnotes'].includes(path)) return json([]);
      }
      if (path.startsWith('/api/') || !['GET', 'HEAD'].includes(req.method())) { unexpected.push(`${req.method()} ${path}`); return route.abort('blockedbyclient'); }
      if (url.origin !== new URL(baseURL).origin) return route.abort('blockedbyclient');
      return route.continue();
    });
    await use();
    expect(unexpected, 'No unhandled API calls or real writes').toEqual([]);
  }, { auto: true }],
  ad: async ({ page, safeNetwork }, use) => use(new AdCreationPage(page)),
});
export { expect };
