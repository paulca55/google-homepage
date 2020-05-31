import '../scss/style.scss';

var searchWrapper = document.querySelector('.search__input-wrapper');
var search = document.querySelector('.search__input');

function hoverClassToggle() {
  searchWrapper.classList.toggle('search__input-wrapper--hover');
}

function focusClassToggle() {
  searchWrapper.classList.toggle('search__input-wrapper--focus');
}

searchWrapper.addEventListener('mouseover', hoverClassToggle);
searchWrapper.addEventListener('mouseout', hoverClassToggle);
search.addEventListener('focus', focusClassToggle);
search.addEventListener('blur', focusClassToggle);
