import { test as base, expect } from '@playwright/test';
import { ProfilePage } from '../../pages/ProfilePage';
import { apiBaseURL, isLoopback } from '../utils/registration';

export const originalProfile = {
  name: 'QA', lastName: 'Profile', phoneNumber: '0501234567', email: 'profile@example.invalid',
  birthDate: '1990-01-15T00:00:00', city: 'עיר בדיקה', street: 'רחוב בדיקה', houseNumber: 12, picture: '',
};
export type Profile = typeof originalProfile;
export interface ProfileState {
  user: Profile; authenticated: boolean; updates: Profile[]; uploads: number;
  failure?: '500' | 'network' | '401';
}
export const test = base.extend<{ profilePage: ProfilePage; profileState: ProfileState; network: void }>({
  profileState: async ({}, use) => { await use({ user: { ...originalProfile }, authenticated: true, updates: [], uploads: 0 }); },
  network: [async ({ context, baseURL, profileState: state }, use, testInfo) => {
    if (!baseURL || !isLoopback(baseURL)) throw new Error('Profile simulation requires a local frontend.');
    const unexpected: string[] = [];
    await context.route('**/*', async route => {
      const request = route.request();
      const url = new URL(request.url());
      const path = url.pathname.toLowerCase();
      const json = (body: unknown, status = 200) => route.fulfill({ status, json: body });
      if (url.origin === new URL(baseURL).origin && path === '/assets/json/citylists.txt')
        return json([{ city_name_he: originalProfile.city }, { city_name_he: 'עיר נוספת' }]);
      if (url.origin === new URL(baseURL).origin && path === '/assets/json/streetlists.txt')
        return json([{ City_Name: originalProfile.city, Street_Name: originalProfile.street },
          { City_Name: originalProfile.city, Street_Name: 'רחוב נוסף' }, { City_Name: 'עיר נוספת', Street_Name: 'רחוב אחר' }]);
      if (url.origin === new URL(apiBaseURL).origin) {
        if (path === '/api/users/user' && request.method() === 'GET') return json(state.authenticated ? state.user : {}, state.authenticated ? 200 : 401);
        if (path === '/api/users/user/update' && request.method() === 'PUT') {
          const body = request.postDataJSON() as Profile;
          state.updates.push(body);
          if (state.failure === 'network') return route.abort('failed');
          if (!state.authenticated || state.failure === '401') return json({}, 401);
          if (state.failure === '500') return json({}, 500);
          // Match UserUpdateDto / repository, including ignored email and empty strings.
          for (const key of ['name', 'lastName', 'phoneNumber', 'city', 'street'] as const) if (body[key]) state.user[key] = body[key];
          state.user.birthDate = body.birthDate;
          if (body.houseNumber) state.user.houseNumber = body.houseNumber;
          state.user.picture = body.picture;
          return json(state.user);
        }
        if (path === '/api/imageupload/uploadimage' && request.method() === 'POST') { state.uploads++; return json({ fileUrl: `${apiBaseURL}/uploads/qa.png` }); }
        if (request.method() === 'GET' && ['/api/users/getadvertisements', '/api/users/getfavorites', '/api/users/user/getlastsearches', '/api/users/user/getnotes', '/api/advertisement/getadvertisements'].includes(path)) return json([]);
        if (request.method() === 'GET' && path === '/api/users/user/userstatistics') return json({});
      }
      if (path.startsWith('/api/') || !['GET', 'HEAD'].includes(request.method())) { unexpected.push(`${request.method()} ${path}`); return route.abort('blockedbyclient'); }
      if (url.origin !== new URL(baseURL).origin) return route.abort('blockedbyclient');
      return route.continue();
    });
    await use();
    if (testInfo.status !== testInfo.expectedStatus) await testInfo.attach('synthetic-profile-state', {
      contentType: 'application/json', body: JSON.stringify(state),
    });
    expect(unexpected, 'No uncontrolled API calls or real mutations').toEqual([]);
  }, { auto: true }],
  profilePage: async ({ page, network }, use) => { await use(new ProfilePage(page)); },
});
export { expect } from '@playwright/test';
