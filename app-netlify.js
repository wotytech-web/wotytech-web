/**
 * ========================================
 * WOTYTECH - APLICACIÓN COMPLETA
 * Versión Segura con todas las funcionalidades
 * ========================================
 */

// ============================================
// VARIABLES GLOBALES
// ============================================
let carrito = [];
let galeriaIndices = {};
let galeriaIndicesJuegos = {};
let lightboxProductoId = null;
let lightboxIndice = 0;
let lightboxJuegoId = null;
let lightboxJuegoIndice = 0;

// Inicializar índices de galería
window.AppData.productos.forEach(prod => { galeriaIndices[prod.id] = 0; });
window.AppData.juegos.forEach(juego => { galeriaIndicesJuegos[juego.id] = 0; });

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    renderizarProductos();
    renderizarJuegos();
    setupEventListeners();
    console.log('✅ Aplicación WotyTech cargada');
});

// ============================================
// RENDERIZAR PRODUCTOS
// ============================================
function renderizarProductos() {
    const container = document.getElementById('productosContainer');
    if (!container) return;
    
    const { productos } = window.AppData;
    
    container.innerHTML = productos.map(prod => {
        const esImagen = prod.esImagen || (prod.imagenes && prod.imagenes[0] && prod.imagenes[0].startsWith('http'));
        const tieneVariasImagenes = prod.imagenes && prod.imagenes.length > 1;
        const sinStock = prod.stock <= 0;
        const stockBajo = prod.stock > 0 && prod.stock <= 3;
        
        return `
            <div class="producto-card ${sinStock ? 'producto-agotado' : ''}">
                <div class="producto-galeria" id="galeria-${prod.id}">
                    ${esImagen ? 
                        `<img src="${prod.imagenes[0]}" alt="${prod.nombre}" class="galeria-imagen-principal" onclick="abrirLightbox(${prod.id}, 0)" data-producto="${prod.id}" data-indice="0">` :
                        `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem;">${prod.imagenes[0]}</div>`
                    }
                    ${tieneVariasImagenes && esImagen ? `
                        <div class="galeria-flechas">
                            <button class="galeria-flecha" onclick="cambiarImagenGaleria(${prod.id}, -1)">‹</button>
                            <button class="galeria-flecha" onclick="cambiarImagenGaleria(${prod.id}, 1)">›</button>
                        </div>
                    ` : ''}
                    ${sinStock ? '<div class="badge-agotado">AGOTADO</div>' : ''}
                    ${stockBajo && !sinStock ? `<div class="badge-stock-bajo">¡Últimas ${prod.stock} unidades!</div>` : ''}
                </div>
                ${tieneVariasImagenes && esImagen ? `
                    <div class="galeria-miniaturas">
                        ${prod.imagenes.map((img, idx) => `
                            <img src="${img}" class="galeria-miniatura ${idx === 0 ? 'active' : ''}" onclick="seleccionarImagenGaleria(${prod.id}, ${idx})" data-producto="${prod.id}" data-indice="${idx}">
                        `).join('')}
                    </div>
                ` : ''}
                <div class="producto-info">
                    <h3>${prod.nombre}</h3>
                    <p>${prod.categoria}</p>
                    <div class="producto-precio">$${prod.precio.toLocaleString('es-AR')}</div>
                    <div class="producto-stock">
                        ${sinStock ? '<span class="stock-agotado">⚠️ Sin stock</span>' : 
                            stockBajo ? `<span class="stock-bajo">📦 Solo quedan ${prod.stock}</span>` :
                            `<span class="stock-disponible">✅ Stock: ${prod.stock} disponibles</span>`}
                    </div>
                    <button class="btn btn-primary" onclick="agregarAlCarrito(${prod.id})" ${sinStock ? 'disabled' : ''}>
                        ${sinStock ? 'Sin Stock' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// GALERÍA - PRODUCTOS
// ============================================
function cambiarImagenGaleria(productoId, direccion) {
    const { productos } = window.AppData;
    const producto = productos.find(p => p.id === productoId);
    if (!producto || !producto.imagenes || producto.imagenes.length <= 1) return;
    
    galeriaIndices[productoId] = (galeriaIndices[productoId] + direccion + producto.imagenes.length) % producto.imagenes.length;
    const img = document.querySelector(`img.galeria-imagen-principal[data-producto="${productoId}"]`);
    if (img) {
        img.src = producto.imagenes[galeriaIndices[productoId]];
        img.dataset.indice = galeriaIndices[productoId];
    }
    document.querySelectorAll(`.galeria-miniatura[data-producto="${productoId}"]`).forEach((mini, idx) => {
        mini.classList.toggle('active', idx === galeriaIndices[productoId]);
    });
}

function seleccionarImagenGaleria(productoId, indice) {
    const { productos } = window.AppData;
    const producto = productos.find(p => p.id === productoId);
    if (!producto || !producto.imagenes) return;
    
    galeriaIndices[productoId] = indice;
    const img = document.querySelector(`img.galeria-imagen-principal[data-producto="${productoId}"]`);
    if (img) {
        img.src = producto.imagenes[indice];
        img.dataset.indice = indice;
    }
    document.querySelectorAll(`.galeria-miniatura[data-producto="${productoId}"]`).forEach((mini, idx) => {
        mini.classList.toggle('active', idx === indice);
    });
}

// ============================================
// LIGHTBOX - PRODUCTOS
// ============================================
function abrirLightbox(productoId, indice) {
    const { productos } = window.AppData;
    const producto = productos.find(p => p.id === productoId);
    if (!producto || !producto.imagenes) return;
    
    lightboxProductoId = productoId;
    lightboxIndice = indice;
    
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-cerrar" onclick="cerrarLightbox()">×</button>
            <button class="lightbox-flecha lightbox-flecha-izq" onclick="navegarLightbox(-1)">‹</button>
            <div class="lightbox-contenido">
                <img class="lightbox-imagen" src="" alt="">
            </div>
            <button class="lightbox-flecha lightbox-flecha-der" onclick="navegarLightbox(1)">›</button>
            <div class="lightbox-contador"></div>
        `;
        document.body.appendChild(lightbox);
        
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') cerrarLightbox();
                if (e.key === 'ArrowLeft') navegarLightbox(-1);
                if (e.key === 'ArrowRight') navegarLightbox(1);
            }
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) cerrarLightbox();
        });
    }
    
    actualizarLightbox();
    lightbox.classList.add('active');
}

function cerrarLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
}

function navegarLightbox(direccion) {
    const { productos } = window.AppData;
    const producto = productos.find(p => p.id === lightboxProductoId);
    if (!producto || !producto.imagenes) return;
    
    lightboxIndice = (lightboxIndice + direccion + producto.imagenes.length) % producto.imagenes.length;
    actualizarLightbox();
}

function actualizarLightbox() {
    const { productos } = window.AppData;
    const producto = productos.find(p => p.id === lightboxProductoId);
    if (!producto || !producto.imagenes) return;
    
    const lightbox = document.getElementById('lightbox');
    const img = lightbox.querySelector('.lightbox-imagen');
    const contador = lightbox.querySelector('.lightbox-contador');
    
    img.src = producto.imagenes[lightboxIndice];
    img.alt = producto.nombre;
    
    if (producto.imagenes.length > 1) {
        contador.textContent = `${lightboxIndice + 1} / ${producto.imagenes.length}`;
        lightbox.querySelector('.lightbox-flecha-izq').style.display = 'flex';
        lightbox.querySelector('.lightbox-flecha-der').style.display = 'flex';
    } else {
        contador.textContent = '';
        lightbox.querySelector('.lightbox-flecha-izq').style.display = 'none';
        lightbox.querySelector('.lightbox-flecha-der').style.display = 'none';
    }
}

// ============================================
// CARRITO DE COMPRAS
// ============================================
function agregarAlCarrito(id) {
    const { productos } = window.AppData;
    const producto = productos.find(p => p.id === id);
    
    if (producto.stock <= 0) {
        mostrarNotificacion('⚠️ Producto sin stock');
        return;
    }
    
    const itemExistente = carrito.find(item => item.id === id);
    if (itemExistente) {
        if (itemExistente.cantidad >= producto.stock) {
            mostrarNotificacion(`⚠️ Stock máximo alcanzado (${producto.stock} unidades)`);
            return;
        }
        itemExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    
    actualizarCarrito();
    mostrarNotificacion('✅ Producto agregado al carrito');
}

function actualizarCarrito() {
    const count = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const countElement = document.getElementById('carritoCount');
    if (countElement) countElement.textContent = count;
    
    const itemsContainer = document.getElementById('carritoItems');
    if (!itemsContainer) return;
    
    if (carrito.length === 0) {
        itemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Tu carrito está vacío</p>';
    } else {
        itemsContainer.innerHTML = carrito.map(item => `
            <div class="carrito-item">
                <div class="carrito-item-info">
                    <strong>${item.nombre}</strong>
                    <p class="carrito-item-precio">$${item.precio.toLocaleString('es-AR')}</p>
                </div>
                <div class="carrito-item-cantidad">
                    <button onclick="cambiarCantidad(${item.id}, -1)" class="btn-cantidad">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="cambiarCantidad(${item.id}, 1)" class="btn-cantidad">+</button>
                </div>
                <button onclick="eliminarDelCarrito(${item.id})" class="btn-eliminar">🗑️</button>
            </div>
        `).join('');
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const totalElement = document.getElementById('carritoTotal');
    if (totalElement) totalElement.textContent = `$${total.toLocaleString('es-AR')}`;
}

function cambiarCantidad(id, cambio) {
    const { productos } = window.AppData;
    const item = carrito.find(i => i.id === id);
    const producto = productos.find(p => p.id === id);
    
    if (!item || !producto) return;
    
    const nuevaCantidad = item.cantidad + cambio;
    
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }
    
    if (nuevaCantidad > producto.stock) {
        mostrarNotificacion(`⚠️ Stock máximo: ${producto.stock} unidades`);
        return;
    }
    
    item.cantidad = nuevaCantidad;
    actualizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
    mostrarNotificacion('🗑️ Producto eliminado');
}

function abrirCarrito() {
    const modal = document.getElementById('carritoModal');
    if (modal) modal.classList.add('active');
}

function cerrarCarrito() {
    const modal = document.getElementById('carritoModal');
    if (modal) modal.classList.remove('active');
}

function toggleCarrito() {
    const modal = document.getElementById('carritoModal');
    if (modal) {
        modal.classList.toggle('active');
    }
}

function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    let mensaje = '¡Hola! Quiero comprar los siguientes productos:%0A%0A';
    carrito.forEach(item => {
        mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString('es-AR')}%0A`;
    });
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    mensaje += `%0ATotal: $${total.toLocaleString('es-AR')}`;
    
    window.open(`https://wa.me/541131721889?text=${mensaje}`, '_blank');
}

async function pagarMercadoPago() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    mostrarNotificacion('Creando pago seguro...');
    
    try {
        const items = carrito.map(item => ({
            title: item.nombre,
            description: item.categoria || 'Producto WotyTech',
            quantity: item.cantidad,
            unit_price: item.precio,
            currency_id: 'ARS'
        }));
        
        const response = await fetch('/.netlify/functions/crear-pago', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items })
        });
        
        const data = await response.json();
        
        if (data.success && data.init_point) {
            mostrarNotificacion('¡Redirigiendo a Mercado Pago!');
            setTimeout(() => { window.location.href = data.init_point; }, 500);
        } else {
            throw new Error(data.error || 'Error al crear el pago');
        }
    } catch (error) {
        console.error('Error al crear pago:', error);
        alert('Hubo un problema al procesar el pago. Por favor intenta por WhatsApp.');
        
        // Fallback a WhatsApp
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        let mensaje = `¡Hola! Quiero pagar con Mercado Pago:%0A%0A`;
        carrito.forEach(item => {
            mensaje += `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString('es-AR')}%0A`;
        });
        mensaje += `%0ATotal: $${total.toLocaleString('es-AR')}`;
        window.open(`https://wa.me/541131721889?text=${mensaje}`, '_blank');
    }
}

// ============================================
// RENDERIZAR JUEGOS
// ============================================
function renderizarJuegos() {
    const container = document.getElementById('juegosContainer');
    if (!container) return;
    
    const { juegos } = window.AppData;
    
    container.innerHTML = juegos.map(juego => {
        const tieneVariasImagenes = juego.imagenes && juego.imagenes.length > 1;
        
        return `
            <div class="juego-card" style="background: linear-gradient(135deg, rgba(22, 33, 62, 0.9) 0%, rgba(15, 52, 96, 0.9) 100%); border-radius: 20px; overflow: hidden; border: 3px solid rgba(255, 215, 0, 0.5); box-shadow: 0 10px 40px rgba(255, 215, 0, 0.2); transition: all 0.4s; position: relative;">
                <div class="producto-galeria" id="galeria-juego-${juego.id}" style="height: 250px; background: #000; overflow: hidden; position: relative; border-bottom: 3px solid #ffd700;">
                    <img src="${juego.imagenes[0]}" alt="${juego.nombre}" class="galeria-imagen-principal" onclick="abrirLightboxJuego(${juego.id}, 0)" data-juego="${juego.id}" data-indice="0" style="width: 100%; height: 100%; object-fit: cover; cursor: pointer; transition: transform 0.4s; padding: 0;">
                    ${tieneVariasImagenes ? `
                        <div class="galeria-flechas">
                            <button class="galeria-flecha" onclick="event.stopPropagation(); cambiarImagenGaleriaJuego(${juego.id}, -1)">‹</button>
                            <button class="galeria-flecha" onclick="event.stopPropagation(); cambiarImagenGaleriaJuego(${juego.id}, 1)">›</button>
                        </div>
                    ` : ''}
                    <div style="position: absolute; top: 10px; right: 10px; background: rgba(0, 0, 0, 0.8); color: #ffd700; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: bold; border: 2px solid #ffd700;">💾 ${juego.tamaño}</div>
                </div>
                ${tieneVariasImagenes ? `
                    <div class="galeria-miniaturas">
                        ${juego.imagenes.map((img, idx) => `
                            <img src="${img}" class="galeria-miniatura ${idx === 0 ? 'active' : ''}" onclick="seleccionarImagenGaleriaJuego(${juego.id}, ${idx})" data-juego="${juego.id}" data-indice="${idx}">
                        `).join('')}
                    </div>
                ` : ''}
                <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(22, 33, 62, 0.9) 0%, rgba(15, 52, 96, 0.9) 100%);">
                    <h3 style="color: #ffd700; margin-bottom: 0.5rem; font-size: 1.3rem;">${juego.nombre}</h3>
                    <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin-bottom: 0.5rem;">${juego.subtitulo}</p>
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                        <span style="background: rgba(255, 215, 0, 0.2); color: #ffd700; padding: 4px 12px; border-radius: 15px; font-size: 0.85rem;">📅 ${juego.año}</span>
                        <span style="background: rgba(255, 215, 0, 0.2); color: #ffd700; padding: 4px 12px; border-radius: 15px; font-size: 0.85rem;">${juego.genero}</span>
                    </div>
                    <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 1rem;">${juego.descripcion}</p>
                    <a href="${juego.linkDescarga}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;" ${juego.linkDescarga === '#' ? 'onclick="event.preventDefault(); alert(\'Próximamente disponible\')"' : ''}>
                        <button class="btn btn-primary" style="width: 100%; padding: 12px; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px;">
                            ⬇️ Descargar (${juego.tamaño})
                        </button>
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

// ============================================
// GALERÍA - JUEGOS
// ============================================
function cambiarImagenGaleriaJuego(juegoId, direccion) {
    const { juegos } = window.AppData;
    const juego = juegos.find(j => j.id === juegoId);
    if (!juego || !juego.imagenes || juego.imagenes.length <= 1) return;
    
    galeriaIndicesJuegos[juegoId] = (galeriaIndicesJuegos[juegoId] + direccion + juego.imagenes.length) % juego.imagenes.length;
    const img = document.querySelector(`img.galeria-imagen-principal[data-juego="${juegoId}"]`);
    if (img) {
        img.src = juego.imagenes[galeriaIndicesJuegos[juegoId]];
        img.dataset.indice = galeriaIndicesJuegos[juegoId];
    }
    document.querySelectorAll(`.galeria-miniatura[data-juego="${juegoId}"]`).forEach((mini, idx) => {
        mini.classList.toggle('active', idx === galeriaIndicesJuegos[juegoId]);
    });
}

function seleccionarImagenGaleriaJuego(juegoId, indice) {
    const { juegos } = window.AppData;
    const juego = juegos.find(j => j.id === juegoId);
    if (!juego || !juego.imagenes) return;
    
    galeriaIndicesJuegos[juegoId] = indice;
    const img = document.querySelector(`img.galeria-imagen-principal[data-juego="${juegoId}"]`);
    if (img) {
        img.src = juego.imagenes[indice];
        img.dataset.indice = indice;
    }
    document.querySelectorAll(`.galeria-miniatura[data-juego="${juegoId}"]`).forEach((mini, idx) => {
        mini.classList.toggle('active', idx === indice);
    });
}

// ============================================
// LIGHTBOX - JUEGOS
// ============================================
function abrirLightboxJuego(juegoId, indice) {
    const { juegos } = window.AppData;
    const juego = juegos.find(j => j.id === juegoId);
    if (!juego || !juego.imagenes) return;
    
    lightboxJuegoId = juegoId;
    lightboxJuegoIndice = indice;
    
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-cerrar" onclick="cerrarLightboxJuego()">×</button>
            <button class="lightbox-flecha lightbox-flecha-izq" onclick="navegarLightboxJuego(-1)">‹</button>
            <div class="lightbox-contenido">
                <img class="lightbox-imagen" src="" alt="">
            </div>
            <button class="lightbox-flecha lightbox-flecha-der" onclick="navegarLightboxJuego(1)">›</button>
            <div class="lightbox-contador"></div>
        `;
        document.body.appendChild(lightbox);
        
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') cerrarLightboxJuego();
                if (e.key === 'ArrowLeft') navegarLightboxJuego(-1);
                if (e.key === 'ArrowRight') navegarLightboxJuego(1);
            }
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) cerrarLightboxJuego();
        });
    }
    
    actualizarLightboxJuego();
    lightbox.classList.add('active');
}

function cerrarLightboxJuego() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.classList.remove('active');
}

function navegarLightboxJuego(direccion) {
    const { juegos } = window.AppData;
    const juego = juegos.find(j => j.id === lightboxJuegoId);
    if (!juego || !juego.imagenes) return;
    
    lightboxJuegoIndice = (lightboxJuegoIndice + direccion + juego.imagenes.length) % juego.imagenes.length;
    actualizarLightboxJuego();
}

function actualizarLightboxJuego() {
    const { juegos } = window.AppData;
    const juego = juegos.find(j => j.id === lightboxJuegoId);
    if (!juego || !juego.imagenes) return;
    
    const lightbox = document.getElementById('lightbox');
    const img = lightbox.querySelector('.lightbox-imagen');
    const contador = lightbox.querySelector('.lightbox-contador');
    
    img.src = juego.imagenes[lightboxJuegoIndice];
    img.alt = juego.nombre;
    
    if (juego.imagenes.length > 1) {
        contador.textContent = `${lightboxJuegoIndice + 1} / ${juego.imagenes.length}`;
        lightbox.querySelector('.lightbox-flecha-izq').style.display = 'flex';
        lightbox.querySelector('.lightbox-flecha-der').style.display = 'flex';
    } else {
        contador.textContent = '';
        lightbox.querySelector('.lightbox-flecha-izq').style.display = 'none';
        lightbox.querySelector('.lightbox-flecha-der').style.display = 'none';
    }
}

// ============================================
// DROPDOWN CONTACTO
// ============================================
function toggleDropdown(event) {
    event.preventDefault();
    const dropdown = document.getElementById('dropdownContacto');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Click fuera del dropdown para cerrarlo
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('dropdownContacto');
        const navItem = event.target.closest('.nav-item');
        if (!navItem && dropdown) {
            dropdown.classList.remove('active');
        }
    });
    
    // Modal del carrito - cerrar al hacer click fuera
    const carritoModal = document.getElementById('carritoModal');
    if (carritoModal) {
        carritoModal.addEventListener('click', function(e) {
            if (e.target === carritoModal) {
                cerrarCarrito();
            }
        });
    }
}

// ============================================
// NOTIFICACIONES
// ============================================
function mostrarNotificacion(texto) {
    const notif = document.createElement('div');
    notif.textContent = texto;
    notif.style.cssText = 'position: fixed; top: 100px; right: 30px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1rem 2rem; border-radius: 15px; box-shadow: 0 10px 40px rgba(16, 185, 129, 0.5); z-index: 50000; animation: fadeInUp 0.5s; border: 2px solid rgba(255, 215, 0, 0.3);';
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

console.log('✅ WotyTech App cargada completamente');
console.log(`📦 ${window.AppData.productos.length} productos disponibles`);
console.log(`🎮 ${window.AppData.juegos.length} juegos retro disponibles`);
