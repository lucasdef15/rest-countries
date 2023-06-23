class DarkMode {
  constructor() {
    this.darkMode = JSON.parse(localStorage.getItem('darkMode'));
  }
  toggleMode() {
    this.loadSettings();
    const darkmode = document.querySelector('#darkmode');
    darkmode.addEventListener('click', () => {
      document.body.classList.toggle('darkMode');
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(this.darkMode));
    });
  }
  loadSettings() {
    if (this.darkMode) {
      document.body.classList.add('darkMode');
    } else {
      document.body.classList.remove('darkMode');
    }
  }
}

const darkMode = new DarkMode();

export default darkMode;
