// import dataFetcher from './renderCountries';

// class Dropdown {
//   constructor() {
//     this.dropdown = document.querySelector('.custom-dropdown');
//     this.select = this.dropdown.querySelector('.select');
//     this.caret = this.dropdown.querySelector('.caret');
//     this.menu = this.dropdown.querySelector('.menu');
//     this.options = this.dropdown.querySelectorAll('.menu li');
//     this.selected = this.dropdown.querySelector('.selected');

//     this.openMenu = this.openMenu.bind(this);
//     this.selectItem = this.selectItem.bind(this);
//   }

//   initialize() {
//     this.openMenu();
//   }

//   openMenu() {
//     this.select.addEventListener('click', () => {
//       this.caret.classList.toggle('caret-rotate');
//       this.menu.classList.toggle('menu-open');
//     });
//     this.selectItem();
//   }

//   selectItem() {
//     this.options.forEach((option) => {
//       option.addEventListener('click', () => {
//         this.selected.innerText = option.innerText;
//         dataFetcher.fetchDataByRegion(option.innerText);

//         this.caret.classList.remove('caret-rotate');
//         this.menu.classList.remove('menu-open');

//         this.options.forEach((option) => {
//           option.classList.remove('active');
//         });

//         option.classList.add('active');
//       });
//     });
//   }
// }

// const myDropdown = new Dropdown();

// export default myDropdown;
