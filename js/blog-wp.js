// Filtros progresivos sobre las tarjetas estáticas generadas desde Markdown.
(() => {
  const cards = [...document.querySelectorAll('#blog-posts .blog-card')];
  const buttons = [...document.querySelectorAll('.blog-filter')];
  const search = document.querySelector('#blog-search');
  const empty = document.querySelector('#blog-empty');
  if (!search || !empty) return;
  let category = 'all';
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  function filter() {
    const query = normalize(search.value);
    let visible = 0;
    cards.forEach(card => {
      const show = (category === 'all' || card.dataset.category === category) && normalize(card.dataset.search || '').includes(query);
      card.hidden = !show;
      if (show) visible++;
    });
    empty.hidden = visible !== 0;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.category;
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    filter();
  }));
  search.addEventListener('input', filter);
})();
