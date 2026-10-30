import { test, expect } from '../../fixtures/favorites.fixture';

test.describe('Favorites UI — isolated stateful API simulation', () => {
  test('FAV-001 adds a search result and displays its identity in Favorites', async ({
    favoritesPage: ui,
    favoritesState: state,
  }) => {
    await ui.openSearch();
    await expect(ui.favoriteIcon(101)).toHaveAttribute(
      'fonticon',
      'favorite_border',
    );
    await ui.addToFavorites(101);
    await expect(ui.favoriteIcon(101)).toHaveAttribute('fonticon', 'favorite');
    expect([...state.ids]).toEqual([101]);
    expect(state.updates).toEqual([101]);
    await ui.openFavoritesPage();
    await expect(ui.card(101)).toHaveCount(1);
    await expect(ui.cards).toHaveCount(1);
  });

  test('FAV-002 removes an existing favorite without affecting another', async ({
    favoritesPage: ui,
    favoritesState: state,
  }) => {
    state.ids = new Set([101, 102]);
    await ui.openSearch();
    await expect(ui.favoriteIcon(101)).toHaveAttribute('fonticon', 'favorite');
    await ui.removeFromFavorites(101);
    await expect(ui.favoriteIcon(101)).toHaveAttribute(
      'fonticon',
      'favorite_border',
    );
    expect([...state.ids]).toEqual([102]);
    await ui.openFavoritesPage();
    await expect(ui.card(101)).toHaveCount(0);
    await expect(ui.card(102)).toHaveCount(1);
  });

  test('FAV-003 saved state survives search refresh', async ({
    favoritesPage: ui,
  }) => {
    await ui.openSearch();
    await ui.addToFavorites(101);
    await expect(ui.favoriteIcon(101)).toHaveAttribute('fonticon', 'favorite');
    await ui.refresh();
    await expect(ui.favoriteIcon(101)).toHaveAttribute('fonticon', 'favorite');
    await ui.openFavoritesPage();
    await expect(ui.card(101)).toHaveCount(1);
  });

  test('FAV-004 saved state survives UI logout and login', async ({
    favoritesPage: ui,
    homePage,
    loginPage,
  }) => {
    test.skip(
      test.info().project.name.startsWith('mobile'),
      'Existing HomePage logout menu supports desktop only.',
    );
    await ui.openSearch();
    await ui.addToFavorites(101);
    await expect(ui.favoriteIcon(101)).toHaveAttribute('fonticon', 'favorite');
    await homePage.logout();
    await loginPage.fill(
      'favorites@example.invalid',
      'Synthetic-only-password1!',
    );
    await loginPage.submit();
    await expect(ui.favoriteIcon(101)).toHaveAttribute('fonticon', 'favorite');
    await ui.openFavoritesPage();
    await expect(ui.card(101)).toHaveCount(1);
  });

  test('FAV-005 saves multiple distinct properties exactly once', async ({
    favoritesPage: ui,
    favoritesState: state,
  }) => {
    await ui.openSearch();
    for (const id of [101, 102, 103]) {
      await ui.addToFavorites(id);
      await expect(ui.favoriteIcon(id)).toHaveAttribute('fonticon', 'favorite');
    }
    expect([...state.ids].sort()).toEqual([101, 102, 103]);
    await ui.openFavoritesPage();
    await expect(ui.cards).toHaveCount(3);
    for (const id of [101, 102, 103]) await expect(ui.card(id)).toHaveCount(1);
    await ui.openSavedProperty(102);
    await expect(ui.page).toHaveURL(/\/advertisement\/102$/);
  });

  test('FAV-006 synchronizes search, details and Favorites after removal', async ({
    favoritesPage: ui,
    favoritesState: state,
  }) => {
    await ui.openSearch();
    await ui.addToFavorites(101);
    await expect(ui.favoriteIcon(101)).toHaveAttribute('fonticon', 'favorite');
    await ui.openProperty(101);
    await expect(ui.detailIcon).toBeVisible();
    await ui.toggleFromDetails();
    await expect(ui.detailIcon).toHaveCount(0);
    expect([...state.ids]).toEqual([]);
    await ui.openSearch();
    await expect(ui.favoriteIcon(101)).toHaveAttribute(
      'fonticon',
      'favorite_border',
    );
    await ui.openFavoritesPage();
    await expect(ui.cards).toHaveCount(0);
  });

  test('FAV-007 anonymous click receives 401 and does not persist', async ({
    favoritesPage: ui,
    favoritesState: state,
  }) => {
    state.authenticated = false;
    await ui.openSearch();
    const response = ui.page.waitForResponse((r) =>
      r.url().includes('/updateFavorite/101'),
    );
    await ui.addToFavorites(101);
    expect((await response).status()).toBe(401);
    await expect(ui.favoriteIcon(101)).toHaveAttribute(
      'fonticon',
      'favorite_border',
    );
    expect([...state.ids]).toEqual([]);
  });

  test('FAV-008 direct anonymous Favorites navigation redirects to login', async ({
    favoritesPage: ui,
    favoritesState: state,
    loginPage,
  }) => {
    state.authenticated = false;
    await ui.visitFavoritesDirectly();
    await expect(ui.page).toHaveURL(/\/login$/);
    await expect(loginPage.submitButton).toBeVisible();
    await expect(ui.root).toHaveCount(0);
    expect(state.updates).toEqual([]);
  });

  test('FAV-009 repeated saves follow toggle semantics without duplicate cards', async ({
    favoritesPage: ui,
    favoritesState: state,
  }) => {
    await ui.openSearch();
    for (const selected of [true, false, true]) {
      await ui.addToFavorites(101);
      await expect(ui.favoriteIcon(101)).toHaveAttribute(
        'fonticon',
        selected ? 'favorite' : 'favorite_border',
      );
    }
    expect(state.updates).toEqual([101, 101, 101]);
    await ui.openFavoritesPage();
    await expect(ui.card(101)).toHaveCount(1);
  });

  test('FAV-012 empty Favorites renders no stale property cards', async ({
    favoritesPage: ui,
  }) => {
    await ui.openSearch();
    await expect(ui.favoriteIcon(101)).toHaveAttribute(
      'fonticon',
      'favorite_border',
    );
    await ui.openFavoritesPage();
    await expect(ui.root).toBeVisible();
    await expect(ui.cards).toHaveCount(0);
  });

  for (const failure of ['500', 'network', '401'] as const) {
    test(`FAV-013-${failure} failed save does not show success or alter stored favorites`, async ({
      favoritesPage: ui,
      favoritesState: state,
    }) => {
      state.ids.add(102);
      await ui.openSearch();
      await expect(ui.favoriteIcon(102)).toHaveAttribute(
        'fonticon',
        'favorite',
      );
      state.failure = failure;
      const completed =
        failure === 'network'
          ? ui.page.waitForEvent('requestfailed', (r) =>
              r.url().includes('/updateFavorite/101'),
            )
          : ui.page.waitForResponse((r) =>
              r.url().includes('/updateFavorite/101'),
            );
      await ui.addToFavorites(101);
      await completed;
      await expect(ui.favoriteIcon(101)).toHaveAttribute(
        'fonticon',
        'favorite_border',
      );
      expect([...state.ids]).toEqual([102]);
      if (failure === '401')
        await expect(ui.favoriteIcon(102)).toHaveAttribute(
          'fonticon',
          'favorite_border',
        );
    });
  }

  test('FAV-014 rapid double click sends two toggles and restores unsaved state', async ({
    favoritesPage: ui,
    favoritesState: state,
  }) => {
    await ui.openSearch();
    await ui.rapidToggle(101);
    await expect.poll(() => state.updates.length).toBe(2);
    await expect(ui.favoriteIcon(101)).toHaveAttribute(
      'fonticon',
      'favorite_border',
    );
    expect([...state.ids]).toEqual([]);
    await ui.openFavoritesPage();
    await expect(ui.cards).toHaveCount(0);
  });

  test('FAV-015 navigation during a pending save eventually synchronizes details', async ({
    favoritesPage: ui,
    context,
    favoritesState: state,
  }) => {
    await ui.openSearch();
    await expect(ui.favoriteIcon(101)).toHaveAttribute(
      'fonticon',
      'favorite_border',
    );
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    await context.route(
      '**/api/Users/user/updateFavorite/101',
      async (route) => {
        await gate;
        await route.fallback();
      },
    );
    try {
      const pending = ui.page.waitForRequest((r) =>
        r.url().includes('/updateFavorite/101'),
      );
      await ui.addToFavorites(101);
      await pending;
      expect([...state.ids]).toEqual([]);
      await ui.openProperty(101);
      await expect(ui.detailControl).toBeVisible();
      await expect(ui.detailIcon).toHaveCount(0);
    } finally {
      release();
    }
    await expect(ui.detailIcon).toBeVisible();
    expect([...state.ids]).toEqual([101]);
  });

  for (const body of ['null', '{broken-json']) {
    test(`FAV-016-${body === 'null' ? 'null' : 'malformed'} recovers saved state after invalid read response and refresh`, async ({
      favoritesPage: ui,
      context,
      favoritesState: state,
    }) => {
      await ui.openSearch();
      await expect(ui.favoriteIcon(101)).toHaveAttribute(
        'fonticon',
        'favorite_border',
      );
      await context.route(
        '**/api/Users/GetFavorites',
        (route) =>
          route.fulfill({
            contentType: 'application/json',
            body,
          }),
        { times: 1 },
      );
      const read = ui.page.waitForResponse((r) =>
        r.url().endsWith('/GetFavorites'),
      );
      await ui.addToFavorites(101);
      expect((await read).status()).toBe(200);
      expect([...state.ids]).toEqual([101]);
      await ui.refresh();
      await expect(ui.favoriteIcon(101)).toHaveAttribute(
        'fonticon',
        'favorite',
      );
      await ui.openFavoritesPage();
      await expect(ui.card(101)).toHaveCount(1);
    });
  }

  // test('FAV-017 authenticated direct Favorites navigation retains access', async ({ favoritesPage: ui, favoritesState: state }) => {
  //   state.ids.add(101);
  //   await ui.openSearch();
  //   await expect(ui.favoriteIcon(101)).toHaveAttribute('fonticon', 'favorite');
  //   await ui.visitFavoritesDirectly();
  //   await expect(ui.page).toHaveURL(/\/favorites$/);
  //   await expect(ui.card(101)).toHaveCount(1);
  // });
});
