document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  
  function renderProducts(products) {
    if (!products || products.length === 0) {
      grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748B; font-weight: 500;">No products currently available.</p>';
      return;
    }

    grid.innerHTML = products.map(p => `
      <div class="product-card" data-pkg="${p.title || 'Product'}" style="background: #FFF; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;">
        <div class="prod-img" style="height: 140px; width: 100%; background: #F1F5F9; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          ${p.imageUrl ? `<img src="${p.imageUrl}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: contain;">` : '<span style="color:#94A3B8; font-size: 0.8rem;">No Image</span>'}
        </div>
        <div class="prod-content" style="padding: 12px; display: flex; flex-direction: column; flex-grow: 1;">
          <h3 class="pkg-title" style="margin: 0 0 6px 0; font-size: 1rem; color: #0A2528; line-height: 1.3;">${p.title || 'Unknown Product'}</h3>
          
          <div class="pkg-price-row" style="margin-bottom: 8px; display: flex; align-items: baseline; gap: 6px;">
            ${p.mrpPrice ? `<span class="pkg-strike" style="text-decoration: line-through; color: #94A3B8; font-size: 0.8rem;">₹${p.mrpPrice}</span>` : ''}
            <span class="pkg-val" style="color: #0F766E; font-weight: 800; font-size: 1.15rem;">₹${p.price || '0'}</span>
          </div>

          ${p.description ? `<p style="color: #475569; font-size: 0.8rem; margin-bottom: 12px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${p.description}</p>` : ''}
          
          <div style="margin-top: auto;">
            <button onclick="window.openProductOrderModal('${(p.title || '').replace(/'/g, "\\'")}')" class="btn btn-primary pkg-cta-btn select-pkg-btn" style="width: 100%; border-radius: 8px; padding: 8px; background: #00A0A8; color: #FFF; font-weight: 600; font-size: 0.9rem; cursor: pointer; border: none; transition: background 0.3s; margin-top: 6px;" onmouseover="this.style.background='#00858C'" onmouseout="this.style.background='#00A0A8'">Buy Now</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Define global function for Buy Now buttons to bypass mobile listener issues
  window.openProductOrderModal = function(prodName) {
    document.getElementById('order-product-name').value = prodName;
    document.getElementById('order-product-name-display').innerText = prodName;
    document.getElementById('product-order-modal').style.display = 'flex';
  };

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

  // Handle Product Order Form Submission (WhatsApp Redirect)
  const orderForm = document.getElementById('form-product-order');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const prodName = document.getElementById('order-product-name').value;
      const name = document.getElementById('order-name').value.trim();
      const phone = document.getElementById('order-phone').value.trim();
      const address = document.getElementById('order-address').value.trim();
      const pincode = document.getElementById('order-pincode').value.trim();
      
      if (!name || !phone || !address || !pincode) {
        alert("Please fill all details.");
        return;
      }
      
      // Target WhatsApp Number
      const waNumber = "919451521465";
      
      // Construct Message
      let msg = `Hello, I want to order a product:\n\n`;
      msg += `*Product:* ${prodName}\n`;
      msg += `*Name:* ${name}\n`;
      msg += `*Phone:* ${phone}\n`;
      msg += `*Address:* ${address}\n`;
      msg += `*Pincode:* ${pincode}\n`;
      
      const encodedMsg = encodeURIComponent(msg);
      const waUrl = `https://wa.me/${waNumber}?text=${encodedMsg}`;
      
      // Close modal
      document.getElementById('product-order-modal').style.display = 'none';
      
      // Redirect to WhatsApp
      window.open(waUrl, '_blank');
    });
  }
});
