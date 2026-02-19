/**
 * ========================================
 * WOTYTECH - DATOS DE LA APLICACIÓN
 * ========================================
 * Todos los datos son validados antes de renderizar
 */

// ============================================
// DATOS DE PRODUCTOS
// ============================================
const productosRaw = [
    { 
        id: 1, 
        nombre: 'Msi Nvidia Gaming X Trio Rtx 3070 8gb', 
        precio: 700000, 
        imagenes: ['https://i.ibb.co/d4NJyr9h/msivideo.jpg', 'https://i.ibb.co/HpM1myhm/msivideo1.jpg', 'https://i.ibb.co/d46hQJ8p/msivideo2.jpg'], 
        categoria: 'Componente', 
        esImagen: true, 
        stock: 0 
    },
    { 
        id: 2, 
        nombre: 'Memoria Kingston 4gb Ddr3 1600 Pc3', 
        precio: 25000, 
        imagenes: ['https://i.ibb.co/k6B0swGj/ddr34gb.jpg', 'https://i.ibb.co/hkLDY6j/ddr34gb1.jpg', 'https://i.ibb.co/0RxB2Qyf/ddr34gb12.jpg'], 
        categoria: 'RAM', 
        esImagen: true, 
        stock: 5 
    },
    { 
        id: 3, 
        nombre: 'Disco Rigido 1tb Wd Western Digital Sata Blue', 
        precio: 100000, 
        imagenes: ['https://i.ibb.co/203BTP8T/hd1tb.jpg'], 
        categoria: 'Almacenamiento', 
        esImagen: true, 
        stock: 8 
    },
    { 
        id: 4, 
        nombre: 'Disco Sólido Ssd Kingston A400 480gb Sata', 
        precio: 115000, 
        imagenes: ['https://i.ibb.co/rf3xJ0QG/hd480.jpg', 'https://i.ibb.co/Vh7ctJW/hd4801.jpg', 'https://i.ibb.co/Kpb4L8h8/hd4802.jpg'], 
        categoria: 'Almacenamiento', 
        stock: 3 
    },
    { 
        id: 5, 
        nombre: 'Disco Sólido Ssd Kingston A400 960gb sata', 
        precio: 210000, 
        imagenes: ['https://i.ibb.co/BVzqYg6C/HD.jpg', 'https://i.ibb.co/TByFGRCY/HD00.jpg', 'https://i.ibb.co/ZRxXRXBT/HD01.jpg'], 
        categoria: 'Almacenamiento', 
        esImagen: true, 
        stock: 3 
    },
    { 
        id: 6, 
        nombre: 'Notebook HP Spectre', 
        precio: 450000, 
        imagenes: ['https://i.ibb.co/vv4JjzqX/notebbokhp00.jpg', 'https://i.ibb.co/Ng920j6L/20221225-150938.jpg', 'https://i.ibb.co/Mystj531/20221225-151504.jpg', 'https://i.ibb.co/V040znpm/20221225-151557.jpg', 'https://i.ibb.co/v4fbdyG7/notebbokhp.jpg', 'https://i.ibb.co/jkL6J0jX/20221225-151917.jpg'], 
        categoria: 'Notebook', 
        esImagen: true, 
        stock: 1 
    },
    { 
        id: 7, 
        nombre: 'Disco Rígido Externo Wd Element 1 Tb Fscomputers Negro', 
        precio: 140000, 
        imagenes: ['https://i.ibb.co/PzT1VxdH/hdex.jpg', 'https://i.ibb.co/0pcX59fc/hdex0.jpg', 'https://i.ibb.co/TBPRprqW/hdex1.jpg'], 
        categoria: 'Componentes', 
        esImagen: true, 
        stock: 1 
    },
    { 
        id: 8, 
        nombre: 'Memoria Kingston Kvr26s19s6/8, 8gb, Ddr4, Sodimm, 2666mhz', 
        precio: 90000, 
        imagenes: ['https://i.ibb.co/4RXgQDYs/ramnote.jpg', 'https://i.ibb.co/PGW2bYm0/ramnote1.jpg', 'https://i.ibb.co/YB4X0bWT/ramnote2.jpg'], 
        categoria: 'RAM', 
        esImagen: true, 
        stock: 3 
    },
    { 
        id: 9, 
        nombre: 'Memoria RAM gamer color verde 8GB 1.2V Kingston KVR24S17S8/8', 
        precio: 89000, 
        imagenes: ['https://i.ibb.co/TBjzcTRh/ramnote0.jpg', 'https://i.ibb.co/9m2fgWb0/ramnote01.jpg'], 
        categoria: 'RAM', 
        esImagen: true, 
        stock: 1 
    },
    { 
        id: 10, 
        nombre: 'Mouse Logitech G703 Wireless Gaming Lightspeed 12000dpi Negro', 
        precio: 120000, 
        imagenes: ['https://i.ibb.co/20n9DwwV/g703.jpg'], 
        categoria: 'Periféricos', 
        esImagen: true, 
        stock: 0 
    },
    { 
        id: 11, 
        nombre: 'Cargador Notebook Sony Vaio 19.5v, Original', 
        precio: 25000, 
        imagenes: ['https://i.ibb.co/b5psS2S7/20260120-170125.jpg'], 
        categoria: 'Periféricos', 
        stock: 3 
    },
    { 
        id: 12, 
        nombre: 'Lenovo Thinkpad E14 - Intel Core I5 1135g7 Negro', 
        precio: 899000, 
        imagenes: ['https://i.ibb.co/1tvkLH1G/Notelenovo1.jpg', 'https://i.ibb.co/ZRXLryHh/Notelenovo2.jpg', 'https://i.ibb.co/chf5Q7wg/Notelenovo3.jpg'], 
        categoria: 'Notebook', 
        stock: 1 
    }
];

// ============================================
// DATOS DE JUEGOS RETRO
// ============================================
const juegosRaw = [
    {
        id: 1001,
        nombre: 'Indiana Jones',
        subtitulo: 'The Fate of Atlantis',
        año: '1992',
        genero: '🎭 Aventura',
        tamaño: '69.1 MB',
        descripcion: 'Aventura gráfica clásica de LucasArts. Resuelve puzzles y descubre la Atlántida.',
        imagenes: [
            'https://i.ibb.co/0yd5GFf9/indy40.jpg',
            'https://i.ibb.co/pr5CgZ9t/indy4.jpg',
            'https://i.ibb.co/35Kq0Fq8/indy42.jpg',
            'https://i.ibb.co/pjtfg6hn/indy43.jpg'
        ],
        linkDescarga: 'https://drive.google.com/file/d/10m_JdzvtZpTh46Gplqyh7AYfkcssZDDo/view?usp=sharing'
    },
    {
        id: 1002,
        nombre: 'Prince of Persia 2',
        subtitulo: 'The Shadow & the Flame',
        año: '1993',
        genero: '🎭 Plataformas',
        tamaño: '6.2 MB',
        descripcion: 'Secuela épica con más niveles, mejores gráficos y la historia continúa.',
        imagenes: [
            'https://i.ibb.co/FqhNwctD/prince21.jpg',
            'https://i.ibb.co/7tCFpztx/prince2.jpg',
            'https://i.ibb.co/23n8zT8w/prince22.jpg',
            'https://i.ibb.co/MyyDnr3J/prince23.jpg'
        ],
        linkDescarga: 'https://drive.google.com/file/d/1-1fWGDAHO_4z2Jko--0z0PqmDvFPJ6NA/view?usp=sharing'
    },
    {
        id: 1003,
        nombre: 'Commander Keen 4',
        subtitulo: 'Secret of the Oracle',
        año: '1991',
        genero: '🚀 Plataformas',
        tamaño: '8 MB',
        descripcion: 'El genio de 8 años salva la galaxia. Plataformas clásico de id Software.',
        imagenes: [
            'https://i.ibb.co/hRzJppZ1/keen4.jpg',
            'https://i.ibb.co/HDz6wXvN/keen41.jpg',
            'https://i.ibb.co/0VF1ycRF/keen42.jpg',
            'https://i.ibb.co/VpkQMhtv/keen43.jpg'
        ],
        linkDescarga: 'https://drive.google.com/file/d/1O5KMDuMIH2Vs0vw5M_TuVR8Yi2jSiFJP/view?usp=sharing'
    },
    {
        id: 1004,
        nombre: 'Prehistorik 2',
        subtitulo: 'Adventure in the Stone Age',
        año: '1993',
        genero: '🦴 Plataformas',
        tamaño: '3.5 MB',
        descripcion: 'Aventura prehistórica colorida y divertida. Combate dinosaurios y recoge comida.',
        imagenes: [
            'https://i.ibb.co/dsjmqk3F/preshit22.jpg',
            'https://i.ibb.co/jkyTssJv/Prehis02.jpg',
            'https://i.ibb.co/2YFg0kW0/Prehis012.jpg',
            'https://i.ibb.co/XxhgB1bW/Prehis022.jpg'
        ],
        linkDescarga: 'https://drive.google.com/file/d/1Pkbs7rKvj9Szw38Zp4juk8w3EhFop-A6/view?usp=sharing'
    },
    {
        id: 1005,
        nombre: 'DOOM II',
        subtitulo: 'Hell on Earth',
        año: '1994',
        genero: '🔫 FPS',
        tamaño: '15 MB',
        descripcion: 'Secuela del legendario FPS. Más armas, más demonios, más acción.',
        imagenes: [
            'https://i.ibb.co/RTzPWz4y/doom21.jpg',
            'https://i.ibb.co/4nYpNMpy/doom2.jpg',
            'https://i.ibb.co/JWgjRHPp/doom22.jpg',
            'https://i.ibb.co/99HJtzYz/doom23.jpg'
        ],
        linkDescarga: 'https://drive.google.com/file/d/1AP-fyhHFBADpw0sYY_1iRn1O9-bCk4tt/view?usp=sharing'
    },
    {
        id: 1006,
        nombre: 'Indiana Jones',
        subtitulo: 'The Last Crusade',
        año: '1989',
        genero: '🎭 Aventura',
        tamaño: '12 MB',
        descripcion: 'Busca el Santo Grial. Aventura gráfica basada en la película de Spielberg.',
        imagenes: [
            'https://i.ibb.co/d04GDsjj/indy31.jpg',
            'https://i.ibb.co/QwwJXMq/indy34.jpg',
            'https://i.ibb.co/DPYsDrFf/indy32.jpg',
            'https://i.ibb.co/FbsgLyPy/indy33.jpg'
        ],
        linkDescarga: 'https://drive.google.com/file/d/16JRWSeUMwt4khtwZ-d94orws-rncHPXD/view?usp=sharing'
    }
];

// ============================================
// VALIDACIÓN Y SANITIZACIÓN DE DATOS
// ============================================

/**
 * Valida y sanitiza un producto
 */
function validarProducto(producto) {
    const { security } = window.WotySecure;
    
    // Validar imágenes
    const imagenesValidas = (producto.imagenes || []).filter(url => {
        // Si es emoji, permitir
        if (!url.startsWith('http')) return true;
        return security.validateImageURL(url);
    });
    
    return {
        id: parseInt(producto.id) || 0,
        nombre: security.sanitize(producto.nombre || ''),
        precio: parseInt(producto.precio) || 0,
        categoria: security.sanitize(producto.categoria || ''),
        imagenes: imagenesValidas.length > 0 ? imagenesValidas : ['😊'],
        esImagen: producto.esImagen || false,
        stock: parseInt(producto.stock) || 0
    };
}

/**
 * Valida y sanitiza un juego
 */
function validarJuego(juego) {
    const { security } = window.WotySecure;
    
    // Validar imágenes
    const imagenesValidas = (juego.imagenes || []).filter(url => 
        security.validateImageURL(url)
    );
    
    // Validar link de descarga
    let linkDescargaValido = '#';
    if (juego.linkDescarga && juego.linkDescarga !== '#') {
        if (security.validateURL(juego.linkDescarga)) {
            linkDescargaValido = juego.linkDescarga;
        }
    }
    
    return {
        id: parseInt(juego.id) || 0,
        nombre: security.sanitize(juego.nombre || ''),
        subtitulo: security.sanitize(juego.subtitulo || ''),
        año: security.sanitize(juego.año || ''),
        genero: security.sanitize(juego.genero || ''),
        tamaño: security.sanitize(juego.tamaño || ''),
        descripcion: security.sanitize(juego.descripcion || ''),
        imagenes: imagenesValidas.length > 0 ? imagenesValidas : ['https://via.placeholder.com/400x300?text=Sin+Imagen'],
        linkDescarga: linkDescargaValido
    };
}

// ============================================
// DATOS VALIDADOS Y EXPORTADOS
// ============================================
const productos = productosRaw.map(validarProducto);
const juegos = juegosRaw.map(validarJuego);

// Exportar datos validados
window.AppData = {
    productos,
    juegos
};

console.log('✅ Datos cargados y validados correctamente');
console.log(`📦 ${productos.length} productos cargados`);
console.log(`🎮 ${juegos.length} juegos cargados`);
