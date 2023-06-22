import dataFetcher from '../renderCountries';
import countryList from 'country-list';
import iso from 'iso-3166-1';

class Router {
  constructor() {
    this.urlRoutes = {
      404: {
        template: '/templates/404.html',
      },
      '/': {
        template: '/templates/index.html',
      },
      '/country/:id': {
        template: '/templates/country.html',
      },
    };
  }
  async urlRoute(event) {
    event.preventDefault();

    window.history.pushState({}, '', event.currentTarget.href);
    await this.urlLocationHandler();

    window.onpopstate = async () => {
      await this.urlLocationHandler();
    };
  }

  async urlLocationHandler() {
    let location = window.location.pathname;
    if (location.length === 0) {
      location = '/';
    }

    // Check if the location matches a route with a dynamic ID
    const dynamicRoute = Object.keys(this.urlRoutes).find((route) => {
      const routeParts = route.split('/');
      const locationParts = location.split('/');
      return (
        routeParts.length === locationParts.length &&
        routeParts.every(
          (part, index) => part === locationParts[index] || part.startsWith(':')
        )
      );
    });

    if (location.includes('country')) {
      const route = this.urlRoutes[dynamicRoute] || this.urlRoutes[404];
      const id = this.extractIdFromPath(location, dynamicRoute);

      const html = await fetch(route.template).then((response) =>
        response.text()
      );
      await this.processTemplate(html, id); // Add 'await' here
      dataFetcher.hideSpinner();
    } else if (location === '/') {
      const route = this.urlRoutes[location] || this.urlRoutes[404];
      const html = await fetch(route.template).then((response) =>
        response.text()
      );
      document.getElementById('content').innerHTML = html;

      const data = await dataFetcher.fetchData();
      await dataFetcher.updateTargetElement(data);
    }
  }

  extractIdFromPath(location, dynamicRoute) {
    if (dynamicRoute) {
      const routeParts = dynamicRoute.split('/');
      const locationParts = location.split('/');
      const idIndex = routeParts.findIndex((part) => part.startsWith(':'));
      return locationParts[idIndex];
    }
    return locationParts[locationParts.length - 1];
  }

  attachBackButtonListener() {
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
      history.back();
    });
  }

  async processTemplate(html, id) {
    try {
      const data = await this.fetchCountryData(id);

      const countryHTML = data.map((country) => {
        const countryCurrencies = country.currencies
          ? Object.entries(country.currencies)[0]
          : 'undefined';
        const nativeName = country.name.nativeName
          ? Object.entries(country.name.nativeName)[
              Object.entries(country.name.nativeName).length - 1
            ][1].common
          : country.name.official;
        const languages = country.languages
          ? Object.values(country.languages).join(', ')
          : 'undefined';

        const countriesBorders = country.borders
          ? country.borders.map((country) => {
              const countryData = iso.whereAlpha3(country);
              return countryData
                ? `<span class='borders'>${countryData.country}</span>`
                : '';
            })
          : null;

        return `
        <div class="country-page">
          <div class="backk-btn">
            <button id="back-button">
              <i class="fa-solid fa-arrow-left"></i>
                Back
            </button>
          </div>
          <section class="country-container">
            <div class="img-wrapper">
                <img src="${country.flags.svg}" alt="">
            </div>
            <div class="country-info-wrapper">
                <div class="info-container">
                  <section class="country-title">
                      <h1>${country.name.common}</h1>
                  </section>
                  <section class="more-info">
                      <div class="flex-column">
                        <span>
                        <strong>Native Name: </strong>${nativeName}</span>
                        <span><strong>Population: </strong>${country.population.toLocaleString()}</span>
                        <span><strong>Region: </strong>${country.region}</span>
                        <span><strong>Sub Region: </strong>${
                          country.subregion
                        }</span>
                        <span><strong>Capital: </strong>${
                          country.capital
                        }</span>
                      </div>
                      <div class="flex-column">
                        <span><strong>Top Level Domain: </strong>${country.tld.join(
                          ' / '
                        )}</span>
                        <span><strong>Currencies: </strong>${
                          countryCurrencies[1].name
                        }</span>
                        <span><strong>Languages: </strong>${languages}</span>
                      </div>
                  </section>
                </div>
                <section class="Border-countries">
                    <strong>Border Countries: </strong>${
                      countriesBorders
                        ? countriesBorders?.join('')
                        : 'undefined'
                    }
                </section>
            </div>
          </section>
        </div>
        `;
      });

      html = countryHTML.join('');
      document.getElementById('content').innerHTML = html;
      this.attachBackButtonListener();
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }

  async fetchCountryData(id) {
    const url = `https://restcountries.com/v3.1/name/${id}?fullText=true`;

    try {
      const reponse = await fetch(url);
      const data = await reponse.json();

      return data;
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }

  async init() {
    await this.urlLocationHandler();
  }
}

const router = new Router();

export default router;
