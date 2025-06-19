// Gestion de la logique de la page
Page({
    /**
     * Données initiales de la page
     */
    data: {
        isExpanded: false,
        showModal: false,
        formData: {
            code: '' // Champ pour le mot de passe
        },
        avisList: [
            {
                id: 1,
                avatar: '/assets/avatar.jpg',
                nom: 'Odi Mariano',
                note: '⭐⭐⭐⭐⭐',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, voluptatibus! Ipsum dolor sit amet consectetur adipisicing elit. Quod, voluptatibus! Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                expanded: false,
                showButton: true
            },
            {
                id: 2,
                avatar: '/assets/avatar.jpg',
                nom: 'Marie Dubois',
                note: '⭐⭐⭐⭐',
                description: 'Excellent service, très satisfaite de mon achat. Je recommande vivement cette application à tous mes amis et ma famille. L\'expérience utilisateur est fantastique et l\'équipe support est très réactive.',
                expanded: false,
                showButton: true
            },
            {
                id: 3,
                avatar: '/assets/avatar.jpg',
                nom: 'Jean Martin',
                note: '⭐⭐⭐⭐⭐',
                description: 'Parfait !',
                expanded: false,
                showButton: false
            }
        ]
    },

    /**
     * Ouvre la modal
     */
    openModal() {
        this.setData({ showModal: true });
    },

    /**
     * Ferme la modal
     */
    closeModal() {
        this.setData({ 
            showModal: false,
            formData: { code: '' } // Réinitialise le champ
        });
    },

    /**
     * Gère les changements dans le champ de saisie
     */
    onInputChange(e) {
        const field = e.currentTarget.dataset.field;
        let value = e.detail.value;
        // Restreindre aux nombres uniquement
        value = value.replace(/[^0-9]/g, '').slice(0, 6); // Max 6 chiffres
        this.setData({
            [`formData.${field}`]: value
        });
    },

    /**
     * Confirme l'action de la modal
     */
    confirmModal() {
        // Logique pour gérer l'envoi du mot de passe
        console.log('Mot de passe soumis : ', this.data.formData.code);
        this.closeModal();
    },

    /**
     * Charge la page
     */
    onLoad() {
        this.checkTextLength();
    },

    /**
     * Vérifie la longueur des textes des avis
     */
    checkTextLength() {
        const avisList = this.data.avisList.map(item => {
            item.showButton = item.description.length > 100;
            return item;
        });
        this.setData({ avisList });
    },

    /**
     * Bascule l'affichage du texte
     */
    toggleText() {
        this.setData({
            isExpanded: !this.data.isExpanded
        });
    },

    /**
     * Bascule l'affichage des avis
     */
    toggleExpand(e) {
        const index = e.currentTarget.dataset.index;
        const avisList = this.data.avisList;
        avisList[index].expanded = !avisList[index].expanded;
        this.setData({ avisList });
        if (avisList[index].expanded) {
            setTimeout(() => {
                wx.pageScrollTo({
                    selector: `.avis-${index}`,
                    duration: 300
                });
            }, 100);
        }
    },

    /**
     * Redirige vers la page d'accueil
     */
    Integrer() {
        wx.redirectTo({
            url: '/pages/Accueil/Accueil',
        });
    }
});