Page({
    /**
     * Données initiales de la page
     */
    data: {
        images: [], // Liste des images sélectionnées
        articleName: '', // Nom de l'article saisi
        articleStock: '', // Stock de l'article saisi
        articlePrix: '', // Prix de l'article saisi
        articleDescription: '', // Description de l'article saisi
        articleMarque: '', // Marque de l'article saisi
        selectedCategory: '', // Catégorie sélectionnée
        categories: ['Vêtements', 'Électronique', 'Meubles', 'Livres', 'Autres'], // Liste des catégories
        selectedSousCategory: '', // Sous-catégorie sélectionnée
        sous_categories: ['Chossure', 'Portable', 'Ordinateur', 'Autres'],
        etat_article: ['Bon état', 'Neuf', 'Occasion', 'Autres'],
        selectedEtat_article: '', // État de l'article sélectionné
        colors: [
            { name: 'Rouge', value: '#FF0000' },
            { name: 'Bleu', value: '#0000FF' },
            { name: 'Vert', value: '#00FF00' },
            { name: 'Noir', value: '#000000' },
        ], // Liste des couleurs disponibles
        selectedColor: '', // Couleur sélectionnée
        sizes: ['S', 'M', 'L', 'XL', 'XXL'], // Liste des tailles
        selectedSize: '', // Taille sélectionnée
    },

    /**
     * Fonction pour sélectionner des images depuis la galerie ou l'appareil photo
     */
    chooseImage() {
        const that = this;
        wx.chooseImage({
            count: 3 - this.data.images.length, // Nombre d'images restantes autorisées
            sizeType: ['original', 'compressed'], // Types de taille d'image
            sourceType: ['album', 'camera'], // Sources possibles (galerie ou caméra)
            success(res) {
                const tempFiles = res.tempFiles;
                if (tempFiles.length + that.data.images.length > 3) {
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
                const images = tempFiles.map(file => ({
                    path: file.path,
                    name: file.path.split('/').pop(),
                    displayName: file.path.split('/').pop().length > 15
                        ? file.path.split('/').pop().substring(0, 12) + '...'
                        : file.path.split('/').pop(), // Tronquer le nom si > 15 caractères
                    size: (file.size / 1024).toFixed(2), // Taille en KB
                }));
                that.setData({
                    images: [...that.data.images, ...images],
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
        const images = this.data.images;
        images.splice(index, 1);
        this.setData({ images });
        if (images.length === 0) {
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
            articleName: e.detail.value,
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
            articlePrix: value
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
            articleMarque: e.detail.value,
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
            itemList: this.data.sizes,
            success(res) {
                that.setData({
                    selectedSize: that.data.sizes[res.tapIndex],
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
            itemList: this.data.sous_categories,
            success(res) {
                that.setData({
                    selectedSousCategory: that.data.sous_categories[res.tapIndex],
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
            itemList: this.data.etat_article,
            success(res) {
                that.setData({
                    selectedEtat_article: that.data.etat_article[res.tapIndex],
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
    submitForm() {
        const {
            images,
            articleName,
            selectedCategory,
            selectedSousCategory,
            articleDescription,
            selectedEtat_article,
            articleStock,
            articlePrix,
            articleMarque,
            selectedColor,
            selectedSize
        } = this.data;

        // Vérification des champs obligatoires
        if (!images.length) {
            wx.showToast({
                title: 'Veuillez ajouter au moins une image',
                icon: 'none',
            });
            return;
        }
        if (!articleName) {
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
        if (!articleDescription) {
            wx.showToast({
                title: 'Veuillez entrer une description',
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
        if (!articleStock) {
            wx.showToast({
                title: 'Veuillez entrer le stock',
                icon: 'none',
            });
            return;
        }
        if (!articlePrix) {
            wx.showToast({
                title: 'Veuillez entrer le prix',
                icon: 'none',
            });
            return;
        }
        if (!articleMarque) {
            wx.showToast({
                title: 'Veuillez entrer la marque',
                icon: 'none',
            });
            return;
        }

        // Log des données
        console.log({
            images,
            articleName,
            selectedCategory,
            selectedSousCategory,
            articleDescription,
            selectedEtat_article,
            articleStock,
            articlePrix,
            articleMarque,
            selectedColor: selectedColor || 'Non spécifié',
            selectedSize: selectedSize || 'Non spécifié',
        });

        wx.showToast({
            title: 'Article ajouté avec succès !',
            icon: 'success',
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