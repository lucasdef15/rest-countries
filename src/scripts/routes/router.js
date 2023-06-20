import dataFetcher from '../renderCountries';
import darkMode from '../darkMode.js';

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
    // event = event || window.event;
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
      this.processTemplate(html, id);
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
    return locationParts[404];
  }

  async processTemplate(html, id) {
    try {
      const data = await this.fetchCountryData(id);
      const countryHTML = data.map((country) => {
        return `
            <div class="card">
              <img data-img src="${country.flags.svg}" alt="cover" />
              <div class="card-info">
                <h3 data-title>${country.name.common}</h3>
                <div class="card-details">
                  <span data-population><strong>Population</strong>: ${country.population.toLocaleString()}</span>
                  <span data-region><strong>Region</strong>: ${
                    country.region
                  }</span>
                  <span data-capital><strong>Capital</strong>: ${
                    country.capital
                  }</span>
                  <button onclick="history.back()")>back</button>
                </div>
              </div>
            </div>
          `;
      });

      html = countryHTML;
      document.getElementById('content').innerHTML = html;
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }

  async fetchCountryData(id) {
    const url = `https://restcountries.com/v3.1/name/${id}`;

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
