/**
 * Converts a string into a URL-friendly slug, properly handling accented characters.
 * Example: "Steak Haché Végétal" -> "steak-hache-vegetal"
 */
export function slugify(text: string): string {
  if (!text) return 'product';

  return text
    .toString()
    .normalize('NFD')                   // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '')    // remove all the accents/diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')       // remove non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, '-')              // replace spaces with hyphens
    .replace(/-+/g, '-')                // remove consecutive hyphens
    .replace(/^-+/, '')                 // remove leading hyphen
    .replace(/-+$/, '');                // remove trailing hyphen
}
