import router from './routes/router';
import myDropdown from './dropdown';

export class APIDataFetcher {
  constructor() {
    this.apiUrl = 'https://restcountries.com/v3.1/all';
    this.countriesContainer = document.createElement('div');
    this.spinnerElement = document.querySelector('.spinner');
    this.cardTemplate = document.querySelector('[data-card-template]');
    this.searchInput = document.querySelector('#search-input');
    this.countries = [];
  }

  async fetchData() {
    this.showSpinner();

    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();

      this.searchText();
      myDropdown.initialize();
      this.hideSpinner();

      return data;
    } catch (error) {
      console.error('Error:', error);
      this.hideSpinner();
    }
  }

  async fetchDataByRegion(region) {
    this.showSpinner();

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/region/${region}`
      );
      const data = await response.json();
      this.updateTargetElement(data);
      this.hideSpinner();
    } catch (error) {
      console.error('Error:', error);
      this.hideSpinner();
    }
  }

  searchText() {
    const searchContainer = document.querySelector('.search-input');
    const input = document.createElement('input');

    input.placeholder = 'Search for a country...';

    input.addEventListener('input', (e) => {
      const value = e.target.value.toLowerCase();
      this.countries.forEach((country) => {
        const isVisible = country.name.toLowerCase().includes(value);
        country.element.classList.toggle('hide', !isVisible);
      });
    });

    searchContainer.appendChild(input);
  }

  showSpinner() {
    this.spinnerElement.style.display = 'block';
  }

  hideSpinner() {
    this.spinnerElement.style.display = 'none';
    const container = document.querySelector('.spinner-container');
    container.style.display = 'none';
  }

  updateTargetElement(data) {
    this.countriesContainer.id = 'countries';
    this.countriesContainer.classList.add('countries-container');
    this.countriesContainer.classList.add('spacing');

    this.countries = data.map((countryData) => {
      const card = this.cardTemplate.content
        .cloneNode(true)
        .querySelector('.card');
      const img = card.querySelector('[data-img]');
      const title = card.querySelector('[data-title]');
      const population = card.querySelector('[data-population]');
      const region = card.querySelector('[data-region]');
      const capital = card.querySelector('[data-capital]');
      const anchor = card.querySelector('a');

      anchor.href = `/country/${countryData.name.common}`;

      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        router.urlRoute(e);
      });

      img.src = countryData.flags.svg;
      title.textContent =
        countryData.name.common.length > 20
          ? `${countryData.name.common.slice(0, 20)}...`
          : countryData.name.common;
      population.innerHTML = `<strong>Population</strong>: ${countryData.population.toLocaleString()}`;
      region.innerHTML = `<strong>Region</strong>: ${countryData.region}`;
      capital.innerHTML = `<strong>Capital</strong>: ${countryData.capital}`;

      this.countriesContainer.append(card);

      return { name: countryData.name.common, element: card };
    });

    // append countries to content div
    const existingCountriesContainer = document.getElementById('countries');
    if (existingCountriesContainer) {
      existingCountriesContainer.replaceWith(this.countriesContainer);
    } else {
      document.getElementById('content').appendChild(this.countriesContainer);
    }
  }
}

const dataFetcher = new APIDataFetcher();

export default dataFetcher;
