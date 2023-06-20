import router from './routes/router';

export class APIDataFetcher {
  constructor() {
    this.apiUrl = 'https://restcountries.com/v3.1/all';
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

      await this.searchText();
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

  async searchText() {
    //not working as exected fix...
    while (!this.searchInput) {
      this.searchInput = document.querySelector('#search-input');
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    this.searchInput.addEventListener('input', (e) => {
      const value = e.target.value.toLowerCase();
      this.countries.forEach((country) => {
        const isVisible = country.name.toLowerCase().includes(value);
        country.element.classList.toggle('hide', !isVisible);
      });
    });
  }

  showSpinner() {
    this.spinnerElement.style.display = 'block';
  }

  hideSpinner() {
    this.spinnerElement.style.display = 'none';
  }

  async updateTargetElement(data) {
    const countriesContainer = document.createElement('div');
    countriesContainer.id = 'countries';
    countriesContainer.classList.add('countries-container');
    countriesContainer.classList.add('spacing');

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
      title.textContent = countryData.name.common;
      population.innerHTML = `<strong>Population</strong>: ${countryData.population.toLocaleString()}`;
      region.innerHTML = `<strong>Region</strong>: ${countryData.region}`;
      capital.innerHTML = `<strong>Capital</strong>: ${countryData.capital}`;

      countriesContainer.append(card);

      return { name: countryData.name.common, element: card };
    });

    const existingCountriesContainer = document.getElementById('countries');
    if (existingCountriesContainer) {
      existingCountriesContainer.replaceWith(countriesContainer);
    } else {
      document.getElementById('content').appendChild(countriesContainer);
    }
  }
}

const dataFetcher = new APIDataFetcher();

export default dataFetcher;
