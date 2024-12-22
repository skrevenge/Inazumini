class StatsPanel {
    constructor(scene) {
        this.scene = scene;
        this.panel = null;
        this.statsText = null;
        this.playerPortrait = null;
        this.playerBorder = null;
        this.playerNameText = null;
        this.playerLevelText = null;
        this.playerExpText = null;
        this.playerPositionText = null;
        this.playerAttributeText = null;
        this.playerAttributeIcon = null;
        this.playerRarityText = null;
        this.playerRarityIcon = null;
        this.playerTPText = null;
        this.playerFPText = null;
        this.playerShootText = null;
        this.playerDribbleText = null;
        this.playerStrengthText = null;
        this.playerSpeedText = null;
        this.playerKeeperText = null;
        this.panelButtons = [];
        this.moveButton = null;
        this.moveButtonText = null;
        this.changeButton = null;
        this.changeButtonText = null;
        this.enhanceButton = null;
        this.enhanceButtonText = null;
    }

    create() {
        // Create panel background
        this.panel = this.scene.add.image(580, 290, 'FormFichaBlue');
        
        // Create stats text header
        this.statsText = this.scene.add.bitmapText(380 + 97, 105 + 30, 'customFont',
            this.scene.localization[this.scene.currentLanguage]['Stats_Stats'], 36);
        this.statsText.setOrigin(0.5);

        // Create player portrait section
        const portraitX = 380 + 50;
        const portraitY = 105 + 110;

        this.createPortraitSection(portraitX, portraitY);
        this.createStatsSection(portraitX, portraitY);
        this.createButtons(portraitX, portraitY + 220);

        // Set initial depths
        this.setInitialDepths();

        return this;
    }

    createPortraitSection(portraitX, portraitY) {
        this.playerPortrait = this.scene.add.sprite(portraitX, portraitY, 'raiTeiPortrait', 0);
        this.playerBorder = this.scene.add.sprite(portraitX, portraitY, 'frameBorder', 0);
        
        this.playerNameText = this.scene.add.bitmapText(portraitX + 50, portraitY - 40, 'customFont', '', 24);
        this.playerLevelText = this.scene.add.bitmapText(portraitX + 50, portraitY - 15, 'customFont', '', 20);
        this.playerExpText = this.scene.add.bitmapText(portraitX + 160, portraitY - 15, 'customFont', '', 20);
        this.playerPositionText = this.scene.add.bitmapText(portraitX, portraitY + 50, 'customFont', '', 24);
        this.playerPositionText.setOrigin(0.5);
    }

    createStatsSection(portraitX, portraitY) {
        const attributeLabel = this.scene.localization[this.scene.currentLanguage]['Stats_Attribute'] + ':';
        const rankLabel = this.scene.localization[this.scene.currentLanguage]['Stats_Rarity'] + ':';

        this.playerAttributeText = this.scene.add.bitmapText(portraitX + 50, portraitY + 10, 'customFont', attributeLabel, 20);
        this.playerAttributeIcon = this.scene.add.sprite(portraitX + 140, portraitY + 22, 'attributes', 0);
        this.playerRarityText = this.scene.add.bitmapText(portraitX + 160, portraitY + 10, 'customFont', rankLabel, 20);
        this.playerRarityIcon = this.scene.add.sprite(portraitX + 240, portraitY + 22, 'raritySprite', 0);

        this.createStatTexts(portraitX, portraitY);
    }

    createStatTexts(portraitX, portraitY) {
        const lang = this.scene.currentLanguage;
        const loc = this.scene.localization[lang];

        this.playerTPText = this.scene.add.bitmapText(portraitX + 50, portraitY + 50, 'customFont', 
            `${loc['Stats_TP']}: 0`, 20);
        this.playerFPText = this.scene.add.bitmapText(portraitX + 160, portraitY + 50, 'customFont',
            `${loc['Stats_FP']}: 0`, 20);
        this.playerShootText = this.scene.add.bitmapText(portraitX + 50, portraitY + 75, 'customFont',
            `${loc['Stats_Shoot']}: 0`, 20);
        this.playerDribbleText = this.scene.add.bitmapText(portraitX + 160, portraitY + 75, 'customFont',
            `${loc['Stats_Dribble']}: 0`, 20);
        this.playerStrengthText = this.scene.add.bitmapText(portraitX + 50, portraitY + 100, 'customFont',
            `${loc['Stats_Strength']}: 0`, 20);
        this.playerSpeedText = this.scene.add.bitmapText(portraitX + 160, portraitY + 100, 'customFont',
            `${loc['Stats_Speed']}: 0`, 20);
        this.playerKeeperText = this.scene.add.bitmapText(portraitX + 50, portraitY + 125, 'customFont',
            `${loc['Stats_Catch']}: 0`, 20);
    }

    createButtons(portraitX, buttonY) {
        const buttonSpacing = 120;
        
        // Move Button
        this.moveButton = this.scene.add.image(portraitX + 150 - buttonSpacing, buttonY, 'BtFichaMove')
            .setInteractive({ useHandCursor: true })
            .setScale(0.9, 1);

        this.moveButtonText = this.scene.add.bitmapText(
            portraitX + 150 - buttonSpacing,
            buttonY,
            'customFont',
            this.scene.localization[this.scene.currentLanguage]['Formation_MovePlayer'],
            26
        ).setOrigin(0.5);

        // Change Button
        this.changeButton = this.scene.add.image(portraitX + 150, buttonY, 'BtFichaChange')
            .setInteractive({ useHandCursor: true })
            .setScale(0.9, 1);

        this.changeButtonText = this.scene.add.bitmapText(
            portraitX + 150,
            buttonY,
            'customFont',
            this.scene.localization[this.scene.currentLanguage]['Formation_ChangePlayer'],
            26
        ).setOrigin(0.5);

        // Enhance Button
        this.enhanceButton = this.scene.add.image(portraitX + 150 + buttonSpacing, buttonY, 'BtFichaEnhance')
            .setInteractive({ useHandCursor: true })
            .setScale(0.9, 1);

        this.enhanceButtonText = this.scene.add.bitmapText(
            portraitX + 150 + buttonSpacing,
            buttonY,
            'customFont',
            this.scene.localization[this.scene.currentLanguage]['Formation_Enhance'],
            26
        ).setOrigin(0.5);

        this.panelButtons = [
            this.moveButton, this.moveButtonText,
            this.changeButton, this.changeButtonText,
            this.enhanceButton, this.enhanceButtonText
        ];
    }

    setInitialDepths() {
        const elements = [
            this.playerNameText, this.playerLevelText, this.playerExpText,
            this.playerAttributeIcon, this.playerAttributeText,
            this.playerRarityIcon, this.playerRarityText,
            this.playerPositionText,
            this.playerTPText, this.playerFPText,
            this.playerShootText, this.playerDribbleText,
            this.playerStrengthText, this.playerSpeedText,
            this.playerKeeperText,
            ...this.panelButtons
        ];

        elements.forEach(element => {
            if (element) element.setDepth(2);
        });

        this.playerPortrait?.setDepth(1.5);
        this.playerBorder?.setDepth(1.5);
    }

    updatePlayerInfo(playerData) {
        if (!playerData) return;

        const fullName = (this.scene.selectedNameStyle === 'dub' && this.scene.currentLanguage === 'en') ?
            playerData.name : playerData.undubName;

        // Update portrait and border
        this.playerPortrait.setFrame(playerData.portraitFrame || 0);
        this.playerPortrait.setVisible(true);
        const borderFrame = this.scene.playerStats.getRarityFrame(playerData.rarity);
        this.playerBorder.setFrame(borderFrame);
        this.playerBorder.setVisible(true);

        // Update text elements
        this.updateTexts(playerData, fullName);
        this.updateIcons(playerData, borderFrame);
    }

    updateTexts(playerData, fullName) {
        const lang = this.scene.currentLanguage;
        const loc = this.scene.localization[lang];

        this.playerNameText.setText(fullName || '');
        this.playerLevelText.setText(`Lv.${playerData.level || 1}`);
        this.playerExpText.setText(`Exp: ${playerData.exp || 0}/500`);
        this.playerTPText.setText(`${loc['Stats_TP']}: ${playerData.TP || 0}`);
        this.playerFPText.setText(`${loc['Stats_FP']}: ${playerData.FP || 0}`);
        this.playerShootText.setText(`${loc['Stats_Shoot']}: ${playerData.shoot || 0}`);
        this.playerDribbleText.setText(`${loc['Stats_Dribble']}: ${playerData.dribble || 0}`);
        this.playerStrengthText.setText(`${loc['Stats_Strength']}: ${playerData.strength || 0}`);
        this.playerSpeedText.setText(`${loc['Stats_Speed']}: ${playerData.speed || 0}`);
        this.playerKeeperText.setText(`${loc['Stats_Catch']}: ${playerData.keeper || 0}`);

        this.playerAttributeText.setText(loc['Stats_Attribute'] + ':');
        this.playerRarityText.setText(loc['Stats_Rarity'] + ':');
    }

    updateIcons(playerData, borderFrame) {
        const attributeFrame = this.scene.playerStats.getAttributeFrame(playerData.attribute);
        this.playerAttributeIcon.setFrame(attributeFrame);
        this.playerRarityIcon.setFrame(borderFrame);
    }

    setVisible(visible) {
        const elements = [
            this.panel,
            this.statsText,
            this.playerPortrait,
            this.playerBorder,
            this.playerNameText,
            this.playerLevelText,
            this.playerExpText,
            this.playerPositionText,
            this.playerAttributeText,
            this.playerAttributeIcon,
            this.playerRarityText,
            this.playerRarityIcon,
            this.playerTPText,
            this.playerFPText,
            this.playerShootText,
            this.playerDribbleText,
            this.playerStrengthText,
            this.playerSpeedText,
            this.playerKeeperText,
            ...this.panelButtons
        ];

        elements.forEach(element => {
            if (element) element.setVisible(visible);
        });
    }

    destroy() {
        const elements = [
            this.panel,
            this.statsText,
            this.playerPortrait,
            this.playerBorder,
            this.playerNameText,
            this.playerLevelText,
            this.playerExpText,
            this.playerPositionText,
            this.playerAttributeText,
            this.playerAttributeIcon,
            this.playerRarityText,
            this.playerRarityIcon,
            this.playerTPText,
            this.playerFPText,
            this.playerShootText,
            this.playerDribbleText,
            this.playerStrengthText,
            this.playerSpeedText,
            this.playerKeeperText,
            ...this.panelButtons
        ];

        elements.forEach(element => {
            if (element) element.destroy();
        });
    }

    getElements() {
        return [
            this.playerPortrait,
            this.playerBorder,
            this.playerNameText,
            this.playerLevelText,
            this.playerExpText,
            this.playerAttributeIcon,
            this.playerAttributeText,
            this.playerRarityIcon,
            this.playerRarityText,
            this.playerPositionText,
            this.playerTPText,
            this.playerFPText,
            this.playerShootText,
            this.playerDribbleText,
            this.playerStrengthText,
            this.playerSpeedText,
            this.playerKeeperText,
            ...this.panelButtons
        ];
    }
}
