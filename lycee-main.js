// ===== ÉLÉMENTS DOM =====
let selectionClasse, selectionSerie, tableScreen;
let tableBody, currentClassSerie, totalCoeff, tableTitle;
let changeSerieBtn, backToClasse, btnCalculer, btnReset, btnSave, btnShare;
let moyenneGenerale, finalGrade, appreciationText;
let saveModal, saveNameInput, trimOptions, scrollHint;
let optionsContainer;

// ===== ÉTAT GLOBAL =====
let currentClasse = '';
let currentSerie = '';
let currentMatieres = [];
let coefficientTotal = 0;
let isCalculated = false;

// Stockage temporaire des notes pour les options quand désactivées
let notesCache = {};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 NOTEWAY Lycée - Initialisation');
    
    // Récupérer les éléments DOM
    initElements();
    
    // Configurer les événements
    setupEventListeners();
    
    console.log('✅ NOTEWAY Lycée - Prêt !');
});

function initElements() {
    // Écrans
    selectionClasse = document.getElementById('selectionClasse');
    selectionSerie = document.getElementById('selectionSerie');
    tableScreen = document.getElementById('tableScreen');
    
    // Tableau
    tableBody = document.getElementById('tableBody');
    currentClassSerie = document.getElementById('currentClassSerie');
    totalCoeff = document.getElementById('totalCoeff');
    tableTitle = document.getElementById('tableTitle');
    
    // Boutons navigation
    changeSerieBtn = document.getElementById('changeSerieBtn');
    backToClasse = document.getElementById('backToClasse');
    
    // Boutons actions
    btnCalculer = document.getElementById('btnCalculer');
    btnReset = document.getElementById('btnReset');
    btnSave = document.getElementById('btnSave');
    btnShare = document.getElementById('btnShare');
    
    // Résultats
    moyenneGenerale = document.getElementById('moyenneGenerale');
    finalGrade = document.getElementById('finalGrade');
    appreciationText = document.getElementById('appreciationText');
    
    // Modal sauvegarde
    saveModal = document.getElementById('saveModal');
    saveNameInput = document.getElementById('saveName');
    trimOptions = document.querySelectorAll('.trim-option');
    scrollHint = document.getElementById('scrollHint');
    
    // Conteneur options (pour A4)
    optionsContainer = document.getElementById('optionsContainer');
    
    // S'assurer que seul l'écran de sélection classe est visible au début
    if (selectionClasse) selectionClasse.style.display = 'block';
    if (selectionSerie) selectionSerie.style.display = 'none';
    if (tableScreen) tableScreen.style.display = 'none';
    if (optionsContainer) optionsContainer.style.display = 'none';
}

function setupEventListeners() {
    // 1. Événements sur les cartes de classe
    document.querySelectorAll('.class-card').forEach(card => {
        card.addEventListener('click', function() {
            handleClasseSelection(this.dataset.classe);
        });
    });
    
    // 2. Bouton "Retour au choix de classe"
    backToClasse.addEventListener('click', function() {
        selectionSerie.style.display = 'none';
        selectionClasse.style.display = 'block';
        
        // Réinitialiser la sélection visuelle
        document.querySelectorAll('.serie-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Cacher les options
        if (optionsContainer) optionsContainer.style.display = 'none';
    });
    
    // 3. Bouton "Changer de série" (dans le tableau)
    changeSerieBtn.addEventListener('click', function() {
        // Retour à l'écran de sélection série
        tableScreen.style.display = 'none';
        selectionSerie.style.display = 'block';
        
        // Réinitialiser l'état
        resetAll();
        currentClasse = '';
        currentSerie = '';
        
        // Cacher les options
        if (optionsContainer) optionsContainer.style.display = 'none';
    });
    
    // 4. Bouton "Calculer la moyenne"
    btnCalculer.addEventListener('click', calculateAll);
    
    // 5. Bouton "Tout effacer"
    btnReset.addEventListener('click', function() {
        if (confirm('Es-tu sûr de vouloir effacer toutes les notes ?')) {
            resetAll();
        }
    });
    
    // 6. Bouton "Sauvegarder"
    btnSave.addEventListener('click', showSaveModal);
    
    // 7. Bouton "Partager sur WhatsApp"
    btnShare.addEventListener('click', shareResults);
    
    // 8. Modal de sauvegarde
    setupSaveModal();
    
    // 9. Vérifier le scroll horizontal
    window.addEventListener('resize', checkTableScroll);
}

// ===== NAVIGATION =====
function handleClasseSelection(classe) {
    console.log('Sélection de classe:', classe);
    
    // Mettre à jour la sélection visuelle
    document.querySelectorAll('.class-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.class-card[data-classe="${classe}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Mettre à jour la classe courante
    currentClasse = classe;
    
    // Afficher les séries disponibles pour cette classe
    showSeriesForClasse(classe);
}

function showSeriesForClasse(classe) {
    // Mettre à jour le titre
    const titreClasse = document.getElementById('titreClasse');
    const classeSelectionnee = document.getElementById('classeSelectionnee');
    
    titreClasse.textContent = `CHOISIS TA SÉRIE - ${getNomClasse(classe).toUpperCase()}`;
    classeSelectionnee.textContent = getNomClasse(classe);
    
    // Récupérer les séries pour cette classe
    const series = getSeriesPourClasse(classe);
    const serieGrid = document.getElementById('serieGrid');
    
    // Vider le contenu précédent
    serieGrid.innerHTML = '';
    
    // Créer les cartes de série
    series.forEach(serie => {
        const card = document.createElement('div');
        card.className = 'serie-card';
        card.dataset.serie = serie.code;
        
        // Icône selon la série
        let icon = '🔵';
        if (serie.code === 'a4') icon = '🟡';
        if (serie.code === 'c4') icon = '🔴';
        if (serie.code === 'd') icon = '🟢';
        if (serie.code === 'cd') icon = '🔵';
        
        card.innerHTML = `
            <div class="serie-icon" style="font-size: 2rem; margin-bottom: 10px;">${icon}</div>
            <div class="serie-name">${serie.nom}</div>
            <div class="serie-desc">${serie.description}</div>
        `;
        
        card.addEventListener('click', function() {
            handleSerieSelection(serie.code);
        });
        
        serieGrid.appendChild(card);
    });
    
    // Afficher l'écran des séries
    selectionClasse.style.display = 'none';
    selectionSerie.style.display = 'block';
}

function handleSerieSelection(serie) {
    console.log('Sélection de série:', serie);
    
    // Mettre à jour la sélection visuelle
    document.querySelectorAll('.serie-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.serie-card[data-serie="${serie}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Mettre à jour la série courante
    currentSerie = serie;
    
    // Initialiser le tableau pour cette série
    initializeTableForSerie();
}

// ===== INITIALISATION DU TABLEAU =====
function initializeTableForSerie() {
    console.log(`Initialisation tableau pour ${currentClasse} ${currentSerie}`);
    
    // Récupérer les matières actives
    currentMatieres = getMatieresActives(currentClasse, currentSerie);
    
    // Calculer le coefficient total
    coefficientTotal = getCoefficientTotal(currentClasse, currentSerie);
    
    // Mettre à jour l'affichage
    updateClassSerieDisplay();
    
    // Configurer les options (pour A4)
    setupOptionsInterface();
    
    // Afficher le tableau
    selectionSerie.style.display = 'none';
    tableScreen.style.display = 'block';
    
    // Générer les lignes du tableau
    generateTableRows();
    
    // Restaurer les notes en cache si elles existent
    restoreCachedNotes();
    
    // Réinitialiser l'état
    isCalculated = false;
    updateButtonsState();
    checkTableScroll();
}

function updateClassSerieDisplay() {
    currentClassSerie.textContent = `${getNomClasse(currentClasse)} ${getNomSerie(currentSerie)}`;
    tableTitle.textContent = `${getNomClasse(currentClasse)} ${getNomSerie(currentSerie)}`;
    totalCoeff.textContent = coefficientTotal;
}

function setupOptionsInterface() {
    const config = getConfig(currentClasse, currentSerie);
    
    if (config.options && config.options.length > 0) {
        optionsContainer.innerHTML = '';
        optionsContainer.style.display = 'flex';
        
        config.options.forEach(option => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option-item';
            optionDiv.innerHTML = `
                <label class="option-checkbox">
                    <input type="checkbox" ${option.actif ? 'checked' : ''} 
                           data-option="${option.code}">
                    <span class="option-name">${option.nom}</span>
                    <span class="option-coef">(coef ${option.coef})</span>
                </label>
            `;
            
            const checkbox = optionDiv.querySelector('input');
            checkbox.addEventListener('change', function() {
                // Sauvegarder les notes actuelles avant de changer
                cacheCurrentNotes();
                
                // Basculer l'option
                toggleOption(currentClasse, currentSerie, option.code);
                
                // Regénérer le tableau avec les nouvelles matières
                initializeTableForSerie();
            });
            
            optionsContainer.appendChild(optionDiv);
        });
    } else {
        optionsContainer.style.display = 'none';
    }
}

// ===== GESTION DU CACHE DES NOTES =====
function cacheCurrentNotes() {
    // Sauvegarder toutes les notes actuelles dans le cache
    document.querySelectorAll('.note-input').forEach(input => {
        const matiere = input.dataset.mat;
        const type = input.dataset.type;
        
        if (!notesCache[matiere]) {
            notesCache[matiere] = {};
        }
        
        if (input.value) {
            notesCache[matiere][type] = input.value;
        }
    });
}

function restoreCachedNotes() {
    // Restaurer les notes depuis le cache
    currentMatieres.forEach(matiere => {
        const cached = notesCache[matiere.code];
        if (cached) {
            Object.keys(cached).forEach(type => {
                const input = document.querySelector(`.note-input[data-mat="${matiere.code}"][data-type="${type}"]`);
                if (input) {
                    input.value = cached[matiere.code][type];
                    
                    // Déclencher la validation
                    if (input.value) {
                        input.classList.add('valid');
                        handleNoteInput(input);
                    }
                }
            });
        }
    });
}

// ===== GÉNÉRATION DU TABLEAU =====
function generateTableRows() {
    console.log('Génération des lignes du tableau');
    tableBody.innerHTML = '';
    
    currentMatieres.forEach((matiere, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="col-matiere">
                <span class="mat-num">${(index + 1).toString().padStart(2, '0')}.</span> ${matiere.nom}
                ${matiere.isOption ? ' <span class="option-indicator">(Option)</span>' : ''}
            </td>
            
            <!-- 4 notes de classe -->
            ${[1, 2, 3, 4].map(i => `
                <td>
                    <div class="note-input-container">
                        <input type="number" 
                               class="note-input" 
                               data-mat="${matiere.code}" 
                               data-type="note${i}"
                               placeholder="--" 
                               min="0" 
                               max="20" 
                               step="0.25"
                               oninput="handleNoteInput(this)">
                        <div class="error-message" data-for="${matiere.code}-note${i}"></div>
                    </div>
                </td>
            `).join('')}
            
            <!-- M.Cla -->
            <td>
                <span class="calc-value mclasse-value" id="mclasse-${matiere.code}">--.--</span>
            </td>
            
            <!-- Composition -->
            <td>
                <div class="note-input-container">
                    <input type="number" 
                           class="note-input" 
                           data-mat="${matiere.code}" 
                           data-type="compo"
                           placeholder="--" 
                           min="0" 
                           max="20" 
                           step="0.25"
                           oninput="handleNoteInput(this)">
                    <div class="error-message" data-for="${matiere.code}-compo"></div>
                </div>
            </td>
            
            <!-- Moyenne matière -->
            <td>
                <span class="calc-value moy-value" id="moy-${matiere.code}">--.--</span>
            </td>
            
            <!-- Coefficient -->
            <td>
                <span class="coef-badge">${matiere.coef}</span>
            </td>
            
            <!-- Notes Défini -->
            <td>
                <span class="defini-value" id="defini-${matiere.code}">--.--</span>
            </td>
            
            <!-- Observation -->
            <td>
                <span class="obs-badge" id="obs-${matiere.code}">--</span>
            </td>
        `;
        tableBody.appendChild(row);
        
        // Ajouter les boutons +/- après création de la ligne
        setTimeout(() => addNoteControls(row, matiere.code), 100);
    });
    
    // Réinitialiser l'état des boutons
    updateButtonsState();
}

// ===== FONCTIONS DU TABLEAU (identiques au collège) =====
function addNoteControls(row, matiereCode) {
    const inputs = row.querySelectorAll('.note-input');
    
    inputs.forEach((input, index) => {
        const container = input.parentElement;
        
        // Créer les boutons +/-
        const controls = document.createElement('div');
        controls.className = 'note-controls';
        controls.innerHTML = `
            <button class="note-btn note-plus" data-action="increment" title="Augmenter de 0.25">
                <i class="fas fa-plus"></i>
            </button>
            <button class="note-btn note-minus" data-action="decrement" title="Diminuer de 0.25">
                <i class="fas fa-minus"></i>
            </button>
        `;
        
        container.appendChild(controls);
        
        // Événements sur les boutons
        const plusBtn = controls.querySelector('.note-plus');
        const minusBtn = controls.querySelector('.note-minus');
        
        plusBtn.addEventListener('click', () => adjustNote(input, 0.25));
        minusBtn.addEventListener('click', () => adjustNote(input, -0.25));
    });
}

function adjustNote(input, delta) {
    let currentValue = parseFloat(input.value) || 0;
    let newValue = currentValue + delta;
    
    // Limiter entre 0 et 20
    newValue = Math.max(0, Math.min(20, newValue));
    
    // Arrondir au 0.25 le plus proche
    newValue = Math.round(newValue * 4) / 4;
    
    // Mettre à jour l'input
    input.value = newValue.toFixed(2);
    
    // Déclencher les événements
    handleNoteInput(input);
}

// ===== GESTION DES NOTES =====
window.handleNoteInput = function(input) {
    // Valider la note
    if (validateNote(input)) {
        // Mettre à jour la matière
        updateMatiere(input.dataset.mat);
        
        // Vérifier si on peut activer les boutons
        updateButtonsState();
    }
};

function validateNote(input) {
    const value = parseFloat(input.value);
    const errorMsg = input.parentElement.querySelector('.error-message');
    
    // Réinitialiser
    input.classList.remove('error', 'valid');
    if (errorMsg) errorMsg.style.display = 'none';
    
    // Si vide, c'est OK
    if (input.value === '') return true;
    
    // Vérifier si c'est un nombre
    if (isNaN(value)) {
        input.classList.add('error');
        if (errorMsg) {
            errorMsg.textContent = 'Nombre invalide';
            errorMsg.style.display = 'block';
        }
        return false;
    }
    
    // Vérifier la plage 0-20
    if (value < 0 || value > 20) {
        input.classList.add('error');
        if (errorMsg) {
            errorMsg.textContent = 'Entre 0 et 20 seulement';
            errorMsg.style.display = 'block';
        }
        return false;
    }
    
    // Arrondir automatiquement au 0.25 près
    const rounded = Math.round(value * 4) / 4;
    if (Math.abs(value - rounded) > 0.01) {
        input.value = rounded.toFixed(2);
    }
    
    input.classList.add('valid');
    return true;
}

function updateMatiere(matiereCode) {
    const matiere = currentMatieres.find(m => m.code === matiereCode);
    if (!matiere) return null;
    
    const inputs = document.querySelectorAll(`.note-input[data-mat="${matiereCode}"]`);
    
    // === ÉTAPE 1: Calculer M.Cla (moyenne des 4 notes de classe) ===
    let mCla = 0;
    let notesCount = 0;
    let notesSum = 0;
    
    // Parcourir les 4 notes de classe
    for (let i = 0; i < 4; i++) {
        const value = parseFloat(inputs[i].value);
        if (!isNaN(value) && value >= 0) {
            notesSum += value;
            notesCount++;
        }
    }
    
    if (notesCount > 0) {
        const moyenneBrute = notesSum / notesCount;
        mCla = Math.round(moyenneBrute * 4) / 4; // Arrondi au 0.25
    }
    
    // === ÉTAPE 2: Récupérer et arrondir la composition ===
    const compoInput = inputs[4];
    let composition = 0;
    if (compoInput && compoInput.value) {
        const compoValue = parseFloat(compoInput.value);
        if (!isNaN(compoValue) && compoValue >= 0) {
            composition = Math.round(compoValue * 4) / 4; // Arrondi au 0.25
        }
    }
    
    // === ÉTAPE 3: Calculer la moyenne de la matière ===
    let moyenneMatiere = 0;
    
    if (mCla > 0 && composition > 0) {
        // RÈGLE: Les deux notes présentes → moyenne des deux
        const moyenneBrute = (mCla + composition) / 2;
        moyenneMatiere = Math.round(moyenneBrute * 4) / 4;
    } else if (mCla > 0) {
        // RÈGLE: Seulement M.Cla → M.Cla = moyenne
        moyenneMatiere = mCla;
    } else if (composition > 0) {
        // RÈGLE: Seulement composition → composition = moyenne
        moyenneMatiere = composition;
    }
    // Sinon: moyenneMatiere reste à 0 (matière sans notes)
    
    // === ÉTAPE 4: Calculer Notes Défini ===
    const notesDefini = moyenneMatiere * matiere.coef;
    
    // === Mise à jour de l'affichage ===
    const mclasseEl = document.getElementById(`mclasse-${matiereCode}`);
    const moyEl = document.getElementById(`moy-${matiereCode}`);
    const definiEl = document.getElementById(`defini-${matiereCode}`);
    const obsEl = document.getElementById(`obs-${matiereCode}`);
    
    if (mclasseEl) mclasseEl.textContent = mCla > 0 ? mCla.toFixed(2) : '--.--';
    if (moyEl) moyEl.textContent = moyenneMatiere > 0 ? moyenneMatiere.toFixed(2) : '--.--';
    if (definiEl) definiEl.textContent = notesDefini > 0 ? notesDefini.toFixed(2) : '--.--';
    
// === Observation ===
    if (obsEl) {
        let observation = '--';
        let obsColor = '#6E6E82';
        
        if (moyenneMatiere >= 16) {
            observation = 'Excellent';
            obsColor = '#00F5D4';
        } else if (moyenneMatiere >= 14) {
            observation = 'Très bien';
            obsColor = '#00BBF9';
        } else if (moyenneMatiere >= 12) {
            observation = 'Bien';
            obsColor = '#00D4AA';
        } else if (moyenneMatiere >= 10) {
            observation = 'Passable';
            obsColor = '#FFD166';
        } else if (moyenneMatiere > 0) {
            observation = 'Insuffisant';
            obsColor = '#FF6B35';
        }
        
        obsEl.textContent = observation;
        obsEl.style.backgroundColor = obsColor + '20';
        obsEl.style.color = obsColor;
        obsEl.style.border = `1px solid ${obsColor}40`;
    }
    
    return { 
        mCla, 
        composition, 
        moyenne: moyenneMatiere, 
        notesDefini,
        aDesNotes: moyenneMatiere > 0
    };
}

// ===== CALCUL GÉNÉRAL =====
function calculateAll() {
    console.log('=== DÉBUT DU CALCUL LYCÉE ===');
    
    let totalNotesDefini = 0;
    let matieresAvecNotes = 0;
    let detailsCalcul = [];
    
    // === ÉTAPE 1: Calculer le total des Notes Défini ===
    currentMatieres.forEach(matiere => {
        const result = updateMatiere(matiere.code);
        
        // Toujours ajouter Notes Défini (même si 0 pour les matières sans notes)
        totalNotesDefini += result.notesDefini;
        
        if (result.moyenne > 0) {
            matieresAvecNotes++;
            detailsCalcul.push({
                matiere: matiere.nom,
                moyenne: result.moyenne,
                coefficient: matiere.coef,
                notesDefini: result.notesDefini
            });
        } else {
            detailsCalcul.push({
                matiere: matiere.nom,
                moyenne: 0,
                coefficient: matiere.coef,
                notesDefini: 0,
                sansNotes: true
            });
        }
    });
    
    // === ÉTAPE 2: Vérifier qu'il y a au moins une note ===
    if (matieresAvecNotes === 0) {
        alert('⚠️ Ajoute au moins une note dans au moins une matière avant de calculer !');
        return;
    }
    
    // === ÉTAPE 3: APPLIQUER LA RÈGLE PRINCIPALE : Division par le coefficient total ===
    const moyenneGenBrute = totalNotesDefini / coefficientTotal;
    
    // === ÉTAPE 4: Arrondir au 0.25 près ===
    const moyenneGenArrondie = Math.round(moyenneGenBrute * 4) / 4;
    
    // === ÉTAPE 5: Afficher les détails du calcul ===
    console.log('=== DÉTAILS DU CALCUL ===');
    detailsCalcul.forEach(detail => {
        if (detail.sansNotes) {
            console.log(`${detail.matiere}: Pas de notes → 0 × ${detail.coefficient} = 0`);
        } else {
            console.log(`${detail.matiere}: ${detail.moyenne.toFixed(2)} × ${detail.coefficient} = ${detail.notesDefini.toFixed(2)}`);
        }
    });
    
    console.log('=== RÉSULTAT FINAL ===');
    console.log(`Total Notes Défini: ${totalNotesDefini.toFixed(2)}`);
    console.log(`Coefficient total: ${coefficientTotal}`);
    console.log(`Calcul: ${totalNotesDefini.toFixed(2)} ÷ ${coefficientTotal} = ${moyenneGenBrute.toFixed(4)}`);
    console.log(`Moyenne arrondie (0.25): ${moyenneGenArrondie.toFixed(2)}/20`);
    console.log(`Matières avec notes: ${matieresAvecNotes}/${currentMatieres.length}`);
    
    // === ÉTAPE 6: Mettre à jour l'affichage ===
    updateGlobalDisplay(moyenneGenArrondie);
    
    // === ÉTAPE 7: Mettre à jour l'état ===
    isCalculated = true;
    updateButtonsState();
    
    // === ÉTAPE 8: Feedback visuel ===
    btnCalculer.innerHTML = '<i class="fas fa-check"></i> CALCULÉ !';
    btnCalculer.style.background = 'linear-gradient(90deg, var(--success), #6CFF47)';
    
    setTimeout(() => {
        btnCalculer.innerHTML = '<i class="fas fa-calculator"></i> RECALCULER';
        btnCalculer.style.background = 'linear-gradient(90deg, var(--primary), #FF6B9D)';
    }, 2000);
}

function updateGlobalDisplay(moyenne) {
    // Mettre à jour les valeurs
    const moyenneFormatee = moyenne > 0 ? moyenne.toFixed(2) : '--.--';
    moyenneGenerale.textContent = moyenneFormatee;
    finalGrade.textContent = moyenneFormatee;
    
    // Trouver l'appréciation
    const appreciation = APPRECIATIONS.find(a => 
        moyenne >= a.min && moyenne <= a.max
    ) || APPRECIATIONS[4];
    
    // Mettre à jour le texte d'appréciation
    appreciationText.innerHTML = `
        <span style="font-size: 1.5em;">${appreciation.emoji}</span><br>
        ${appreciation.text}
    `;
    
    // Changer la couleur de la carte
    const appreciationCard = document.querySelector('.appreciation-card');
    if (appreciationCard) {
        appreciationCard.style.background = `linear-gradient(135deg, ${appreciation.color}, ${lightenColor(appreciation.color, 30)})`;
    }
    
    // Animation
    moyenneGenerale.style.transform = 'scale(1.1)';
    moyenneGenerale.style.color = appreciation.color;
    
    setTimeout(() => {
        moyenneGenerale.style.transform = 'scale(1)';
    }, 300);
}

function lightenColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)}`;
}

function updateButtonsState() {
    // Vérifier si au moins une note est remplie
    const hasNotes = document.querySelectorAll('.note-input.valid').length > 0;
    
    // Activer/désactiver les boutons
    btnCalculer.disabled = !hasNotes;
    btnSave.disabled = !isCalculated;
    btnShare.disabled = !isCalculated;
}

function resetAll() {
    // Réinitialiser toutes les inputs
    document.querySelectorAll('.note-input').forEach(input => {
        input.value = '';
        input.classList.remove('error', 'valid');
        
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.style.display = 'none';
    });
    
    // Réinitialiser l'affichage des matières
    currentMatieres.forEach(matiere => {
        const mclasseEl = document.getElementById(`mclasse-${matiere.code}`);
        const moyEl = document.getElementById(`moy-${matiere.code}`);
        const definiEl = document.getElementById(`defini-${matiere.code}`);
        const obsEl = document.getElementById(`obs-${matiere.code}`);
        
        if (mclasseEl) mclasseEl.textContent = '--.--';
        if (moyEl) moyEl.textContent = '--.--';
        if (definiEl) definiEl.textContent = '--.--';
        
        if (obsEl) {
            obsEl.textContent = '--';
            obsEl.style.backgroundColor = '';
            obsEl.style.color = '';
            obsEl.style.border = '';
        }
    });
    
    // Réinitialiser l'affichage global
    moyenneGenerale.textContent = '--.--';
    finalGrade.textContent = '--.--';
    appreciationText.textContent = 'Remplis tes notes et clique sur "Calculer la moyenne"';
    moyenneGenerale.style.color = '';
    
    // Réinitialiser la carte d'appréciation
    const appreciationCard = document.querySelector('.appreciation-card');
    if (appreciationCard) {
        appreciationCard.style.background = 'linear-gradient(135deg, rgba(138, 43, 226, 0.8), rgba(255, 77, 141, 0.8))';
    }
    
    // Réinitialiser l'état
    isCalculated = false;
    updateButtonsState();
    
    // Réinitialiser le bouton calculer
    btnCalculer.innerHTML = '<i class="fas fa-bolt"></i> CALCULER LA MOYENNE';
    btnCalculer.style.background = 'linear-gradient(90deg, var(--primary), #FF6B9D)';
    
    // Vider le cache des notes
    notesCache = {};
}

// ===== SAUVEGARDE =====
function showSaveModal() {
    if (btnSave.disabled) return;
    
    // Réinitialiser la sélection du trimestre
    trimOptions.forEach(opt => opt.classList.remove('selected'));
    trimOptions[0].classList.add('selected');
    
    // Pré-remplir le nom
    saveNameInput.value = `${currentClassSerie.textContent} - ${moyenneGenerale.textContent}/20`;
    
    // Afficher le modal
    saveModal.style.display = 'flex';
    saveNameInput.focus();
    saveNameInput.select();
}

function setupSaveModal() {
    const btnCancelSave = document.getElementById('btnCancelSave');
    const btnConfirmSave = document.getElementById('btnConfirmSave');
    
    // Sélection du trimestre
    trimOptions.forEach(option => {
        option.addEventListener('click', function() {
            trimOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Annuler
    btnCancelSave.addEventListener('click', function() {
        saveModal.style.display = 'none';
    });
    
    // Confirmer
    btnConfirmSave.addEventListener('click', function() {
        const nom = saveNameInput.value.trim();
        
        if (!nom) {
            alert('⚠️ Donne un nom à ton bulletin !');
            saveNameInput.focus();
            return;
        }
        
        // Récupérer les données
        const bulletin = {
            classe: currentClassSerie.textContent,
            nom: nom,
            moyenne: moyenneGenerale.textContent,
            date: new Date().toLocaleDateString('fr-FR'),
            timestamp: Date.now(),
            matieres: []
        };
        
        // Ajouter les données des matières
        currentMatieres.forEach(matiere => {
            const result = updateMatiere(matiere.code);
            if (result.moyenne > 0) {
                bulletin.matieres.push({
                    nom: matiere.nom,
                    coeff: matiere.coef,
                    moyenne: result.moyenne,
                    notesDefini: result.notesDefini
                });
            }
        });
        
        // Sauvegarder dans localStorage
        try {
            const historique = JSON.parse(localStorage.getItem('noteway_bulletins_lycee') || '[]');
            historique.push(bulletin);
            localStorage.setItem('noteway_bulletins_lycee', JSON.stringify(historique.slice(0, 50)));
            
            alert(`✅ Bulletin "${nom}" sauvegardé !`);
        } catch (e) {
            alert('✅ Bulletin sauvegardé !');
        }
        
        // Fermer le modal
        saveModal.style.display = 'none';
        
        // Animation de confirmation
        btnSave.innerHTML = '<i class="fas fa-check"></i> SAUVEGARDÉ !';
        setTimeout(() => {
            btnSave.innerHTML = '<i class="fas fa-save"></i> SAUVEGARDER';
        }, 2000);
    });
    
    // Fermer en cliquant en dehors
    saveModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
}

function shareResults() {
    if (btnShare.disabled) return;
    
    const moyenne = moyenneGenerale.textContent;
    const classeSerie = currentClassSerie.textContent;
    const appreciation = appreciationText.textContent.split('\n')[0];
    
    const texte = `🎓 MA MOYENNE LYCÉE ${classeSerie} : ${moyenne}/20\n` +
                 `📝 ${appreciation}\n` +
                 `Calculée sur NOTEWAY • L'outil ultime des élèves\n` +
                 `👉 https://noteway.tg`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(texte)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

// ===== GESTION DU SCROLL HORIZONTAL =====
function checkTableScroll() {
    const tableContainer = document.querySelector('.table-container');
    
    if (tableContainer && scrollHint) {
        const needsScroll = tableContainer.scrollWidth > tableContainer.clientWidth;
        
        if (needsScroll) {
            scrollHint.classList.add('visible');
            
            // Ajouter une indication visuelle
            if (!tableContainer.dataset.scrollListener) {
                tableContainer.addEventListener('scroll', function() {
                    const isAtStart = this.scrollLeft === 0;
                    const isAtEnd = this.scrollLeft + this.clientWidth >= this.scrollWidth - 1;
                    
                    if (isAtEnd) {
                        scrollHint.innerHTML = '<i class="fas fa-arrow-left"></i> Défile vers la gauche pour voir le début';
                    } else if (isAtStart) {
                        scrollHint.innerHTML = '<i class="fas fa-arrow-right"></i> Défile vers la droite pour voir la suite';
                    } else {
                        scrollHint.innerHTML = '<i class="fas fa-arrows-left-right"></i> Défile horizontalement pour tout voir';
                    }
                });
                
                tableContainer.dataset.scrollListener = 'true';
            }
        } else {
            scrollHint.classList.remove('visible');
        }
    }
}

// ===== CSS DYNAMIQUE POUR LES OPTIONS =====
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .option-indicator {
            font-size: 0.7rem;
            color: var(--accent);
            background: rgba(0, 245, 212, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 5px;
        }
        
        .options-container {
            background: rgba(138, 43, 226, 0.1);
            border-radius: 15px;
            padding: 20px;
            margin-bottom: 25px;
            display: none;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            border: 2px dashed var(--secondary);
        }
        
        .option-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 15px 25px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s;
        }
        
        .option-item:hover {
            border-color: var(--accent);
            background: rgba(0, 245, 212, 0.05);
        }
        
        .option-checkbox {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            font-weight: 600;
            color: white;
        }
        
        .option-checkbox input[type="checkbox"] {
            width: 20px;
            height: 20px;
            accent-color: var(--accent);
            cursor: pointer;
        }
        
        .option-name {
            font-size: 1.1rem;
        }
        
        .option-coef {
            color: var(--accent);
            font-size: 0.9rem;
            background: rgba(0, 245, 212, 0.1);
            padding: 3px 8px;
            border-radius: 5px;
        }
    `;
    document.head.appendChild(style);
}

// Ajouter les styles dynamiques au chargement
document.addEventListener('DOMContentLoaded', addDynamicStyles);

// ===== FONCTION DE DÉMONSTRATION =====
function chargerDonneesDemo() {
    console.log('Chargement des données de démonstration...');
    
    // Simuler la sélection d'une classe et série
    currentClasse = 'seconde';
    currentSerie = 'a4';
    
    // Initialiser le tableau
    initializeTableForSerie();
    
    // Ajouter des données de test après un délai
    setTimeout(() => {
        const donneesDemo = [
            { matiere: 'fr', notes: [12, 14, 13, 15], compo: 14.5 },
            { matiere: 'ang', notes: [10, 11, 12, 13], compo: 11.5 },
            { matiere: 'maths', notes: [15, 16, 14, 17], compo: 15.5 },
            { matiere: 'pc', notes: [13, 14, 12, 15], compo: 13.5 },
            { matiere: 'philo', notes: [14, 15, 13, 16], compo: 14.5 },
            { matiere: 'all', notes: [16, 17, 15, 18], compo: 16.5 }
        ];
        
        donneesDemo.forEach(data => {
            const inputs = document.querySelectorAll(`.note-input[data-mat="${data.matiere}"]`);
            
            // Remplir les 4 notes
            for (let i = 0; i < 4; i++) {
                if (inputs[i] && data.notes[i]) {
                    inputs[i].value = data.notes[i];
                    inputs[i].classList.add('valid');
                }
            }
            
            // Remplir la composition
            if (inputs[4] && data.compo) {
                inputs[4].value = data.compo;
                inputs[4].classList.add('valid');
            }
        });
        
        // Calculer après un délai
        setTimeout(() => {
            currentMatieres.forEach(matiere => updateMatiere(matiere.code));
            calculateAll();
            updateButtonsState();
            
            console.log('=== DÉMO LYCÉE CHARGÉE ===');
        }, 500);
    }, 500);
}

// Pour charger des données de démonstration (décommenter pour tester)
// document.addEventListener('DOMContentLoaded', function() {
//     setTimeout(chargerDonneesDemo, 1500);
// });
