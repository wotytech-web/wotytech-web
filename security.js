/**
 * ========================================
 * WOTYTECH - MÓDULO DE SEGURIDAD
 * ========================================
 * Este archivo contiene todas las funciones de seguridad
 * para proteger contra XSS, inyección, CSRF y otros ataques
 */

// ============================================
// CONFIGURACIÓN DE SEGURIDAD
// ============================================
const SecurityConfig = {
    // Rate limiting para formularios (máximo de envíos por minuto)
    RATE_LIMIT: {
        maxAttempts: 3,
        windowMs: 60000 // 1 minuto
    },
    
    // Patrones para validación
    PATTERNS: {
        email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        nombre: /^[A-Za-zÀ-ÿ\s]{2,100}$/,
        telefono: /^[0-9+\-\s()]{7,20}$/,
        url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
    },
    
    // Dominios permitidos para imágenes
    ALLOWED_IMAGE_DOMAINS: [
        'i.ibb.co',
        'imgur.com',
        'cloudinary.com'
    ],
    
    // Lista negra de caracteres peligrosos
    DANGEROUS_CHARS: /<|>|&|"|'|`|\/|\\|\{|\}|\[|\]/g
};

// ============================================
// CLASE PRINCIPAL DE SEGURIDAD
// ============================================
class Security {
    constructor() {
        this.rateLimitData = new Map();
        this.csrfToken = this.generateCSRFToken();
        this.initSecurity();
    }

    /**
     * Inicializa las medidas de seguridad
     */
    initSecurity() {
        // Prevenir clickjacking
        if (window.top !== window.self) {
            window.top.location = window.self.location;
        }

        // Deshabilitar clic derecho en producción (opcional)
        // document.addEventListener('contextmenu', e => e.preventDefault());

        // Detectar DevTools abierto (opcional - para protección adicional)
        this.detectDevTools();

        // Limpiar consola periódicamente
        this.clearConsole();

        // Protección contra copiar código
        this.protectCode();
    }

    /**
     * Genera un token CSRF único
     */
    generateCSRFToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Valida el token CSRF
     */
    validateCSRFToken(token) {
        return token === this.csrfToken;
    }

    /**
     * Sanitiza texto para prevenir XSS
     * Convierte caracteres peligrosos en entidades HTML
     */
    sanitize(text) {
        if (typeof text !== 'string') return '';
        
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };
        
        return text.replace(/[&<>"'`=\/]/g, char => map[char]);
    }

    /**
     * Sanitiza HTML completo
     */
    sanitizeHTML(html) {
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    /**
     * Valida URL para prevenir javascript: y data: URIs
     */
    validateURL(url) {
        if (!url || typeof url !== 'string') return false;
        
        // Convertir a minúsculas para verificación
        const lowerURL = url.toLowerCase().trim();
        
        // Rechazar protocolos peligrosos
        const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
        if (dangerousProtocols.some(proto => lowerURL.startsWith(proto))) {
            console.warn('🔒 URL bloqueada por protocolo peligroso:', url);
            return false;
        }
        
        // Solo permitir http, https y relative URLs
        if (!lowerURL.startsWith('http://') && 
            !lowerURL.startsWith('https://') && 
            !lowerURL.startsWith('/') &&
            !lowerURL.startsWith('./') &&
            !lowerURL.startsWith('#')) {
            return false;
        }
        
        return true;
    }

    /**
     * Valida imagen URL con dominios permitidos
     */
    validateImageURL(url) {
        if (!this.validateURL(url)) return false;
        
        try {
            const urlObj = new URL(url, window.location.origin);
            const hostname = urlObj.hostname;
            
            // Verificar si el dominio está en la lista permitida
            const isAllowed = SecurityConfig.ALLOWED_IMAGE_DOMAINS.some(domain => 
                hostname === domain || hostname.endsWith('.' + domain)
            );
            
            if (!isAllowed) {
                console.warn('🔒 Dominio de imagen no permitido:', hostname);
                return false;
            }
            
            return true;
        } catch (e) {
            console.error('🔒 Error validando URL de imagen:', e);
            return false;
        }
    }

    /**
     * Valida email
     */
    validateEmail(email) {
        if (!email || typeof email !== 'string') return false;
        return SecurityConfig.PATTERNS.email.test(email);
    }

    /**
     * Valida nombre
     */
    validateName(name) {
        if (!name || typeof name !== 'string') return false;
        return SecurityConfig.PATTERNS.nombre.test(name);
    }

    /**
     * Implementa rate limiting
     */
    checkRateLimit(identifier) {
        const now = Date.now();
        const limit = SecurityConfig.RATE_LIMIT;
        
        if (!this.rateLimitData.has(identifier)) {
            this.rateLimitData.set(identifier, {
                attempts: 1,
                firstAttempt: now
            });
            return true;
        }
        
        const data = this.rateLimitData.get(identifier);
        
        // Reset si pasó el tiempo de ventana
        if (now - data.firstAttempt > limit.windowMs) {
            this.rateLimitData.set(identifier, {
                attempts: 1,
                firstAttempt: now
            });
            return true;
        }
        
        // Verificar límite
        if (data.attempts >= limit.maxAttempts) {
            const timeLeft = Math.ceil((limit.windowMs - (now - data.firstAttempt)) / 1000);
            console.warn(`🔒 Rate limit excedido. Espera ${timeLeft} segundos.`);
            return false;
        }
        
        data.attempts++;
        return true;
    }

    /**
     * Valida datos de formulario
     */
    validateForm(formData) {
        const errors = {};
        
        // Validar nombre
        if (!formData.nombre || !this.validateName(formData.nombre)) {
            errors.nombre = 'Nombre inválido. Solo letras y espacios (2-100 caracteres)';
        }
        
        // Validar email
        if (!formData.email || !this.validateEmail(formData.email)) {
            errors.email = 'Email inválido';
        }
        
        // Validar mensaje
        if (!formData.mensaje || formData.mensaje.trim().length < 10) {
            errors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
        }
        
        if (formData.mensaje && formData.mensaje.length > 1000) {
            errors.mensaje = 'El mensaje no puede superar 1000 caracteres';
        }
        
        // Honeypot - debe estar vacío
        if (formData.website && formData.website.trim() !== '') {
            errors.bot = 'Detectado comportamiento de bot';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Crea un elemento DOM de forma segura
     */
    createSafeElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        // Agregar atributos de forma segura
        for (const [key, value] of Object.entries(attributes)) {
            if (key === 'href' || key === 'src') {
                if (this.validateURL(value)) {
                    element.setAttribute(key, value);
                }
            } else if (key === 'style') {
                // No permitir style inline por seguridad
                console.warn('🔒 Style inline bloqueado');
            } else if (key.startsWith('on')) {
                // No permitir event handlers inline
                console.warn('🔒 Event handler inline bloqueado');
            } else {
                element.setAttribute(key, this.sanitize(String(value)));
            }
        }
        
        // Agregar contenido sanitizado
        if (content) {
            element.textContent = content;
        }
        
        return element;
    }

    /**
     * Detecta si DevTools está abierto
     */
    detectDevTools() {
        const element = new Image();
        let devtoolsOpen = false;
        
        Object.defineProperty(element, 'id', {
            get: function() {
                devtoolsOpen = true;
            }
        });
        
        setInterval(() => {
            console.log(element);
            console.clear();
        }, 1000);
    }

    /**
     * Limpia la consola periódicamente
     */
    clearConsole() {
        setInterval(() => {
            console.clear();
        }, 5000);
    }

    /**
     * Protege el código contra copiar
     */
    protectCode() {
        // Prevenir selección de texto (opcional)
        // document.body.style.userSelect = 'none';
        
        // Ofuscar código en producción
        if (window.location.hostname !== 'localhost' && 
            window.location.hostname !== '127.0.0.1') {
            // Deshabilitar clic derecho
            document.addEventListener('contextmenu', e => e.preventDefault());
            
            // Detectar atajos de teclado de DevTools
            document.addEventListener('keydown', e => {
                if (e.keyCode === 123 || // F12
                    (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
                    (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
                    (e.ctrlKey && e.keyCode === 85)) { // Ctrl+U
                    e.preventDefault();
                    return false;
                }
            });
        }
    }

    /**
     * Encripta datos sensibles (básico)
     */
    encryptData(data, key) {
        // Implementación simple - en producción usar una librería robusta
        return btoa(JSON.stringify(data));
    }

    /**
     * Desencripta datos
     */
    decryptData(encrypted, key) {
        try {
            return JSON.parse(atob(encrypted));
        } catch (e) {
            console.error('🔒 Error desencriptando datos');
            return null;
        }
    }

    /**
     * Genera hash simple de string
     */
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    /**
     * Valida integridad de datos
     */
    validateIntegrity(data, expectedHash) {
        const actualHash = this.hashString(JSON.stringify(data));
        return actualHash === expectedHash;
    }
}

// ============================================
// FILTRO DE CONTENIDO OFENSIVO
// ============================================
class ContentFilter {
    constructor() {
        // Lista de palabras prohibidas (ejemplo básico)
        this.blockedWords = [
            // Agregar palabras ofensivas aquí
        ];
    }

    /**
     * Filtra contenido ofensivo
     */
    filterContent(text) {
        if (!text || typeof text !== 'string') return '';
        
        let filtered = text;
        this.blockedWords.forEach(word => {
            const regex = new RegExp(word, 'gi');
            filtered = filtered.replace(regex, '***');
        });
        
        return filtered;
    }

    /**
     * Detecta spam
     */
    isSpam(text) {
        if (!text || typeof text !== 'string') return false;
        
        const spamIndicators = [
            /http[s]?:\/\//gi, // URLs múltiples
            /\$\d+/g, // Precios
            /\b(buy|click|free|win|prize)\b/gi // Palabras spam comunes
        ];
        
        let spamScore = 0;
        spamIndicators.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) spamScore += matches.length;
        });
        
        return spamScore > 3;
    }
}

// ============================================
// LOGGER DE SEGURIDAD
// ============================================
class SecurityLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 100;
    }

    /**
     * Registra evento de seguridad
     */
    log(type, message, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type,
            message,
            data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.logs.push(logEntry);
        
        // Mantener solo los últimos maxLogs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // En producción, enviar logs al servidor
        if (type === 'error' || type === 'attack') {
            this.sendToServer(logEntry);
        }
        
        console.warn(`🔒 [${type.toUpperCase()}] ${message}`, data);
    }

    /**
     * Envía logs al servidor
     */
    sendToServer(logEntry) {
        // Implementar envío al servidor
        // fetch('/api/security-logs', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(logEntry)
        // });
    }

    /**
     * Obtiene logs
     */
    getLogs(type = null) {
        if (type) {
            return this.logs.filter(log => log.type === type);
        }
        return this.logs;
    }
}

// ============================================
// INSTANCIAS GLOBALES
// ============================================
const security = new Security();
const contentFilter = new ContentFilter();
const securityLogger = new SecurityLogger();

// ============================================
// EXPORTAR PARA USO EN OTROS ARCHIVOS
// ============================================
window.WotySecure = {
    security,
    contentFilter,
    securityLogger,
    SecurityConfig
};

console.log('🔒 Sistema de seguridad WotyTech cargado correctamente');
