/**
 * Pure business logic for Bawarchi Demo Website:
 * - IST (Asia/Kolkata) Open / Closed status calculation (including Friday 12:30 PM opening & past-midnight support)
 * - Menu filtering (Veg-only & search query)
 * - Contact form validation (Indian 10-digit mobile number, required fields, spam honeypot)
 * - Pre-filled WhatsApp & mailto link builders
 */

export interface HoursWindow {
  open: string;  // "HH:MM" in 24h format, e.g. "11:00" or "12:30"
  close: string; // "HH:MM" in 24h format, e.g. "23:30" or "01:30" (supports past-midnight)
}

export interface ScheduleConfig {
  regular: HoursWindow;
  friday: HoursWindow;
  timezone?: string;
}

export interface OpenStatusResult {
  isOpen: boolean;
  badgeText: 'Open Now' | 'Closed';
  statusSummary: string;
  istTimeFormatted: string;
  dayName: string;
}

export interface MenuItemData {
  id: string;
  name: string;
  type: 'V' | 'NV';
  price: number;
  badge?: string;
  description: string;
}

export interface MenuCategoryData {
  id: string;
  name: string;
  shortLabel: string;
  subtitle: string;
  timingBadge: string;
  items: MenuItemData[];
}

export interface ContactFormInput {
  name: string;
  phone: string;
  email?: string;
  orderOrMessage: string;
  preferredChannel: 'whatsapp' | 'email';
  honeypot?: string; // Spam trap field — must remain empty
}

export interface ContactValidationResult {
  isValid: boolean;
  isSpam: boolean;
  cleanedPhone: string;
  errors: {
    name?: string;
    phone?: string;
    email?: string;
    orderOrMessage?: string;
  };
}

export const DEFAULT_SCHEDULE: ScheduleConfig = {
  regular: { open: '11:00', close: '23:30' },
  friday: { open: '12:30', close: '23:30' },
  timezone: 'Asia/Kolkata',
};

function parseMinutes(hhmm: string): number {
  const [hStr, mStr] = hhmm.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
}

function format12Hour(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Extracts IST (Asia/Kolkata) weekday, hour, and minute from any Date instance.
 */
export function getISTParts(date: Date = new Date()): {
  weekdayIndex: number; // 0 = Sunday ... 5 = Friday, 6 = Saturday
  dayName: string;
  hour: number;
  minute: number;
  totalMinutes: number;
} {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(date);
    const weekday = parts.find((p) => p.type === 'weekday')?.value || 'Monday';
    const hourRaw = Number(parts.find((p) => p.type === 'hour')?.value || '0');
    const hour = hourRaw === 24 ? 0 : hourRaw;
    const minute = Number(parts.find((p) => p.type === 'minute')?.value || '0');

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdayIndex = Math.max(0, days.indexOf(weekday));

    return {
      weekdayIndex,
      dayName: weekday,
      hour,
      minute,
      totalMinutes: hour * 60 + minute,
    };
  } catch {
    // Fallback using manual UTC + 5:30 offset if Intl timeZone fails on older engines
    const utcMs = date.getTime() + date.getTimezoneOffset() * 60000;
    const istDate = new Date(utcMs + 5.5 * 3600000);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdayIndex = istDate.getDay();
    const hour = istDate.getHours();
    const minute = istDate.getMinutes();
    return {
      weekdayIndex,
      dayName: days[weekdayIndex],
      hour,
      minute,
      totalMinutes: hour * 60 + minute,
    };
  }
}

/**
 * Checks if a given time in minutes falls inside a window, including windows that cross midnight.
 */
function isWithinWindow(currentMinutes: number, window: HoursWindow): boolean {
  const openMin = parseMinutes(window.open);
  const closeMin = parseMinutes(window.close);

  if (closeMin > openMin) {
    return currentMinutes >= openMin && currentMinutes < closeMin;
  }
  // Crosses midnight (e.g., 11:00 to 01:30)
  return currentMinutes >= openMin || currentMinutes < closeMin;
}

/**
 * Calculates whether Bawarchi is currently Open or Closed in IST (Asia/Kolkata),
 * properly handling Friday's 12:30 PM opening and past-midnight closing windows.
 */
export function getOpenStatus(
  now: Date = new Date(),
  schedule: ScheduleConfig = DEFAULT_SCHEDULE
): OpenStatusResult {
  const { weekdayIndex, dayName, hour, minute, totalMinutes } = getISTParts(now);

  const isFriday = weekdayIndex === 5;
  const todayWindow = isFriday ? schedule.friday : schedule.regular;

  // Also check if yesterday's window spilled past midnight into early morning today
  const yesterdayWasFriday = weekdayIndex === 6; // Saturday early morning -> yesterday was Friday
  const yesterdayWindow = yesterdayWasFriday ? schedule.friday : schedule.regular;
  const yesterdayCloseMin = parseMinutes(yesterdayWindow.close);
  const yesterdayOpenMin = parseMinutes(yesterdayWindow.open);
  const spilledFromYesterday =
    yesterdayCloseMin <= yesterdayOpenMin && totalMinutes < yesterdayCloseMin;

  const openNow = spilledFromYesterday || isWithinWindow(totalMinutes, todayWindow);

  const istTimeFormatted = format12Hour(
    `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  );

  let statusSummary = '';
  if (openNow) {
    statusSummary = `Open till ${format12Hour(todayWindow.close)} IST`;
  } else {
    const todayOpenMin = parseMinutes(todayWindow.open);
    if (totalMinutes < todayOpenMin) {
      statusSummary = isFriday
        ? `Opens today (Fri) at ${format12Hour(todayWindow.open)} IST`
        : `Opens today at ${format12Hour(todayWindow.open)} IST`;
    } else {
      // Closed for the night; check tomorrow's opening
      const tomorrowIsFriday = weekdayIndex === 4; // Thursday night -> Friday tomorrow
      const tomorrowWindow = tomorrowIsFriday ? schedule.friday : schedule.regular;
      statusSummary = `Opens tomorrow at ${format12Hour(tomorrowWindow.open)} IST`;
    }
  }

  return {
    isOpen: openNow,
    badgeText: openNow ? 'Open Now' : 'Closed',
    statusSummary,
    istTimeFormatted,
    dayName,
  };
}

/**
 * Filters menu categories and items by vegOnly toggle and optional search text.
 */
export function filterMenuCategories(
  categories: MenuCategoryData[],
  options: { vegOnly?: boolean; searchQuery?: string } = {}
): MenuCategoryData[] {
  const { vegOnly = false, searchQuery = '' } = options;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return categories
    .map((category) => {
      const filteredItems = category.items.filter((item) => {
        if (vegOnly && item.type !== 'V') {
          return false;
        }
        if (normalizedQuery) {
          const matchesName = item.name.toLowerCase().includes(normalizedQuery);
          const matchesDesc = item.description.toLowerCase().includes(normalizedQuery);
          const matchesCat = category.name.toLowerCase().includes(normalizedQuery);
          return matchesName || matchesDesc || matchesCat;
        }
        return true;
      });

      return {
        ...category,
        items: filteredItems,
      };
    })
    .filter((cat) => cat.items.length > 0);
}

/**
 * Normalizes and validates an Indian 10-digit mobile number.
 * Accepts optional "+91", "91", or "0" prefix and spaces/hyphens.
 */
export function cleanIndianMobile(rawPhone: string): string {
  const digitsOnly = rawPhone.replace(/\D/g, '');
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly.slice(2);
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return digitsOnly.slice(1);
  }
  return digitsOnly;
}

export function isValidIndianMobile(rawPhone: string): boolean {
  const cleaned = cleanIndianMobile(rawPhone);
  return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Validates the Contact / Quick Order form with friendly inline error messages and honeypot check.
 */
export function validateContactForm(input: ContactFormInput): ContactValidationResult {
  const isSpam = Boolean(input.honeypot && input.honeypot.trim().length > 0);
  const errors: ContactValidationResult['errors'] = {};

  const trimmedName = (input.name || '').trim();
  if (!trimmedName) {
    errors.name = 'Please enter your name so we know who to address.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  }

  const cleanedPhone = cleanIndianMobile(input.phone || '');
  if (!input.phone || !input.phone.trim()) {
    errors.phone = 'Please enter your 10-digit Indian mobile number.';
  } else if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).';
  }

  if (input.email && input.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.email.trim())) {
      errors.email = 'Please enter a valid email address or leave it blank.';
    }
  }

  const trimmedMsg = (input.orderOrMessage || '').trim();
  if (!trimmedMsg) {
    errors.orderOrMessage = 'Please share your order items or enquiry details.';
  } else if (trimmedMsg.length < 5) {
    errors.orderOrMessage = 'Please add a few more words (at least 5 characters).';
  }

  const isValid = !isSpam && Object.keys(errors).length === 0;

  return {
    isValid,
    isSpam,
    cleanedPhone,
    errors,
  };
}

/**
 * Builds the required wa.me URL with pre-filled text: "Hi Bawarchi, I'd like to order: "
 */
export function buildWhatsAppOrderUrl(
  whatsappNumber: string = '919876543210',
  dishSuffix: string = ''
): string {
  const baseMessage = `Hi Bawarchi, I'd like to order: ${dishSuffix}`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(baseMessage)}`;
}

/**
 * Builds a pre-filled WhatsApp URL from the validated contact form.
 */
export function buildContactWhatsAppUrl(
  whatsappNumber: string,
  form: ContactFormInput
): string {
  const cleanedPhone = cleanIndianMobile(form.phone);
  const lines = [
    `Hi Bawarchi, I'd like to order: ${form.orderOrMessage.trim()}`,
    `Name: ${form.name.trim()}`,
    `Mobile: +91 ${cleanedPhone}`,
  ];
  if (form.email && form.email.trim()) {
    lines.push(`Email: ${form.email.trim()}`);
  }
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Builds a pre-filled mailto: URL from the validated contact form.
 */
export function buildContactMailtoUrl(emailTo: string, form: ContactFormInput): string {
  const cleanedPhone = cleanIndianMobile(form.phone);
  const subject = `Order / Enquiry from ${form.name.trim()} (+91 ${cleanedPhone})`;
  const body = [
    `Hi Bawarchi Team,`,
    ``,
    `Order / Message:`,
    form.orderOrMessage.trim(),
    ``,
    `Customer Details:`,
    `Name: ${form.name.trim()}`,
    `Mobile: +91 ${cleanedPhone}`,
    form.email?.trim() ? `Email: ${form.email.trim()}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `mailto:${emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
