/*!
 * CRD -  v1.0.0 ()
 * Copyright 2020-2020 Xavier SENENTE
 */


/*------------------------------------*\
  # AFFICHAGE DU MENU POUR LE MOBILE
\*------------------------------------*/

// On cible les éléments à modifier
const hamburger = document.querySelector(".menuBurger");
const menu = document.querySelector(".menu");
const page = document.documentElement;

// La fonction permettant de basculer l'affichage en ajoutant/supprimant des classes
function doToggle() {
  this.classList.toggle('-open');
  menu.classList.toggle('-open');
  page.classList.toggle('noscroll');
}

// La fonction doToggle() est appelé lorsqu'on clique sur l'icone de menu
hamburger.addEventListener('click', doToggle);


/*------------------------------------*\
  # SEARCHFORM
\*------------------------------------*/

var openCtrl        = document.querySelector('.header__search'),
    closeCtrl       = document.querySelector('.searchForm__close'),
    searchContainer = document.querySelector('.searchForm'),
    inputSearch     = searchContainer.querySelector('.searchForm__input');

function init() {
  initEvents();	
}

function initEvents() {
  openCtrl.addEventListener('click', openSearch);
  closeCtrl.addEventListener('click', closeSearch);
}

function openSearch() {
  searchContainer.classList.add('-open');
  inputSearch.focus();
}

function closeSearch() {
  searchContainer.classList.remove('-open');
  inputSearch.blur();
  inputSearch.value = '';
}

init();

/*------------------------------------*\
  # INIT HEADROOM
\*------------------------------------*/

const navBar = document.querySelector(".headroom");
const headroom  = new Headroom(navBar, {
  offset : 205
});
headroom.init();


/*------------------------------------*\
  # INIT FLICKITY CAROUSEL
\*------------------------------------*/

var carousel = document.querySelector('.carousel');
if ( carousel ) {
  var flkty = new Flickity( carousel, {
    // options
    wrapAround: true,
    imagesLoaded: true,
    lazyLoad: 3,
    cellAlign: 'left',
    arrowShape: 'M44.314 64.142L31.586 51.414a2 2 0 010-2.828l12.728-12.728a2 2 0 112.828 2.828L37.828 48H73v4H37.828l9.314 9.314a2 2 0 11-2.828 2.828z'
  });
}


/*------------------------------------*\
  # POUR AFFICHER LA GRILLE
\*------------------------------------*/

var btnGrid = document.querySelector(".btnGrid");
var body    = document.querySelector("body");

function showGrid() {
  body.classList.toggle('show');
  if (btnGrid.textContent === "Afficher la grille") {
    btnGrid.textContent = "Masquer la grille";
  } else {
    btnGrid.textContent = "Afficher la grille";
  }
}
if( btnGrid ) {
  btnGrid.addEventListener('click', showGrid);
}


/*------------------------------------*\
  # ANIMATIONS
\*------------------------------------*/

let lines = document.querySelectorAll(".curveLines path");
let i = 0;
if( lines ) {
  lines.forEach( function( el ) {
    gsap.set(el, { strokeDasharray: el.getTotalLength() });
    gsap.fromTo(el, 
      { strokeDashoffset: el.getTotalLength(), opacity: 0 } , 
      { strokeDashoffset: 0, opacity: 1, duration: 1, delay: i/4 + .5 }
    );
    i++
  });
}

var rellax = new Rellax('.rellax');