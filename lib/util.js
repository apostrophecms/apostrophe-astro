import sluggo from "sluggo";

/**
 * Apostrophe compatible slugify helper.
 * 
 * @param {string} text 
 * @returns 
 */
export function slugify(text) {
  return sluggo(text);
}
