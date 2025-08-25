
async function loadPubs(){
  const res = await fetch('data/publications.json');
  const data = await res.json();
  const list = document.getElementById('pub-list');
  const countSpan = document.getElementById('pub-count');
  countSpan.textContent = data.length;
  function render(items){
    list.innerHTML = items.map(p => `
      <div class="pub">
        <div class="title">${p.title}</div>
        <div class="meta"><span class="year">${p.year || ''}</span></div>
      </div>
    `).join('');
  }
  render(data);
  const search = document.getElementById('pub-search');
  search.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    const f = data.filter(p => p.title.toLowerCase().includes(q) || String(p.year).includes(q));
    render(f);
    countSpan.textContent = f.length;
  });
}
document.addEventListener('DOMContentLoaded', loadPubs);
