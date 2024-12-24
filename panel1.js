class Panel1 {
    constructor(scene) {
        this.scene = scene;
        this.elements = [];
        this.initialize();
    }

    initialize() {
        const portraitX = 380 + 50;
        const portraitY = 105 + 110;

        // Create portrait elements
        this.playerPortrait = this.scene.add.sprite(portraitX, portraitY, 'raiTeiPortrait', 0);
        this.playerBorder = this.scene.add.sprite(portraitX, portraitY, 'frameBorder', 0);

        // Create text elements
        this.createTextElements(portraitX, portraitY);
        
        // Create buttons
        this.createButtons(portraitX, portraitY);

        // Set initial depths
        this.setElementsDepth();
    }

    createTextElements(portraitX, portraitY) {
        this.playerNameText = this.scene.add.bitmapText(portraitX + 50, portraitY - 40, 'customFont', '', 24);
        this.playerLevelText = this.scene.add.bitmapText(portraitX + 50, portraitY - 15, 'customFont', '', 20);
        this.playerExpText = this.scene.add.bitmapText(portraitX + 160, portraitY - 15, 'customFont', '', 20);
        this.playerPositionText = this.scene.add.bitmapText(portraitX, portraitY + 50, 'customFont', '', 24);
        this.playerPositionText.setOrigin(0.5);

        // Create attribute and rank labels
        const attributeLabel = this.scene.localization[this.scene.currentLanguage]['Stats_Attribute'] + ':';
        const rankLabel = this.scene.localization[this.scene.currentLanguage]['Stats_Rarity'] + ':';

        this.playerAttributeText = this.scene.add.bitmapText(portraitX + 50, portraitY + 10, 'customFont', attributeLabel, 20);
        this.playerAttributeIcon = this.scene.add.sprite(portraitX + 140, portraitY + 22, 'attributes', 0);

        this.playerRarityText = this.scene.add.bitmapText(portraitX + 160, portraitY + 10, 'customFont', rankLabel, 20);
        this.playerRarityIcon = this.scene.add.sprite(portraitX + 240, portraitY + 22, 'raritySprite', 0);

        // Stats texts
        this.createStatsTexts(portraitX, portraitY);
    }

    createStatsTexts(portraitX, portraitY) {
        const stats = ['TP', 'FP', 'Shoot', 'Dribble', 'Strength', 'Speed', 'Catch'];
        const positions = [
            {x: 50, y: 50}, {x: 160, y: 50},
            {x: 50, y: 75}, {x: 160, y: 75},
            {x: 50, y: 100}, {x: 160, y: 100},
            {x: 50, y: 125}
        ];

        stats.forEach((stat, index) => {
            const pos = positions[index];
            this[`player${stat}Text`] = this.scene.add.bitmapText(
                portraitX + pos.x, 
                portraitY + pos.y, 
                'customFont',
                `${this.scene.localization[this.scene.currentLanguage][`Stats_${stat}`]}: 0`, 
                20
            );
        });
    }

    createButtons(portraitX, portraitY) {
        const buttonY = portraitY + 220;
        const buttonSpacing = 120;

        // Create move, change and enhance buttons
        const buttons = ['Move', 'Change', 'Enhance'];
        const positions = [-buttonSpacing, 0, buttonSpacing];

        buttons.forEach((type, index) => {
            const x = portraitX + 150 + positions[index];
            this[`${type.toLowerCase()}Button`] = this.scene.add.image(x, buttonY, `BtFicha${type}`)
                .setInteractive({ useHandCursor: true })
                .setScale(0.9, 1);

            this[`${type.toLowerCase()}ButtonText`] = this.scene.add.bitmapText(
                x,
                buttonY,
                'customFont',
                this.scene.localization[this.scene.currentLanguage][`Formation_${type}Player`],
                26
            ).setOrigin(0.5);
        });
    }

    setElementsDepth() {
        // Get all elements
        this.elements = [
            this.playerPortrait, this.playerBorder,
            this.playerNameText, this.playerLevelText, this.playerExpText,
            this.playerAttributeIcon, this.playerAttributeText,
            this.playerRarityIcon, this.playerRarityText,
            this.playerPositionText,
            this.playerTPText, this.playerFPText,
            this.playerShootText, this.playerDribbleText,
            this.playerStrengthText, this.playerSpeedText,
            this.playerKeeperText,
            this.moveButton, this.moveButtonText,
            this.changeButton, this.changeButtonText,
            this.enhanceButton, this.enhanceButtonText
        ];

        // Set depth for all elements
        this.elements.forEach(element => {
            if (element) {
                element.setDepth(2);
            }
        });

        // Set specific depths for portrait elements
        this.playerPortrait.setDepth(1.5);
        this.playerBorder.setDepth(1.5);
    }

    updatePlayerInfo(playerData) {
        if (!playerData) return;

        const fullName = (this.scene.selectedNameStyle === 'dub' && this.scene.currentLanguage === 'en') ?
            playerData.name : playerData.undubName;

        // Update text elements
        this.playerNameText.setText(fullName || '');
        this.playerLevelText.setText(`Lv.${playerData.level || 1}`);
        this.playerExpText.setText(`Exp: ${playerData.exp || 0}/500`);
        this.playerTPText.setText(`${this.scene.localization[this.scene.currentLanguage]['Stats_TP']}: ${playerData.TP || 0}`);
        this.playerFPText.setText(`${this.scene.localization[this.scene.currentLanguage]['Stats_FP']}: ${playerData.FP || 0}`);
        this.playerShootText.setText(`${this.scene.localization[this.scene.currentLanguage]['Stats_Shoot']}: ${playerData.shoot || 0}`);
        this.playerDribbleText.setText(`${this.scene.localization[this.scene.currentLanguage]['Stats_Dribble']}: ${playerData.dribble || 0}`);
        this.playerStrengthText.setText(`${this.scene.localization[this.scene.currentLanguage]['Stats_Strength']}: ${playerData.strength || 0}`);
        this.playerSpeedText.setText(`${this.scene.localization[this.scene.currentLanguage]['Stats_Speed']}: ${playerData.speed || 0}`);
        this.playerKeeperText.setText(`${this.scene.localization[this.scene.currentLanguage]['Stats_Catch']}: ${playerData.keeper || 0}`);

        // Update attribute and rarity
        const attributeFrame = this.scene.playerStats.getAttributeFrame(playerData.attribute);
        const borderFrame = this.scene.playerStats.getRarityFrame(playerData.rarity);
        
        this.playerAttributeIcon.setFrame(attributeFrame);
        this.playerRarityIcon.setFrame(borderFrame);
        
        // Update portrait and border
        this.playerPortrait.setFrame(playerData.portraitFrame || 0);
        this.playerBorder.setFrame(borderFrame);

        // Show all elements
        this.elements.forEach(element => {
            if (element) element.setVisible(true);
        });
    }

    setVisibility(visible, depth = 2, alpha = 1) {
        this.elements.forEach(element => {
            if (element) {
                element.setVisible(visible);
                element.setDepth(depth);
                element.setAlpha(alpha);
            }
        });
    }

    disableInteractions() {
        this.elements.forEach(element => {
            if (element && element.disableInteractive) {
                element.disableInteractive();
                if (element.removeInteractive) {
                    element.removeInteractive();
                }
            }
        });
    }

    enableInteractions() {
        const interactiveElements = [
            this.moveButton,
            this.moveButtonText,
            this.changeButton,
            this.changeButtonText,
            this.enhanceButton,
            this.enhanceButtonText
        ];

        interactiveElements.forEach(element => {
            if (element && element.setInteractive) {
                element.setInteractive({ useHandCursor: true });
            }
        });
    }

    destroy() {
        this.elements.forEach(element => {
            if (element) element.destroy();
        });
        this.elements = [];
    }
}
