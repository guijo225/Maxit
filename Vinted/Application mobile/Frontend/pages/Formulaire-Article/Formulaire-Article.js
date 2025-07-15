Page({
    /**
     * Données initiales de la page
     */
    data: {
        nom_article: '', // Nom de l'article saisi
        prix: '', // Prix de l'article saisi
        marque: '', // Marque de l'article saisi
        selectedCategory: '', // Catégorie sélectionnée
        categories: ['Vêtements', 'Électronique', 'Meubles', 'Livres', 'Autres'], // Liste des catégories
        selectedSousCategory: '', // Sous-catégorie sélectionnée
        sous_categorie: ['Chossure', 'Portable', 'Ordinateur', 'Autres'],
        etat: ['Bon état', 'Neuf', 'Occasion', 'Autres'],
        selectedEtat_article: '', // État de l'article sélectionné
        couleur: [
            { name: 'Rouge', value: '#FF0000' },
            { name: 'Bleu', value: '#0000FF' },
            { name: 'Vert', value: '#00FF00' },
            { name: 'Noir', value: '#000000' },

        ], // Liste des couleurs disponibles
        selectedColor: '', // Couleur sélectionnée
        taille: ['S', 'M', 'L', 'XL', 'XXL'], // Liste des tailles
        selectedSize: '', // Taille sélectionnée
    },

    /**
     * Fonction pour sélectionner des images depuis la galerie ou l'appareil photo
     */
    chooseImage() {
        const that = this;
        wx.chooseImage({
            count: 3 - this.data.image_links.length, // Nombre d'images restantes autorisées
            sizeType: ['original', 'compressed'], // Types de taille d'image
            sourceType: ['album', 'camera'], // Sources possibles (galerie ou caméra)
            success(res) {
                const tempFiles = res.tempFiles;
                if (tempFiles.length + that.data.image_links.length > 3) {
                    wx.showToast({
                        title: 'Maximum 3 images !',
                        icon: 'none',
                    });
                    return;
                }
                if (tempFiles.length === 0) {
                    wx.showToast({
                        title: 'Veuillez sélectionner au moins une image !',
                        icon: 'none',
                    });
                    return;
                }
                const image_links = tempFiles.map(file => ({
                    path: file.path,
                    name: file.path.split('/').pop(),
                    displayName: file.path.split('/').pop().length > 15
                        ? file.path.split('/').pop().substring(0, 12) + '...'
                        : file.path.split('/').pop(), // Tronquer le nom si > 15 caractères
                    size: (file.size / 1024).toFixed(2), // Taille en KB
                }));
                that.setData({
                    image_links: [...that.data.image_links, ...image_links],
                });
            },
            fail() {
                wx.showToast({
                    title: 'Erreur lors de la sélection',
                    icon: 'none',
                });
            },
        });
    },

    /**
     * Supprimer une image de la liste
     */
    deleteImage(e) {
        const index = e.currentTarget.dataset.index;
        const image_links = this.data.image_links;
        image_links.splice(index, 1);
        this.setData({ image_links });
        if (image_links.length === 0) {
            wx.showToast({
                title: 'Veuillez sélectionner au moins une image !',
                icon: 'none',
            });
        }
    },

    /**
     * Gérer la saisie du nom de l'article
     */
    onNameInput(e) {
        this.setData({
            nom_article: e.detail.value,
        });
    },


    /**
     * Gérer la saisie du stock de l'article
     */
    onStockInput(e) {
        let value = e.detail.value;
        if (!/^\d*$/.test(value)) {
            wx.showToast({
                title: 'Veuillez entrer uniquement des chiffres',
                icon: 'none'
            });
            return;
        }

        this.setData({
            articleStock: value
        });
    },

    /**
     * Gérer la saisie du prix de l'article
     */
    onPrixInput(e) {
        let value = e.detail.value;
        if (!/^\d*$/.test(value)) {
            wx.showToast({
                title: 'Veuillez entrer uniquement des chiffres',
                icon: 'none'
            });
            return;
        }

        this.setData({
            prix: value
        });
    },

    /**
     * Gérer la saisie de la description de l'article
     */
    onDescriptionInput(e) {
        this.setData({
            articleDescription: e.detail.value,
        });
    },

    /**
     * Gérer la saisie de la marque de l'article
     */
    onMarqueInput(e) {
        this.setData({
            marque: e.detail.value,
        });
    },

    /**
     * Sélectionner une couleur
     */
    selectColor(e) {
        const color = e.currentTarget.dataset.color;
        this.setData({
            selectedColor: this.data.selectedColor === color ? '' : color, // Permet de désélectionner
        });
    },

    /**
     * Afficher la modal pour sélectionner une taille
     */
    showSizeModal() {
        const that = this;
        wx.showActionSheet({
            itemList: this.data.taille,
            success(res) {
                that.setData({
                    selectedSize: that.data.taille[res.tapIndex],
                });
            },
            fail() {
                wx.showToast({
                    title: 'Sélection annulée',
                    icon: 'none',
                });
            },
        });
    },

    /**
     * Afficher la modal pour sélectionner une catégorie
     */
    showCategoryModal() {
        const that = this;
        wx.showActionSheet({
            itemList: this.data.categories,
            success(res) {
                that.setData({
                    selectedCategory: that.data.categories[res.tapIndex],
                });
            },
            fail() {
                wx.showToast({
                    title: 'Sélection annulée',
                    icon: 'none',
                });
            },
        });
    },

    /**
     * Afficher la modal pour sélectionner une sous-catégorie
     */
    showSousCategoryModal() {
        const that = this;
        wx.showActionSheet({
            itemList: this.data.sous_categorie,
            success(res) {
                that.setData({
                    selectedSousCategory: that.data.sous_categorie[res.tapIndex],
                });
            },
            fail() {
                wx.showToast({
                    title: 'Sélection annulée',
                    icon: 'none',
                });
            },
        });
    },

    /**
     * Afficher la modal pour sélectionner l'état de l'article
     */
    showEtatArticleModal() {
        const that = this;
        wx.showActionSheet({
            itemList: this.data.etat,
            success(res) {
                that.setData({
                    selectedEtat_article: that.data.etat[res.tapIndex],
                });
            },
            fail() {
                wx.showToast({
                    title: 'Sélection annulée',
                    icon: 'none',
                });
            },
        });
    },

    /**
     * Valider et soumettre le formulaire
     */
    submitForm: function () {
        const {
            nom_article,
            selectedCategory,
            selectedSousCategory,
            selectedEtat_article,
            prix,
            marque,
            selectedColor,
            selectedSize,
        } = this.data;

        // Validation des champs obligatoires
        if (!nom_article) {
            wx.showToast({
                title: 'Veuillez entrer le nom de l\'article',
                icon: 'none',
            });
            return;
        }
        if (!selectedCategory) {
            wx.showToast({
                title: 'Veuillez sélectionner une catégorie',
                icon: 'none',
            });
            return;
        }
        if (!selectedSousCategory) {
            wx.showToast({
                title: 'Veuillez sélectionner une sous-catégorie',
                icon: 'none',
            });
            return;
        }
        if (!selectedEtat_article) {
            wx.showToast({
                title: 'Veuillez sélectionner l\'état de l\'article',
                icon: 'none',
            });
            return;
        }
        if (!prix) {
            wx.showToast({
                title: 'Veuillez entrer le prix',
                icon: 'none',
            });
            return;
        }
        if (!marque) {
            wx.showToast({
                title: 'Veuillez entrer la marque',
                icon: 'none',
            });
            return;
        }

        // Appeler Ajout_Article
        this.Ajout_Article();
    },

    /**
     * Fonction pour validation formulaire
     */
    Ajout_Article: function (e) {
        const articleData = {
            nom_article: this.data.nom_article,
            couleur: this.data.selectedColor || '', // Utiliser selectedColor, pas couleur
            prix: parseFloat(this.data.prix) || 0, // Convertir en nombre
            marque: this.data.marque,
            categorie: this.data.selectedCategory, // Utiliser selectedCategory, pas categories
            sous_categorie: this.data.selectedSousCategory, // Utiliser selectedSousCategory
            etat: this.data.selectedEtat_article, // Utiliser selectedEtat_article, pas etat
            taille: this.data.selectedSize || '', // Utiliser selectedSize, facultatif
        };

        // Validation des champs obligatoires
        const requiredFields = ['nom_article', 'couleur', 'prix', 'marque', 'categorie', 'sous_categorie', 'etat'];
        const missingFields = requiredFields.filter(field => !articleData[field]);

        if (missingFields.length > 0) {
            wx.showToast({
                title: `Champs manquants : ${missingFields.join(', ')}`,
                icon: 'none',
            });
            return;
        }

        // Vérifier que le prix est un nombre valide
        if (isNaN(articleData.prix) || articleData.prix <= 0) {
            wx.showToast({
                title: 'Le prix doit être un nombre positif',
                icon: 'none',
            });
            return;
        }

        console.log('Données envoyées:', articleData);

        wx.request({
            url: 'http://192.168.252.65:3000/articles',
            method: 'POST',
            header: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: articleData,
            success: (res) => {
                console.log('Réponse du serveur:', res);
                if (res.statusCode === 201) {
                    wx.showToast({
                        title: 'Article enregistré avec succès',
                        icon: 'success',
                        duration: 1500,
                    });
                    // Réinitialiser le formulaire après succès
                    this.setData({
                        nom_article: '',
                        prix: '',
                        marque: '',
                        selectedCategory: '',
                        selectedSousCategory: '',
                        selectedEtat_article: '',
                        selectedColor: '',
                        selectedSize: '',
                    });
                } else {
                    wx.showToast({
                        title: res.data.error || 'Erreur lors de l\'enregistrement',
                        icon: 'none',
                        duration: 1500,
                    });
                }
            },
            fail: (err) => {
                console.error('Erreur de requête:', err);
                wx.showToast({
                    title: 'Erreur de connexion au serveur',
                    icon: 'error',
                    duration: 1500,
                });
            },
        });
    },

    /**
     * Retour à la page précédente
     */
    goBack() {
        wx.navigateBack();
    },

    /**
     * Cycle de vie : Chargement de la page
     */
    onLoad(options) { },

    /**
     * Cycle de vie : Page rendue
     */
    onReady() { },

    /**
     * Cycle de vie : Page affichée
     */
    onShow() { },

    /**
     * Cycle de vie : Page cachée
     */
    onHide() { },

    /**
     * Cycle de vie : Page déchargée
     */
    onUnload() { },

    /**
     * Gestion du pull-down refresh
     */
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },

    /**
     * Gestion du bas de page atteint
     */
    onReachBottom() { },

    /**
     * Partage de la page
     */
    onShareAppMessage() {
        return {
            title: 'Ajouter un article',
            path: '/pages/Formulaire-Article/Formulaire-Article',
        };
    },
});