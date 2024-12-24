class PanelManager {
    constructor(scene) {
        this.scene = scene;
        this.isHissatsuPanelActive = false;
        this.initialize();
    }

    initialize() {
        this.createPanels();
        this.createInteractiveAreas();
        this.setupEventHandlers();
    }

    createPanels() {
        this.formationFicha1 = this.scene.add.image(580, 290, 'FormFichaBlue');
        this.formationFicha2 = this.scene.add.image(580, 290, 'FormFichaBlue');
        this.formationFicha2.setFlipX(true);

        this.formationStatsText = this.scene.add.bitmapText(380 + 97, 105 + 30, 'customFont',
            this.scene.localization[this.scene.currentLanguage]['Stats_Stats'], 36);
        this.formationStatsText.setOrigin(0.5);

        this.formationTechniqueText = this.scene.add.bitmapText(585 + 110, 105 + 30, 'customFont',
            this.scene.localization[this.scene.currentLanguage]['Stats_Hissatsu'], 36);
        this.formationTechniqueText.setOrigin(0.5);

        // Set initial depth and opacity
        this.formationFicha1.setDepth(1);
        this.formationFicha2.setDepth(0);
        this.formationStatsText.setDepth(2);
        this.formationTechniqueText.setDepth(2);

        this.formationFicha1.setAlpha(1);
        this.formationFicha2.setAlpha(0.75);
        this.formationStatsText.setAlpha(1);
        this.formationTechniqueText.setAlpha(0.75);
    }

    createInteractiveAreas() {
        this.leftRect = this.scene.add.rectangle(380 + 97, 105 + 30, 195, 60, 0x000000, 0);
        this.rightRect = this.scene.add.rectangle(585 + 97, 105 + 30, 195, 60, 0x000000, 0);

        this.leftRect.setOrigin(0.5);
        this.rightRect.setOrigin(0.5);

        this.leftRect.setInteractive({ useHandCursor: true });
        this.rightRect.setInteractive({ useHandCursor: true });
    }

    setupEventHandlers() {
        this.leftRect.on('pointerdown', () => this.handleLeftPanelClick());
        this.rightRect.on('pointerdown', () => this.handleRightPanelClick());
    }

    handleLeftPanelClick() {
        this.isHissatsuPanelActive = false;
        this.updatePanelVisuals(
            this.formationFicha1,
            this.formationFicha2,
            this.formationStatsText,
            this.formationTechniqueText,
            2.5,
            1
        );
        this.handlePanelElementsVisibility(false);
    }

    handleRightPanelClick() {
        this.isHissatsuPanelActive = true;
        this.updatePanelVisuals(
            this.formationFicha2,
            this.formationFicha1,
            this.formationTechniqueText,
            this.formationStatsText,
            0.5,
            0.75
        );
        this.handlePanelElementsVisibility(true);
    }

    updatePanelVisuals(frontPanel, backPanel, frontText, backText, elementsDepth, elementsAlpha) {
        frontPanel.setDepth(2);
        backPanel.setDepth(1);
        frontText.setDepth(3);
        backText.setDepth(3);
        frontPanel.setAlpha(1);
        frontText.setAlpha(1);
        backPanel.setAlpha(0.75);
        backText.setAlpha(0.75);

        const isPanel2Active = frontPanel === this.formationFicha2;
        this.handlePanelElementsVisibility(isPanel2Active);
    }

    handlePanelElementsVisibility(isHissatsuPanel) {
        const elements = isHissatsuPanel ? this.getHissatsuElements() : this.getPanelElements();
        this.updateElementsVisibility(elements, isHissatsuPanel);
        this.updateHissatsuSlotsVisibility(isHissatsuPanel);
    }

    getHissatsuElements() {
        return [
            this.scene.hissatsuPortraitDisplay,
            this.scene.hissatsuNameText,
            this.scene.hissatsuPowerText,
            this.scene.hissatsuTPText,
            this.scene.hissatsuTypeText,
            this.scene.hissatsuAttributeText,
            this.scene.hissatsuAttributeIcon,
            this.scene.hissatsuRankText,
            ...(this.scene.hissatsuStars || [])
        ];
    }

    getPanelElements() {
        return [
            this.scene.playerPortrait,
            this.scene.playerBorder,
            this.scene.playerNameText,
            this.scene.playerLevelText,
            this.scene.playerExpText,
            this.scene.playerAttributeIcon,
            this.scene.playerAttributeText,
            this.scene.playerRarityIcon,
            this.scene.playerRarityText,
            this.scene.playerPositionText,
            this.scene.playerTPText,
            this.scene.playerFPText,
            this.scene.playerShootText,
            this.scene.playerDribbleText,
            this.scene.playerStrengthText,
            this.scene.playerSpeedText,
            this.scene.playerKeeperText,
            ...this.scene.panelButtons
        ];
    }

    updateElementsVisibility(elements, isVisible) {
        elements.forEach(element => {
            if (element) {
                element.setVisible(isVisible);
                element.setDepth(isVisible ? 2.5 : 2);
                element.setAlpha(isVisible ? 1 : 0.75);
            }
        });
    }

    updateHissatsuSlotsVisibility(isHissatsuPanel) {
        if (this.scene.hissatsuSlots) {
            this.scene.hissatsuSlots.forEach(({ sprite, text, container }) => {
                if (sprite && text && container) {
                    const depth = isHissatsuPanel ? 2.5 : 0.5;
                    const alpha = isHissatsuPanel ? 1 : 0.75;

                    [sprite, text, container].forEach(element => {
                        element.setDepth(depth);
                        element.setAlpha(alpha);
                    });

                    if (isHissatsuPanel) {
                        sprite.setInteractive({ useHandCursor: true });
                    } else {
                        sprite.disableInteractive();
                    }
                }
            });
        }
    }

    destroy() {
        // Cleanup method to remove all panel elements
        [
            this.formationFicha1,
            this.formationFicha2,
            this.formationStatsText,
            this.formationTechniqueText,
            this.leftRect,
            this.rightRect
        ].forEach(element => {
            if (element) {
                element.destroy();
            }
        });
    }
}