import { test, expect } from '../../fixtures/ad-creation.fixture';

for (const rooms of ['3', '3.5', '12.5']) {
  test(`creation submits the selected ${rooms} rooms without changing it`, async ({ ad, state, page }) => {
    await ad.open();
    await ad.toDetails();
    await ad.choose(3, 'rooms', rooms);
    await ad.next(3);
    await ad.back(4);
    await expect(ad.field('rooms')).toContainText(rooms);
    await ad.next(3);
    await ad.payment();
    await ad.next(4);
    await ad.next(5);
    await ad.consent();
    await ad.next(6);
    expect(state.submissions).toEqual([]);
    await ad.publishFree();
    await expect.poll(() => state.submissions.length).toBe(1);
    expect(state.submissions[0].rooms).toBe(rooms);
    await expect(page).toHaveURL(/confirmation-modal$/);
  });
}
