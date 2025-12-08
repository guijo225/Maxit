// components/tour-details/tour-details.js
Component({
    properties: {
      // Mode: 'info' ou 'historique'
      mode: {
        type: String,
        value: 'info'
      },
      // Données brutes de la tontine
      tontineData: {
        type: Object,
        value: null,
        observer: 'onDataChanged'
      },
      // ID du tour sélectionné (pour mode historique)
      selectedTourId: {
        type: Number,
        value: null
      }
    },
  
    data: {
      tourData: {},
      participantsList: [],
      penalitesList: [],
      beneficiaire: null,
      hasMultipleTours: false,
      selectedTour: null,
      availableTours: []
    },
  
    methods: {
      /**
       * Callback quand les données changent
       */
      onDataChanged(newData) {
        if (!newData) return;
        
        if (this.data.mode === 'info') {
          this.prepareInfoMode(newData);
        } else {
          this.prepareHistoriqueMode(newData);
        }
      },
  
      /**
       * Prépare les données pour le mode INFO
       */
      prepareInfoMode(data) {
        // Gère les deux structures possibles
        let tontine;
        
        if (Array.isArray(data)) {
          // Structure: [{tour: [...], participant: [...], ...}]
          tontine = data[0];
        } else if (data.tontine) {
          // Structure: {tontine: {tour: [...], participant: [...], ...}}
          tontine = data.tontine;
        } else {
          // Structure directe: {tour: [...], participant: [...], ...}
          tontine = data;
        }
        
        if (!tontine || !tontine.tour || !tontine.tour[0]) {
          console.error('Structure de données invalide pour le mode info');
          return;
        }
        
        const currentTour = tontine.tour[0];
        
        // Données du tour
        this.setData({
          tourData: {
            numero_tour: currentTour.numero_tour,
            cotisation_count: currentTour.cotisation.length,
            total_participants: tontine.nombre_participants,
            montant_collecte: currentTour.montant_distribue,
            montant_total: tontine.montant_total
          }
        });
  
        // Liste des participants à jour
        const participants = [];
        tontine.participant.forEach((participant, index) => {
          participant.cotisation.forEach(cotisation => {
            if (cotisation.id_tour === currentTour.id_tour) {
              participants.push({
                nom: participant.utilisateur.nom,
                prenoms: participant.utilisateur.prenoms,
                montant: cotisation.montant_cotise,
                index: index + 1
              });
            }
          });
        });
  
        // Liste des pénalités
        const penalites = [];
        tontine.participant.forEach(participant => {
          if (participant.penalite && participant.penalite.length > 0) {
            participant.penalite.forEach(penalite => {
              penalites.push({
                nom: participant.utilisateur.nom,
                prenoms: participant.utilisateur.prenoms,
                montant: penalite.montant_penalite
              });
            });
          }
        });
  
        // Bénéficiaire
        const beneficiaire = tontine.participant.find(
          p => p.numero_ordre === currentTour.numero_tour
        );
  
        this.setData({
          participantsList: participants,
          penalitesList: penalites,
          beneficiaire: beneficiaire ? {
            nom: beneficiaire.utilisateur.nom,
            prenoms: beneficiaire.utilisateur.prenoms
          } : null
        });
      },
  
      /**
       * Prépare les données pour le mode HISTORIQUE
       */
      prepareHistoriqueMode(data) {
        // Gère les deux structures possibles
        let tontine;
        
        if (Array.isArray(data)) {
          // Structure: [{tour: [...], participant: [...], ...}]
          tontine = data[0];
        } else if (data.tontine) {
          // Structure: {tontine: {tour: [...], participant: [...], ...}}
          tontine = data.tontine;
        } else {
          // Structure directe: {tour: [...], participant: [...], ...}
          tontine = data;
        }
        
        if (!tontine || !tontine.tour) {
          console.error('Structure de données invalide pour le mode historique');
          return;
        }
        
        // Liste des tours terminés
        const toursTermines = tontine.tour.filter(t => t.statut_tour === "terminé");
        
        this.setData({
          hasMultipleTours: toursTermines.length > 1,
          availableTours: toursTermines.map(t => t.numero_tour)
        });
  
        // Tour à afficher (soit sélectionné, soit le premier)
        const tourId = this.data.selectedTourId || tontine.tour[0].id_tour;
        const tour = tontine.tour.find(t => t.id_tour === tourId) || tontine.tour[0];
  
        // Données du tour
        this.setData({
          tourData: {
            numero_tour: tour.numero_tour,
            cotisation_count: tour.cotisation.length,
            total_participants: tontine.nombre_participants,
            montant_collecte: tour.montant_distribue,
            montant_total: tontine.montant_total
          },
          selectedTour: tour.numero_tour
        });
  
        // Participants avec dates
        const participants = [];
        tontine.participant.forEach(participant => {
          participant.cotisation.forEach(cotisation => {
            if (cotisation.id_tour === tour.id_tour) {
              participants.push({
                nom: participant.utilisateur.nom,
                prenoms: participant.utilisateur.prenoms,
                montant: cotisation.montant_cotise,
                date: cotisation.date_cotisation
              });
            }
          });
        });
        participants.sort((a, b) => new Date(a.date) - new Date(b.date));
  
        // Pénalités avec dates et statut
        const penalites = [];
        tontine.participant.forEach(participant => {
          participant.penalite.forEach(penalite => {
            if (penalite.id_tour === tour.id_tour) {
              penalites.push({
                nom: participant.utilisateur.nom,
                prenoms: participant.utilisateur.prenoms,
                montant: penalite.montant_penalite,
                date: penalite.date_penalite,
                statut: penalite.statut_penalite
              });
            }
          });
        });
        penalites.sort((a, b) => new Date(a.date) - new Date(b.date));
  
        // Bénéficiaire
        const beneficiaire = tontine.participant.find(
          p => p.numero_ordre === tour.numero_tour
        );
  
        this.setData({
          participantsList: participants,
          penalitesList: penalites,
          beneficiaire: beneficiaire ? {
            nom: beneficiaire.utilisateur.nom,
            prenoms: beneficiaire.utilisateur.prenoms
          } : null
        });
      },
  
      /**
       * Gère la sélection d'un tour (mode historique)
       */
      onTourSelect() {
        if (!this.data.hasMultipleTours) return;
  
        const that = this;
        wx.showActionSheet({
          itemList: this.data.availableTours.map(num => `Tour N°${num}`),
          success(res) {
            const selectedNum = that.data.availableTours[res.tapIndex];
            
            // Récupère la structure de données correcte
            let tontine;
            if (that.data.tontineData.tontine) {
              tontine = that.data.tontineData.tontine;
            } else if (Array.isArray(that.data.tontineData)) {
              tontine = that.data.tontineData[0];
            } else {
              tontine = that.data.tontineData;
            }
            
            const tour = tontine.tour.find(
              t => t.numero_tour === selectedNum && t.statut_tour === "terminé"
            );
            
            if (tour) {
              that.setData({ selectedTourId: tour.id_tour });
              that.prepareHistoriqueMode(that.data.tontineData);
              
              // Émet un événement pour notifier la page parent
              that.triggerEvent('tourchanged', { tourId: tour.id_tour });
            }
          }
        });
      }
    }
  });