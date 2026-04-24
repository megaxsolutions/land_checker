/**
 * Format a numeric price as a localised currency string.
 * e.g. 750000 -> "$750,000"
 */
export function formatPrice(price) {
  if (price == null || price === '') return 'Contact agent';
  const num = Number(price);
  if (isNaN(num)) return 'Contact agent';
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Build a single-line address string from a property object.
 * Falls back gracefully when fields are missing.
 */
export function formatAddress(property) {
  if (!property) return '';
  const parts = [
    property.street_address,
    property.suburb,
    property.state,
    property.postcode,
  ].filter(Boolean);

  if (parts.length) return parts.join(', ');
  return property.address || property.location || '';
}
