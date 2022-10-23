import './css/styles.css';

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getRefs } from './js/getRefs';
import { debounce } from 'lodash';
import { fetchCountries } from './js/fetchCountries';

const refs = getRefs();

const DEBOUNCE_DELAY = 300;

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  clearMarkup();
  showLoader();
  const request = event.target.value.trim();

  if (!request) {
    Notify.warning('Invalid request. Please enter country.');
    hideLoader();
  } else {
    fetchCountries(request).then(onResult).catch(onError);
  }
}

function onResult(result) {
  if (result.length > 10) {
    Notify.info('Too many matches found. Please, enter a more specific name.');
    hideLoader();
  } else if (result.length > 1) {
    result.sort((firstCountry, secondCountry) =>
      firstCountry.name.official.localeCompare(secondCountry.name.official)
    );

    refs.listEl.innerHTML = showListCountries(result);
    hideLoader();
    handlerClikcsOnListCountries(result);
  } else {
    refs.listEl.innerHTML = showInfoCountry(result);
    hideLoader();
  }
}

function onError() {
  Notify.failure('Oops, there is no country with that name');
  hideLoader();
}

function handlerClikcsOnListCountries(arr) {
  const items = document.querySelector('.country-list');
  items.addEventListener('click', onClickItem);
  function onClickItem(event) {
    if (event.target.nodeName === 'UL') {
      return;
    }
    showLoader();

    let countryName = null;
    if (event.target.nodeName !== 'LI') {
      countryName = event.target.parentElement.dataset.name;
    } else {
      countryName = event.target.dataset.name;
    }
    const filteredCountry = arr.filter(
      country => country.name.official === countryName
    );
    refs.listEl.innerHTML = showInfoCountry(filteredCountry);
    hideLoader();
    items.removeEventListener('click', onClickItem);
  }
}

function hideLoader() {
  refs.loader.classList.add('is-hidden');
  refs.inputEl.focus();
}

function showLoader() {
  refs.loader.classList.remove('is-hidden');
  refs.inputEl.blur();
}

function clearMarkup() {
  refs.listEl.innerHTML = '';
  refs.infoEl.innerHTML = '';
}

function showListCountries(countriesArr) {
  return countriesArr
    .map(({ name, flags }) => {
      return `<li class="list-item" data-name="${name.official}">
      <img class = "list-item__image" src="${flags.svg}" alt="flag of ${name.official} width="15px"/>
      <p class = "list-item__name">${name.official}</p></li>`;
    })
    .join('');
}

function showInfoCountry(countryInfoArr) {
  return countryInfoArr
    .map(({ name, flags, capital, population, languages }) => {
      const langs = Object.values(languages).join(', ');
      return `<div class="country-info__header">
      <img class="country-info__image" src="${flags.svg}" alt="flag of ${name.official}" width="30px"/>
      <h2 class="country-info__name">${name.official}</h2></div>
      <p class="country-info__title"><span>Capital: </span>${capital}</p>
      <p class="country-info__title"><span>Population: </span>${population}</p>
      <p class="country-info__title"><span>Languages: </span>${langs}</p>`;
    })
    .join('');
}
