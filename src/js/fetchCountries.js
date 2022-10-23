const API_URL_ENDPOINTS = 'https://restcountries.com/v3.1/name/';
const searchParams = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

export function fetchCountries(name) {
  const queryUrl = `${API_URL_ENDPOINTS}${name}?${searchParams}`;
  return fetch(queryUrl).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
