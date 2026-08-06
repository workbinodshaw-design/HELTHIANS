document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  
  function renderProducts(products) {
    if (!products || products.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748B; font-weight: 500;">No products currently available.</p>';
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card" data-pkg="${p.title || 'Product'}" style="background: #FFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;">
        <div class="prod-img" style="height: 200px; width: 100%; background: #F1F5F9; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: contain;">` : '<span style="color:#94A3B8;">No Image</span>'}
        </div>
        <div class="prod-content" style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
          <h3 class="pkg-title" style="margin: 0 0 8px 0; font-size: 1.2rem; color: #0A2528;">${p.title || 'Unknown Product'}</h3>
          
          <div class="pkg-price-row" style="margin-bottom: 12px; display: flex; align-items: baseline; gap: 8px;">
            ${p.mrpPrice ? `<span class="pkg-strike" style="text-decoration: line-through; color: #94A3B8; font-size: 0.9rem;">₹${p.mrpPrice}</span>` : ''}
            <span class="pkg-val" style="color: #0F766E; font-weight: 800; font-size: 1.3rem;">₹${p.price || '0'}</span>
          </div>

          ${p.description ? `<p style="color: #475569; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${p.description}</p>` : ''}
          
          <div style="margin-top: auto;">
            <button class="btn btn-primary pkg-cta-btn select-pkg-btn" style="width: 100%; border-radius: 10px; padding: 12px; background: #00A0A8; color: #FFF; font-weight: 600; font-size: 1rem; cursor: pointer; border: none; transition: background 0.3s; margin-top: 10px;" onmouseover="this.style.background='#00858C'" onmouseout="this.style.background='#00A0A8'">Buy Now</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Poll for HealthiansBackend to load (since firebase scripts load asynchronously)
  let attempts = 0;
  const initInterval = setInterval(() => {
    if (window.HealthiansBackend && window.HealthiansBackend.subscribeProducts) {
      clearInterval(initInterval);
      window.HealthiansBackend.subscribeProducts(renderProducts);
    }
    if (++attempts > 50) {
      clearInterval(initInterval);
      console.error('Failed to load HealthiansBackend for Products.');
    }
  }, 100);
});
