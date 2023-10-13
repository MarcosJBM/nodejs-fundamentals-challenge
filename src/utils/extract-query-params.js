/**
 * Extracts query parameters from a string, returning an object with the parameter and value
 * @param {string} query The string containing the query parameters
 * @returns An object with the extracted parameters
 */
export function extractQueryParams(query) {
  if (!query) return {};

  const arrayOfQueryParams = query.substring(1).split('&');

  const extractedQueryParams = arrayOfQueryParams.reduce(
    (queryParams, param) => {
      const [key, value] = param.split('=');

      queryParams[key] = value;

      return queryParams;
    },
    {},
  );

  return extractedQueryParams;
}
