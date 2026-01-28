// visit-tracker.js - Traqueur de visites NOTEWAY
(function() {
    'use strict';
    
    // ===== CONFIGURATION =====
    const CONFIG = {
        EMAIL: 'gaa485780@gmail.com',
        SITE_NAME: 'NOTEWAY Togo',
        TRACKING_KEY: 'noteway_visit_tracked_v2',
        DELAY_MS: 2000, // 2 secondes après chargement
        DEBUG: true // Mets à false en production
    };
    
    // ===== FONCTIONS UTILITAIRES =====
    function log(message) {
        if (CONFIG.DEBUG) {
            console.log(`[NOTEWAY Tracker] ${message}`);
        }
    }
    
    function getDeviceInfo() {
        const ua = navigator.userAgent;
        let device = 'Desktop';
        
        if (/mobile|android|iphone|ipad/i.test(ua)) {
            device = 'Mobile';
        } else if (/tablet|ipad/i.test(ua)) {
            device = 'Tablet';
        }
        
        return device;
    }
    
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Inconnu';
        
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';
        
        return browser;
    }
    
    // ===== VÉRIFICATION INITIALE =====
    // 1. Ne rien faire si c'est un bot
    if (/(bot|crawl|spider|scrape)/i.test(navigator.userAgent)) {
        log('Bot détecté - tracking ignoré');
        return;
    }
    
    // 2. Ne pas tracker en localhost (développement)
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        log('Environnement local - tracking ignoré');
        return;
    }
    
    // 3. Vérifier si déjà tracké dans cette session
    if (sessionStorage.getItem(CONFIG.TRACKING_KEY)) {
        log('Visite déjà trackée dans cette session');
        return;
    }
    
    // ===== TRACKING PRINCIPAL =====
    setTimeout(() => {
        try {
            // Préparer les données
            const pageName = window.location.pathname
                .replace('/', '')
                .replace('.html', '')
                .toUpperCase() || 'ACCUEIL';
            
            const data = {
                _subject: `🚀 NOTEWAY - Visite ${pageName}`,
                _template: 'table',
                _replyto: CONFIG.EMAIL,
                _cc: CONFIG.EMAIL,
                
                // Données structurées
                '📊 STATISTIQUE': 'NOUVELLE VISITE',
                '🌐 SITE': CONFIG.SITE_NAME,
                '📄 PAGE': window.location.pathname,
                '🏷️ NOM PAGE': pageName,
                '📅 DATE': new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                '⏰ HEURE': new Date().toLocaleTimeString('fr-FR'),
                '📱 APPAREIL': getDeviceInfo(),
                '🌍 NAVIGATEUR': getBrowserInfo(),
                '🖥️ RÉSOLUTION': `${window.screen.width} × ${window.screen.height}`,
                '🔗 PROVENANCE': document.referrer 
                    ? new URL(document.referrer).hostname 
                    : 'Accès direct',
                '📍 TIMEZONE': Intl.DateTimeFormat().resolvedOptions().timeZone,
                '📈 TOTAL VISITES': localStorage.getItem('noteway_total_visits') || '1',
                '💬 MESSAGE': 'Bienvenue sur NOTEWAY ! 🚀'
            };
            
            // Envoyer les données à FormSubmit
            fetch(`https://formsubmit.co/ajax/${CONFIG.EMAIL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) throw new Error('Erreur réseau');
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    // Marquer comme tracké
                    sessionStorage.setItem(CONFIG.TRACKING_KEY, 'true');
                    
                    // Incrémenter le compteur total
                    const total = parseInt(localStorage.getItem('noteway_total_visits') || '0') + 1;
                    localStorage.setItem('noteway_total_visits', total.toString());
                    
                    log(`✅ Visite trackée avec succès! Total: ${total}`);
                    
                    // Mettre à jour le compteur visible si présent
                    updateVisitCounter(total);
                } else {
                    log('⚠️ Réponse FormSubmit non positive');
                }
            })
            .catch(error => {
                log(`❌ Erreur d'envoi: ${error.message}`);
                // Mode fallback: marquer quand même pour éviter les tentatives répétées
                sessionStorage.setItem(CONFIG.TRACKING_KEY, 'true');
            });
            
        } catch (error) {
            log(`💥 Erreur critique: ${error.message}`);
        }
    }, CONFIG.DELAY_MS);
    
    // ===== FONCTION POUR METTRE À JOUR LE COMPTEUR VISIBLE =====
    function updateVisitCounter(total) {
        // Chercher un compteur existant
        let counterEl = document.getElementById('visitCounter');
        
        if (!counterEl) {
            // Créer le compteur s'il n'existe pas
            counterEl = document.createElement('div');
            counterEl.id = 'visitCounter';
            counterEl.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 10px 18px;
                border-radius: 20px;
                font-size: 8px;
                font-weight: 600;
                z-index: 9997;
                box-shadow: 0 5px 20px rgba(0,0,0,0.3);
                border: 2px solid rgba(255,255,255,0.2);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                animation: pulse 2s infinite;
            `;
            
            // Ajouter animation CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
                    50% { transform: scale(1.05); box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5); }
                }
            `;
            document.head.appendChild(style);
            
            counterEl.innerHTML = `
                <i class="fas fa-eye" style="font-size: 14px;"></i>
                <span id="visitCountText">${total.toLocaleString()}</span>
                <i class="fas fa-users" style="font-size: 12px; opacity: 0.8;"></i>
            `;
            
            // Ajouter des icônes Font Awesome si non présentes
            if (!document.querySelector('link[href*="font-awesome"]')) {
                const faLink = document.createElement('link');
                faLink.rel = 'stylesheet';
                faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
                document.head.appendChild(faLink);
            }
            
            document.body.appendChild(counterEl);
            
            // Animation d'entrée
            counterEl.style.opacity = '0';
            counterEl.style.transform = 'translateY(20px)';
            setTimeout(() => {
                counterEl.style.transition = 'all 0.5s ease';
                counterEl.style.opacity = '1';
                counterEl.style.transform = 'translateY(0)';
            }, 100);
            
            // Clic pour afficher les stats
            counterEl.addEventListener('click', function() {
                alert(`📊 STATS NOTEWAY\n\n` +
                      `Visites totales: ${total.toLocaleString()}\n` +
                      `Page actuelle: ${window.location.pathname}\n` +
                      `Dernière visite: ${new Date().toLocaleString('fr-FR')}\n` +
                      `Appareil: ${getDeviceInfo()}\n` +
                      `Navigateur: ${getBrowserInfo()}`);
            });
            
            // Effet hover
            counterEl.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.5)';
            });
            
            counterEl.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
            });
        } else {
            // Mettre à jour le compteur existant
            const countText = counterEl.querySelector('#visitCountText');
            if (countText) {
                countText.textContent = total.toLocaleString();
                // Animation de mise à jour
                countText.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    countText.style.transform = 'scale(1)';
                }, 300);
            }
        }
    }
    
    // Initialiser le compteur au chargement
    const initialTotal = parseInt(localStorage.getItem('noteway_total_visits') || '0');
    if (initialTotal > 0) {
        setTimeout(() => updateVisitCounter(initialTotal), 500);
    }
    
    log('Tracker initialisé avec succès');
})();