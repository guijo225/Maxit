const API_URL = 'http://192.168.252.43:3000';

Page({
    data: {
        isExpanded: false,
        showModal: false,
        formData: {
            code: ''
        },
        avisList: [
            {
                id: 1,
                avatar: '../../images/avatar.jpg',
                nom: 'Odi Mariano',
                note: '⭐⭐⭐⭐⭐',
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, voluptatibus! Ipsum dolor sit amet consectetur adipisicing elit. Quod, voluptatibus! Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                expanded: false,
                showButton: true
            },
            {
                id: 2,
                avatar: '../../images/avatar.jpg',
                nom: 'Marie Dubois',
                note: '⭐⭐⭐⭐',
                description: 'Excellent service, très satisfaite de mon achat. Je recommande vivement cette application à tous mes amis et ma famille. L\'expérience utilisateur est fantastique et l\'équipe support est très réactive.',
                expanded: false,
                showButton: true
            },
            {
                id: 3,
                avatar: '../../images/avatar.jpg',
                nom: 'Jean Martin',
                note: '⭐⭐⭐⭐⭐',
                description: 'Parfait !',
                expanded: false,
                showButton: false
            }
        ],
        otp: '',
        numeroTelephone: '',
        // Liste des membres pour la modal
        memberList: [
            'Kouassi Jean charles',
            'Koné Arnzud',
            'Coulibali titi',
            'Cissé moka'
        ],
        dragIndex: -1,
        touchStartY: 0
    },

    onPhoneNumberInput(e) {
        this.setData({
            numeroTelephone: e.detail.value
        });
    },

    onOtpInput(e) {
        let value = e.detail.value;
        value = value.replace(/[^0-9]/g, '').slice(0, 6);
        this.setData({
            otp: value
        });
    },

    verifyOtp() {
        const { numeroTelephone, otp } = this.data;
        if (!numeroTelephone || !otp) {
            console.log("Veuillez entrer votre numéro et le code otp", 'error');
            return;
        }
        console.log("Vérification de l'otp", 'info');
        wx.request({
            url: `${API_URL}/verify-otp`,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                numeroTelephone: numeroTelephone,
                otp: otp
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    console.log('OTP vérifié avec succès!');
                    this.setData({ otpSent: false, otp: '' });
                    wx.navigateTo({
                        url: 'pages/PageGestion/PageGestion',
                    });
                } else {
                    console.log(`Erreur: ${res.data.message || "OTP invalide ou expiré"}`, 'error');
                }
            },
            fail: (err) => {
                console.error('Erreur réseau sendOtp:', err);
                console.log('Échec de la connexion au serveur.', 'error');
            }
        });
    },

    openModal() {
        this.setData({ showModal: true });
    },

    closeModal() {
        this.setData({ 
            showModal: false,
            formData: { code: '' }
        });
    },

    onTouchStart(e) {
        const index = e.currentTarget.dataset.index;
        this.setData({
            dragIndex: index,
            touchStartY: e.touches[0].clientY
        });
    },

    onTouchMove(e) {
        const { dragIndex, memberList, touchStartY } = this.data;
        if (dragIndex === -1) return;

        const currentY = e.touches[0].clientY;
        const deltaY = currentY - touchStartY;
        const itemHeight = 60; // Hauteur approximative d'un élément
        const moveIndex = Math.round(deltaY / itemHeight);

        if (moveIndex !== 0) {
            const newIndex = Math.max(0, Math.min(memberList.length - 1, dragIndex + moveIndex));
            if (newIndex !== dragIndex) {
                const newList = [...memberList];
                const [movedItem] = newList.splice(dragIndex, 1);
                newList.splice(newIndex, 0, movedItem);
                this.setData({
                    memberList: newList,
                    dragIndex: newIndex,
                    touchStartY: currentY
                });
            }
        }
    },

    onTouchEnd() {
        this.setData({
            dragIndex: -1
        });
    },

    validateOrder() {
        console.log('Nouvel ordre des membres :', this.data.memberList);
        // Exemple d'intégration avec un backend
        /*
        wx.request({
            url: `${API_URL}/update-order`,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            data: {
                order: this.data.memberList
            },
            success: (res) => {
                console.log('Ordre mis à jour:', res.data);
                this.closeModal();
            },
            fail: (err) => {
                console.error('Erreur:', err);
            }
        });
        */
        this.closeModal();
    },

    onLoad() {
        this.checkTextLength();
    },

    checkTextLength() {
        const avisList = this.data.avisList.map(item => {
            item.showButton = item.description.length > 100;
            return item;
        });
        this.setData({ avisList });
    },

    toggleText() {
        this.setData({
            isExpanded: !this.data.isExpanded
        });
    },

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

    Integrer() {
        wx.redirectTo({
            url: '/pages/PageGestion/PageGestion',
        });
    },

    preventClose() {}
});