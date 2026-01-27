// ===== CONFIGURATION COMPLÈTE LYCÉE =====
// Tous coefficients différents par classe et série
// Aucune valeur commune entre séries

const CONFIG_LYCEE = {
    // ===== SECONDE =====
    'seconde_cd': {
        nom: "Seconde CD",
        matieres: [
            { code: 'fr', nom: 'Français', coef: 2 },
            { code: 'ang', nom: 'Anglais', coef: 2 },
            { code: 'his', nom: 'Histoire-Géographie', coef: 2 },
            { code: 'ecm', nom: 'ECM', coef: 2 },
            { code: 'maths', nom: 'Mathématiques', coef: 4 },
            { code: 'pc', nom: 'Physique-Chimie', coef: 3 },
            { code: 'svt', nom: 'SVT', coef: 2 },
            { code: 'eps', nom: 'EPS', coef: 1 },
            { code: 'philo', nom: 'Philosophie', coef: 2 }
        ],
        options: [] // Pas d'options pour CD
    },
    
    'seconde_a4': {
        nom: "Seconde A4",
        matieres: [
            { code: 'fr', nom: 'Français', coef: 5 },
            { code: 'ang', nom: 'Anglais', coef: 3 },
            { code: 'his', nom: 'Histoire-Géographie', coef: 4 },
            { code: 'ecm', nom: 'ECM', coef: 2 },
            { code: 'maths', nom: 'Mathématiques', coef: 3 },
            { code: 'pc', nom: 'Physique-Chimie', coef: 2 },
            { code: 'svt', nom: 'SVT', coef: 2 },
            { code: 'eps', nom: 'EPS', coef: 1 },
            { code: 'philo', nom: 'Philosophie', coef: 3 }
        ],
        options: [
            { code: 'all', nom: 'Allemand', coef: 3, actif: true },
            { code: 'esp', nom: 'Espagnol', coef: 2, actif: false }
        ]
    },
    
    // ===== PREMIÈRE =====
    'premiere_c4': {
        nom: "Première C4",
        matieres: [
            { code: 'fr', nom: 'Français', coef: 2 },
            { code: 'ang', nom: 'Anglais', coef: 2 },
            { code: 'his', nom: 'Histoire-Géographie', coef: 2 },
            { code: 'ecm', nom: 'ECM', coef: 2 },
            { code: 'maths', nom: 'Mathématiques', coef: 5 },
            { code: 'pc', nom: 'Physique-Chimie', coef: 4 },
            { code: 'svt', nom: 'SVT', coef: 2 },
            { code: 'eps', nom: 'EPS', coef: 1 },
            { code: 'philo', nom: 'Philosophie', coef: 2 }
        ],
        options: []
    },
    
    'premiere_d': {
        nom: "Première D",
        matieres: [
            { code: 'fr', nom: 'Français', coef: 2 },
            { code: 'ang', nom: 'Anglais', coef: 2 },
            { code: 'his', nom: 'Histoire-Géographie', coef: 2 },
            { code: 'ecm', nom: 'ECM', coef: 2 },
            { code: 'maths', nom: 'Mathématiques', coef: 3 },
            { code: 'pc', nom: 'Physique-Chimie', coef: 3 },
            { code: 'svt', nom: 'SVT', coef: 4 },
            { code: 'eps', nom: 'EPS', coef: 1 },
            { code: 'philo', nom: 'Philosophie', coef: 2 }
        ],
        options: []
    },
    
    'premiere_a4': {
        nom: "Première A4",
        matieres: [
            { code: 'fr', nom: 'Français', coef: 6 },
            { code: 'ang', nom: 'Anglais', coef: 4 },
            { code: 'his', nom: 'Histoire-Géographie', coef: 4 },
            { code: 'ecm', nom: 'ECM', coef: 2 },
            { code: 'maths', nom: 'Mathématiques', coef: 3 },
            { code: 'pc', nom: 'Physique-Chimie', coef: 2 },
            { code: 'svt', nom: 'SVT', coef: 2 },
            { code: 'eps', nom: 'EPS', coef: 1 },
            { code: 'philo', nom: 'Philosophie', coef: 4 }
        ],
        options: [
            { code: 'all', nom: 'Allemand', coef: 4, actif: true },
            { code: 'esp', nom: 'Espagnol', coef: 3, actif: false }
        ]
    },
    
    // ===== TERMINALE =====
    'terminale_c4': {
        nom: "Terminale C4",
        matieres: [
            { code: 'fr', nom: 'Français', coef: 2 },
            { code: 'ang', nom: 'Anglais', coef: 2 },
            { code: 'his', nom: 'Histoire-Géographie', coef: 2 },
            { code: 'ecm', nom: 'ECM', coef: 2 },
            { code: 'maths', nom: 'Mathématiques', coef: 5 },
            { code: 'pc', nom: 'Physique-Chimie', coef: 4 },
            { code: 'svt', nom: 'SVT', coef: 2 },
            { code: 'eps', nom: 'EPS', coef: 1 },
            { code: 'philo', nom: 'Philosophie', coef: 2 }
        ],
        options: []
    },
    
    'terminale_d': {
        nom: "Terminale D",
        matieres: [
            { code: 'fr', nom: 'Français', coef: 2 },
            { code: 'ang', nom: 'Anglais', coef: 2 },
            { code: 'his', nom: 'Histoire-Géographie', coef: 2 },
            { code: 'ecm', nom: 'ECM', coef: 2 },
            { code: 'maths', nom: 'Mathématiques', coef: 3 },
            { code: 'pc', nom: 'Physique-Chimie', coef: 3 },
            { code: 'svt', nom: 'SVT', coef: 4 },
            { code: 'eps', nom: 'EPS', coef: 1 },
            { code: 'philo', nom: 'Philosophie', coef: 2 }
        ],
        options: []
    },
    
    'terminale_a4': {
        nom: "Terminale A4",
        matieres: [
            { code: 'fr', nom: 'Français', coef: 7 },
            { code: 'ang', nom: 'Anglais', coef: 4 },
            { code: 'his', nom: 'Histoire-Géographie', coef: 4 },
            { code: 'ecm', nom: 'ECM', coef: 2 },
            { code: 'maths', nom: 'Mathématiques', coef: 3 },
            { code: 'pc', nom: 'Physique-Chimie', coef: 2 },
            { code: 'svt', nom: 'SVT', coef: 2 },
            { code: 'eps', nom: 'EPS', coef: 1 },
            { code: 'philo', nom: 'Philosophie', coef: 5 }
        ],
        options: [
            { code: 'all', nom: 'Allemand', coef: 5, actif: true },
            { code: 'esp', nom: 'Espagnol', coef: 4, actif: false }
        ]
    }
};

// ===== FONCTIONS UTILITAIRES =====

// Obtenir la configuration pour une classe et série
function getConfig(classe, serie) {
    const key = `${classe}_${serie}`;
    return CONFIG_LYCEE[key];
}

// Obtenir la liste complète des matières (obligatoires + options actives)
function getMatieresActives(classe, serie) {
    const config = getConfig(classe, serie);
    if (!config) return [];
    
    const matieres = [...config.matieres];
    
    // Ajouter les options actives
    if (config.options && config.options.length > 0) {
        config.options.forEach(option => {
            if (option.actif) {
                matieres.push({
                    code: option.code,
                    nom: option.nom,
                    coef: option.coef,
                    isOption: true
                });
            }
        });
    }
    
    return matieres;
}

// Calculer le coefficient total
function getCoefficientTotal(classe, serie) {
    const matieres = getMatieresActives(classe, serie);
    return matieres.reduce((total, matiere) => total + matiere.coef, 0);
}

// Mettre à jour le statut d'une option
function toggleOption(classe, serie, codeOption) {
    const config = getConfig(classe, serie);
    if (!config || !config.options) return false;
    
    const option = config.options.find(opt => opt.code === codeOption);
    if (option) {
        option.actif = !option.actif;
        return true;
    }
    return false;
}

// Obtenir l'état actuel des options
function getOptionsActives(classe, serie) {
    const config = getConfig(classe, serie);
    if (!config || !config.options) return [];
    
    return config.options.filter(option => option.actif);
}

// Obtenir toutes les séries disponibles pour une classe
const SERIES_PAR_CLASSE = {
    'seconde': ['cd', 'a4'],
    'premiere': ['c4', 'd', 'a4'],
    'terminale': ['c4', 'd', 'a4']
};

function getSeriesPourClasse(classe) {
    const seriesCodes = SERIES_PAR_CLASSE[classe] || [];
    return seriesCodes.map(code => {
        const config = getConfig(classe, code);
        return {
            code: code,
            nom: config ? config.nom.split(' ')[1] : code.toUpperCase(),
            description: config ? `Coefficients spécifiques` : ''
        };
    });
}

// Formater le nom de la classe
function getNomClasse(classe) {
    const noms = {
        'seconde': 'Seconde',
        'premiere': 'Première',
        'terminale': 'Terminale'
    };
    return noms[classe] || classe;
}

// Formater le nom de la série
function getNomSerie(serie) {
    const noms = {
        'cd': 'CD',
        'c4': 'C4',
        'd': 'D',
        'a4': 'A4'
    };
    return noms[serie] || serie;
}

// APPRÉCIATIONS (mêmes que collège)
const APPRECIATIONS = [
    { min: 16, max: 20, text: "🔥 WAW ! T'es un vrai boss ! Excellence totale !", emoji: "👑", color: "#00F5D4" },
    { min: 14, max: 15.99, text: "🎯 Excellent travail ! Tu assures grave, continue comme ça !", emoji: "⭐", color: "#00BBF9" },
    { min: 12, max: 13.99, text: "👍 Pas mal du tout ! T'es sur la bonne voie, keep going !", emoji: "💪", color: "#00D4AA" },
    { min: 10, max: 11.99, text: "✅ Ça passe, mais tu peux faire mieux. Motive-toi !", emoji: "📚", color: "#FFD166" },
    { min: 0, max: 9.99, text: "💪 Il faut bosser davantage. Concentre-toi, tu peux y arriver !", emoji: "🎯", color: "#FF6B35" }
];