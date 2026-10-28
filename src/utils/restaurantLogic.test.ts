import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getOpenStatus,
  filterMenuCategories,
  validateContactForm,
  isValidIndianMobile,
  buildWhatsAppOrderUrl,
  MenuCategoryData,
} from './restaurantLogic';

test('IST Open/Closed calculation handles regular days and Friday 12:30 PM opening', () => {
  // Wednesday 11:15 AM IST -> 05:45 UTC -> Should be Open
  const wedMorning = new Date('2026-10-28T05:45:00Z');
  const wedStatus = getOpenStatus(wedMorning);
  assert.equal(wedStatus.dayName, 'Wednesday');
  assert.equal(wedStatus.isOpen, true);
  assert.equal(wedStatus.badgeText, 'Open Now');

  // Friday 11:30 AM IST -> 06:00 UTC -> Should be Closed (Fridays open from 12:30 PM)
  const friMorning = new Date('2026-10-30T06:00:00Z');
  const friMorningStatus = getOpenStatus(friMorning);
  assert.equal(friMorningStatus.dayName, 'Friday');
  assert.equal(friMorningStatus.isOpen, false);
  assert.equal(friMorningStatus.badgeText, 'Closed');
  assert.match(friMorningStatus.statusSummary, /12:30 PM/);

  // Friday 1:00 PM IST -> 07:30 UTC -> Should be Open
  const friAfternoon = new Date('2026-10-30T07:30:00Z');
  const friAfternoonStatus = getOpenStatus(friAfternoon);
  assert.equal(friAfternoonStatus.isOpen, true);
  assert.equal(friAfternoonStatus.badgeText, 'Open Now');

  // Wednesday 11:45 PM IST -> 18:15 UTC -> Should be Closed (closes at 11:30 PM)
  const wedLateNight = new Date('2026-10-28T18:15:00Z');
  const wedLateStatus = getOpenStatus(wedLateNight);
  assert.equal(wedLateStatus.isOpen, false);
  assert.equal(wedLateStatus.badgeText, 'Closed');
});

test('IST Open/Closed calculation supports closing past midnight', () => {
  const pastMidnightSchedule = {
    regular: { open: '11:00', close: '01:00' },
    friday: { open: '12:30', close: '01:00' },
  };
  // Thursday 12:30 AM IST (early morning spillover from Wednesday night) -> Wednesday 19:00 UTC
  const thuEarlyMorning = new Date('2026-10-28T19:00:00Z');
  const status = getOpenStatus(thuEarlyMorning, pastMidnightSchedule);
  assert.equal(status.isOpen, true);
});

test('Menu Veg-only filter hides all NV items and preserves V items', () => {
  const sampleCategories: MenuCategoryData[] = [
    {
      id: 'cat-biryani',
      name: 'Biryani',
      shortLabel: 'Biryani',
      subtitle: 'Dum Biryani',
      timingBadge: 'All Day',
      items: [
        { id: '1', name: 'Chicken Dum Biryani', type: 'NV', price: 180, description: 'Chicken' },
        { id: '2', name: 'Veg Biryani', type: 'V', price: 120, description: 'Veg' },
      ],
    },
  ];

  const allResult = filterMenuCategories(sampleCategories, { vegOnly: false });
  assert.equal(allResult[0].items.length, 2);

  const vegResult = filterMenuCategories(sampleCategories, { vegOnly: true });
  assert.equal(vegResult[0].items.length, 1);
  assert.equal(vegResult[0].items[0].name, 'Veg Biryani');
});

test('Contact form validation checks 10-digit Indian mobile, required fields, and honeypot', () => {
  assert.equal(isValidIndianMobile('9876543210'), true);
  assert.equal(isValidIndianMobile('+91 98765 43210'), true);
  assert.equal(isValidIndianMobile('1234567890'), false);
  assert.equal(isValidIndianMobile('98765'), false);

  const invalidResult = validateContactForm({
    name: '',
    phone: '12345',
    orderOrMessage: '',
    preferredChannel: 'whatsapp',
    honeypot: '',
  });
  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.name);
  assert.ok(invalidResult.errors.phone);
  assert.ok(invalidResult.errors.orderOrMessage);

  const validResult = validateContactForm({
    name: 'Karthik',
    phone: '+91 98765 43210',
    orderOrMessage: '2x Chicken Dum Biryani, 1x Chicken 65',
    preferredChannel: 'whatsapp',
    honeypot: '',
  });
  assert.equal(validResult.isValid, true);
  assert.equal(validResult.cleanedPhone, '9876543210');

  const spamResult = validateContactForm({
    name: 'Bot',
    phone: '9876543210',
    orderOrMessage: 'Spam message here',
    preferredChannel: 'whatsapp',
    honeypot: 'http://spambot.example.com',
  });
  assert.equal(spamResult.isValid, false);
  assert.equal(spamResult.isSpam, true);
});

test('WhatsApp order link uses exact pre-filled message format', () => {
  const url = buildWhatsAppOrderUrl('919876543210', '');
  assert.equal(
    url,
    "https://wa.me/919876543210?text=Hi%20Bawarchi%2C%20I'd%20like%20to%20order%3A%20"
  );
});
