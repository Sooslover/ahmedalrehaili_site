
const themeBtn = () => {
  const root = document.documentElement;
  const isDark = root.classList.toggle('dark');
  localStorage.setItem('prefers-dark', isDark ? '1' : '0');
};
document.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('prefers-dark') === '1') document.documentElement.classList.add('dark');
  // KPIs
  fetch('data/metrics.json').then(r=>r.json()).then(m => {
    document.getElementById('citations').textContent = m.citations;
    document.getElementById('hindex').textContent = m.h_index;
    document.getElementById('i10').textContent = m.i10_index;
  });
  // Publications
  const list = document.getElementById('pub-list');
  const count = document.getElementById('pub-count');
  fetch('data/publications.json').then(r=>r.json()).then(items => {
    function render(arr){
      list.innerHTML = arr.map(p => `
        <div class="pub">
          <div><div class="title"><strong>${p.title}</strong></div><div class="meta">${p.venue || ''} · ${p.year || ''}</div></div>
          <div>${p.link ? `<a class="btn ghost" target="_blank" rel="noopener" href="${p.link}">Open</a>` : `<a class="btn ghost" target="_blank" rel="noopener" href="https://scholar.google.com/scholar?q=${encodeURIComponent(p.title)}">Scholar</a>`}</div>
        </div>`).join('');
      count.textContent = arr.length;
    }
    render(items);
    document.getElementById('pub-search').addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      render(items.filter(p => p.title.toLowerCase().includes(q) || String(p.year).includes(q)));
    });
  });
  document.getElementById('theme-toggle').addEventListener('click', themeBtn);
});
