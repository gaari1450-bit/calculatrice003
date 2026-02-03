// ===== CONFIGURATION =====
const MATIERES = [
    { code: 'fr', nom: 'Français', coef: 3 },
    { code: 'ang', nom: 'Anglais', coef: 2 },
    { code: 'his', nom: 'Histoire-Géographie', coef: 2 },
    { code: 'ecm', nom: 'ECM', coef: 2 },
    { code: 'maths', nom: 'Mathématiques', coef: 3 },
    { code: 'pc', nom: 'Physique-Chimie', coef: 3 },
    { code: 'svt', nom: 'SVT', coef: 2 },
    { code: 'eps', nom: 'EPS', coef: 1 }
];

// Somme FIXE de tous les coefficients
const COEFFICIENT_TOTAL = 18;

const APPRECIATIONS = [
    { min: 16, max: 20, text: "🔥 WAW ! T'es un vrai boss ! Excellence totale !", emoji: "👑", color: "#00F5D4" },
    { min: 14, max: 15.99, text: "🎯 Excellent travail ! Tu assures grave, continue comme ça !", emoji: "⭐", color: "#00BBF9" },
    { min: 12, max: 13.99, text: "👍 Pas mal du tout ! T'es sur la bonne voie, keep going !", emoji: "💪", color: "#00D4AA" },
    { min: 10, max: 11.99, text: "✅ Ça passe, mais tu peux faire mieux. Motive-toi !", emoji: "📚", color: "#FFD166" },
    { min: 0, max: 9.99, text: "💪 Il faut bosser davantage. Concentre-toi, tu peux y arriver !", emoji: "🎯", color: "#FF6B35" }
];

// ===== ÉLÉMENTS DOM =====
let selectionScreen, tableScreen, tableBody, currentClassEl;
let changeClassBtn, btnCalculer, btnReset, btnSave, btnShare;
let moyenneGenerale, finalGrade, appreciationText;
let saveModal, saveNameInput, trimOptions, scrollHint;

// ===== ÉTAT =====
let currentClass = '';
let currentTrimestre = '1';
let isCalculated = false;

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 NOTEWAY Collège - Initialisation');
    
    // Récupérer les éléments DOM
    initElements();
    
    // Configurer les événements
    setupEventListeners();
    
    // Vérifier le scroll
    checkTableScroll();
    
    console.log('✅ NOTEWAY Collège - Prêt ! Sélectionne ta classe.');
});

function initElements() {
    selectionScreen = document.getElementById('selectionScreen');
    tableScreen = document.getElementById('tableScreen');
    tableBody = document.getElementById('tableBody');
    currentClassEl = document.getElementById('currentClass');
    changeClassBtn = document.getElementById('changeClassBtn');
    btnCalculer = document.getElementById('btnCalculer');
    btnReset = document.getElementById('btnReset');
    btnSave = document.getElementById('btnSave');
    btnShare = document.getElementById('btnShare');
    moyenneGenerale = document.getElementById('moyenneGenerale');
    finalGrade = document.getElementById('finalGrade');
    appreciationText = document.getElementById('appreciationText');
    saveModal = document.getElementById('saveModal');
    saveNameInput = document.getElementById('saveName');
    trimOptions = document.querySelectorAll('.trim-option');
    scrollHint = document.getElementById('scrollHint');
    
    // S'assurer que seul l'écran de sélection est visible au début
    if (selectionScreen) selectionScreen.style.display = 'block';
    if (tableScreen) tableScreen.style.display = 'none';
}

function setupEventListeners() {
    // 1. Événements sur les cartes de classe
    document.querySelectorAll('.class-card').forEach(card => {
        card.addEventListener('click', function() {
            handleClassSelection(this.dataset.class);
        });
    });
    
    // 2. Bouton "Changer de classe"
    changeClassBtn.addEventListener('click', function() {
        // Réinitialiser la sélection visuelle
        document.querySelectorAll('.class-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Réinitialiser la classe courante
        currentClass = '';
        currentClassEl.textContent = '--';
        
        // Retour à l'écran de sélection
        selectionScreen.style.display = 'block';
        tableScreen.style.display = 'none';
    });
    
    // 3. Bouton "Calculer la moyenne"
    btnCalculer.addEventListener('click', calculateAll);
    
    // 4. Bouton "Tout effacer"
    btnReset.addEventListener('click', function() {
        if (confirm('Es-tu sûr de vouloir effacer toutes les notes ?')) {
            resetAll();
        }
    });
    
    // 5. Bouton "Sauvegarder"
    btnSave.addEventListener('click', showSaveModal);
    
    // 6. Bouton "Partager sur WhatsApp"
    btnShare.addEventListener('click', shareResults);
    
    // 7. Modal sauvegarde
    setupSaveModal();
    
    // 8. Vérifier le scroll horizontal
    window.addEventListener('resize', checkTableScroll);
}

function handleClassSelection(classNumber) {
    console.log('Sélection de classe:', classNumber);
    
    // Mettre à jour la sélection visuelle
    document.querySelectorAll('.class-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.class-card[data-class="${classNumber}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    // Mettre à jour la classe courante
    currentClass = classNumber;
    currentClassEl.textContent = classNumber + 'ème';
    
    // Afficher le tableau
    selectionScreen.style.display = 'none';
    tableScreen.style.display = 'block';
    
    // Initialiser le tableau
    initializeTable();
    checkTableScroll();
}

// ===== FONCTIONS DU TABLEAU =====
function initializeTable() {
    console.log('Initialisation du tableau');
    tableBody.innerHTML = '';
    
    MATIERES.forEach((matiere, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="col-matiere">
                <span class="mat-num">${(index + 1).toString().padStart(2, '0')}.</span> ${matiere.nom}
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
                               step="0.01"
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
                           step="0.01"
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
    
    // Réinitialiser l'état
    isCalculated = false;
    updateButtonsState();
}

function addNoteControls(row, matiereCode) {
    const inputs = row.querySelectorAll('.note-input');
    
    inputs.forEach((input, index) => {
        const container = input.parentElement;
        
        // Créer les boutons +/-
        const controls = document.createElement('div');
        controls.className = 'note-controls';
        controls.innerHTML = `
            <button class="note-btn note-plus" data-action="increment" title="Augmenter de 0.01">
                <i class="fas fa-plus"></i>
            </button>
            <button class="note-btn note-minus" data-action="decrement" title="Diminuer de 0.01">
                <i class="fas fa-minus"></i>
            </button>
        `;
        
        container.appendChild(controls);
        
        // Événements sur les boutons
        const plusBtn = controls.querySelector('.note-plus');
        const minusBtn = controls.querySelector('.note-minus');
        
        plusBtn.addEventListener('click', () => adjustNote(input, 0.01));
        minusBtn.addEventListener('click', () => adjustNote(input, -0.01));
    });
}

function adjustNote(input, delta) {
    let currentValue = parseFloat(input.value) || 0;
    let newValue = currentValue + delta;
    
    // Limiter entre 0 et 20
    newValue = Math.max(0, Math.min(20, newValue));
    
    // Arrondir au 0.01 le plus proche
    newValue = Math.round(newValue * 100) / 100;
    
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
    
    // Arrondir automatiquement au 0.01 près
    const rounded = Math.round(value * 100) / 100;
    if (Math.abs(value - rounded) > 0.001) {
        input.value = rounded.toFixed(2);
    }
    
    input.classList.add('valid');
    return true;
}

function updateMatiere(matiereCode) {
    const matiere = MATIERES.find(m => m.code === matiereCode);
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
        mCla = Math.round(moyenneBrute * 100) / 100; // DEUX DÉCIMALES
    }
    
    // === ÉTAPE 2: Récupérer et arrondir la composition ===
    const compoInput = inputs[4];
    let composition = 0;
    if (compoInput && compoInput.value) {
        const compoValue = parseFloat(compoInput.value);
        if (!isNaN(compoValue) && compoValue >= 0) {
            composition = Math.round(compoValue * 100) / 100; // DEUX DÉCIMALES
        }
    }
    
    // === ÉTAPE 3: Calculer la moyenne de la matière ===
    let moyenneMatiere = 0;
    
    if (mCla > 0 && composition > 0) {
        // RÈGLE: Les deux notes présentes → moyenne des deux
        const moyenneBrute = (mCla + composition) / 2;
        moyenneMatiere = Math.round(moyenneBrute * 100) / 100; // DEUX DÉCIMALES
    } else if (mCla > 0) {
        // RÈGLE: Seulement M.Cla → M.Cla = moyenne
        moyenneMatiere = mCla;
    } else if (composition > 0) {
        // RÈGLE: Seulement composition → composition = moyenne
        moyenneMatiere = composition;
    }
    // Sinon: moyenneMatiere reste à 0 (matière sans notes)
    
    // === ÉTAPE 4: Calculer Notes Défini ===
    const notesDefini = Math.round(moyenneMatiere * matiere.coef * 100) / 100;
    
    // === Mise à jour de l'affichage ===
    const mclasseEl = document.getElementById(`mclasse-${matiere.code}`);
    const moyEl = document.getElementById(`moy-${matiere.code}`);
    const definiEl = document.getElementById(`defini-${matiere.code}`);
    const obsEl = document.getElementById(`obs-${matiere.code}`);
    
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

// ===== CALCUL GÉNÉRAL AVEC RÈGLE DIVISION PAR 18 =====
function calculateAll() {
    console.log('=== DÉBUT DU CALCUL ===');
    
    let totalNotesDefini = 0;
    let matieresAvecNotes = 0;
    let detailsCalcul = [];
    
    // === ÉTAPE 1: Calculer le total des Notes Défini ===
    MATIERES.forEach(matiere => {
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
    
    // === ÉTAPE 3: APPLIQUER LA RÈGLE PRINCIPALE : Division par 18 ===
    const moyenneGenBrute = totalNotesDefini / COEFFICIENT_TOTAL;
    
    // === ÉTAPE 4: Arrondir au 0.01 près ===
    const moyenneGenArrondie = Math.round(moyenneGenBrute * 100) / 100; // DEUX DÉCIMALES
    
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
    console.log(`Coefficient total fixe: ${COEFFICIENT_TOTAL}`);
    console.log(`Calcul: ${totalNotesDefini.toFixed(2)} ÷ ${COEFFICIENT_TOTAL} = ${moyenneGenBrute.toFixed(4)}`);
    console.log(`Moyenne arrondie (0.01): ${moyenneGenArrondie.toFixed(2)}/20`);
    console.log(`Matières avec notes: ${matieresAvecNotes}/8`);
    
    // === ÉTAPE 6: Mettre à jour l'affichage ===
    updateGlobalDisplay(moyenneGenArrondie);
    
    // === ÉTAPE 7: Mettre à jour l'état ===
    isCalculated = true;
    updateButtonsState();
    
    // === ÉTAPE 8: Feedback visuel ===
    btnCalculer.innerHTML = '<i class="fas fa-check"></i> CALCULÉ !';
    btnCalculer.style.background = 'linear-gradient(90deg, #00D4AA, #00F5D4)';
    
    setTimeout(() => {
        btnCalculer.innerHTML = '<i class="fas fa-calculator"></i> RECALCULER';
        btnCalculer.style.background = '';
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
    MATIERES.forEach(matiere => {
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
        appreciationCard.style.background = 'linear-gradient(135deg, var(--secondary), #4DC8FF)';
    }
    
    // Réinitialiser l'état
    isCalculated = false;
    updateButtonsState();
    
    // Réinitialiser le bouton calculer
    btnCalculer.innerHTML = '<i class="fas fa-bolt"></i> CALCULER LA MOYENNE';
}

// ===== SAUVEGARDE =====
function showSaveModal() {
    if (btnSave.disabled) return;
    
    // Réinitialiser la sélection du trimestre
    trimOptions.forEach(opt => opt.classList.remove('selected'));
    trimOptions[0].classList.add('selected');
    currentTrimestre = '1';
    
    // Pré-remplir le nom
    saveNameInput.value = `${currentClass}ème - ${moyenneGenerale.textContent}/20`;
    
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
            currentTrimestre = this.dataset.trim;
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
            classe: currentClass + 'ème',
            trimestre: currentTrimestre,
            nom: nom,
            moyenne: moyenneGenerale.textContent,
            date: new Date().toLocaleDateString('fr-FR'),
            timestamp: Date.now(),
            matieres: []
        };
        
        // Ajouter les données des matières
        MATIERES.forEach(matiere => {
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
            const historique = JSON.parse(localStorage.getItem('noteway_bulletins') || '[]');
            historique.push(bulletin);
            localStorage.setItem('noteway_bulletins', JSON.stringify(historique.slice(0, 50)));
            
            alert(`✅ Bulletin "${nom}" sauvegardé pour le ${currentTrimestre}ème trimestre !`);
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
    const classe = currentClass + 'ème';
    const appreciation = appreciationText.textContent.split('\n')[0];
    
    const texte = `🎯 MA MOYENNE ${classe} : ${moyenne}/20\n` +
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

// ===== FONCTION DE DÉMONSTRATION =====
function chargerDonneesDemo() {
    console.log('Chargement des données de démonstration...');
    
    const donneesDemo = [
        { matiere: 'fr', notes: [12.50, 14.25, 13.75, 15.00], compo: 14.50 },
        { matiere: 'ang', notes: [10.75, 11.25, 12.50, 13.00], compo: 11.50 },
        { matiere: 'maths', notes: [15.25, 16.75, 14.50, 17.25], compo: 15.50 },
        { matiere: 'pc', notes: [13.33, 14.67, 12.50, 15.25], compo: 13.50 },
        { matiere: 'svt', notes: [14.75, 15.25, 13.33, 16.67], compo: 14.50 }
    ];
    
    donneesDemo.forEach(data => {
        const inputs = document.querySelectorAll(`.note-input[data-mat="${data.matiere}"]`);
        
        // Remplir les 4 notes
        for (let i = 0; i < 4; i++) {
            if (inputs[i] && data.notes[i]) {
                inputs[i].value = data.notes[i].toFixed(2);
                inputs[i].classList.add('valid');
            }
        }
        
        // Remplir la composition
        if (inputs[4] && data.compo) {
            inputs[4].value = data.compo.toFixed(2);
            inputs[4].classList.add('valid');
        }
    });
    
    // Calculer après un délai
    setTimeout(() => {
        MATIERES.forEach(matiere => updateMatiere(matiere.code));
        calculateAll();
        updateButtonsState();
        
        console.log('=== DÉMO CHARGÉE ===');
        console.log('Testez le calcul avec la règle: Total Notes Défini ÷ 18');
    }, 500);
}

// Pour charger des données de démonstration (décommenter pour tester)
// document.addEventListener('DOMContentLoaded', function() {
//     setTimeout(chargerDonneesDemo, 1500);
// });