import initStickyTableHeader from './main';

requestAnimationFrame(() => {
    const tableEl = document.querySelector('table');
    initStickyTableHeader(tableEl, 150);
});
