import dataFetcher from './renderCountries';

class Dropdown {
  constructor() {
    this.dropdown = document.querySelector('.custom-dropdown');
    this.select = document.createElement('div');
    this.caret = document.createElement('div');
    this.menu = document.createElement('ul');
    this.selected = document.createElement('span');
    this.options = null;
    this.items = ['Africa', 'America', 'Asia', 'Europe', 'Oceania'];
    this.openMenu = this.openMenu.bind(this);
    this.selectItem = this.selectItem.bind(this);
  }

  async initialize() {
    await this.openMenu();
  }

  async openMenu() {
    const dropdown = document.querySelector('.custom-dropdown');

    this.menu.innerHTML = '';

    this.items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      this.menu.appendChild(li);
    });

    this.select = document.createElement('div');
    this.select.classList.add('select');
    this.caret.classList.add('caret');
    this.menu.classList.add('menu');
    this.selected.classList.add('selected');

    this.selected.textContent = 'Filter by Region';

    this.select.appendChild(this.selected);
    this.select.appendChild(this.caret);

    this.select.addEventListener('click', () => {
      this.caret.classList.toggle('caret-rotate');
      this.menu.classList.toggle('menu-open');
    });

    dropdown.appendChild(this.select);
    dropdown.appendChild(this.menu);

    this.options = this.menu.querySelectorAll('li');

    this.selectItem();
  }

  selectItem() {
    this.options.forEach((option) => {
      option.addEventListener('click', () => {
        this.selected.innerText = option.innerText;
        dataFetcher.fetchDataByRegion(option.innerText);

        this.caret.classList.remove('caret-rotate');
        this.menu.classList.remove('menu-open');

        this.options.forEach((option) => {
          option.classList.remove('active');
        });

        option.classList.add('active');
      });
    });
  }
}

const myDropdown = new Dropdown();

export default myDropdown;
