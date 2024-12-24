class FormationManager {
    constructor(scene) {
        this.scene = scene;
        this.init();
    }

    init() {
        // Initialize properties
        this.swapAreaRect = null;
        this.isSwapMode = false;
        this.selectionIndicator = null;
        this.swapIndicators = [];
        this.hissatsuSlots = [];
        this.isHissatsuPanelActive = false;
    }

    setupFormationScreen() {
        this.setupSwapArea();
        this.setupBackgroundClickHandler();
        this.setupSelectionIndicator();
        this.setupFormationPanels();
        this.setupPlayerPortrait();
        this.setupHissatsuSystem();
        this.updatePlayerPortrait();
    }

    setupSwapArea() {
        this.swapAreaRect = this.scene.add.rectangle(30, 100, 300, 375, 0xFF0000);
        this.swapAreaRect.setAlpha(0);
        this.swapAreaRect.setOrigin(0, 0);
        this.swapAreaRect.setDepth(1);
    }

    setupBackgroundClickHandler() {
        this.input.on('pointerdown', (pointer) => {
            // Only check for outside clicks if we're in swap mode
            if (this.isSwapMode && this.swapAreaRect) {
                const rectBounds = this.scene.swapAreaRect.getBounds();
                // Ignore clicks on UI elements
                const clickedOnUI = this.scene.moveButton.getBounds().contains(pointer.x, pointer.y) ||
                    this.changeButton.getBounds().contains(pointer.x, pointer.y) ||
                    this.enhanceButton.getBounds().contains(pointer.x, pointer.y);

                if (!clickedOnUI && (pointer.x < rectBounds.left || pointer.x > rectBounds.right ||
                        pointer.y < rectBounds.top || pointer.y > rectBounds.bottom)) {
                    this.exitSwapMode();
                    return;
                }
            }

            if (this.formationLogic.formationMenuOpen) {
                // Get the formation button bounds
                const formationButton = this.scene.formationLogic.formationElements.players[0];
                const formationButtonBounds = formationButton.getBounds();

                // Check if click was on formation button (ignore these clicks)
                const clickedOnFormationButton = (
                    pointer.x >= formationButtonBounds.left &&
                    pointer.x <= formationButtonBounds.right &&
                    pointer.y >= formationButtonBounds.top &&
                    pointer.y <= formationButtonBounds.bottom
                );

                // Check if click was on any formation option button
                const clickedOnFormationOption = this.scene.formationLogic.formationButtons.some(({
                    button
                }) => {
                    const bounds = button.getBounds();
                    return (
                        pointer.x >= bounds.left &&
                        pointer.x <= bounds.right &&
                        pointer.y >= bounds.top &&
                        pointer.y <= bounds.bottom
                    );
                });

                // If click was not on formation button or any formation option, close the menu
                if (!clickedOnFormationButton && !clickedOnFormationOption) {
                    this.formationLogic.closeFormationMenu();
                }
            }
        });
    }

    setupSelectionIndicator() {
        this.selectionIndicator = this.scene.add.rectangle(0, 0, 40, 62, 0x00ff00);
        this.selectionIndicator.setFillStyle(0x00ff00, 0.5);
        this.selectionIndicator.setDepth(0);

        this.setupSwapIndicators();
        this.setupPlayerClickHandlers();

        // Add blinking effect to selection indicator
        this.tweens.add({
            targets: this.selectionIndicator,
            alpha: {
                from: 0.5,
                to: 1
            },
            duration: 600,
            yoyo: true,
            repeat: -1
        });
    }
    setupPlayerClickHandlers() {
        // Add click detection for player selection
        this.input.on('pointerdown', (pointer) => {
            const playerSprites = this.scene.formationLogic.formationElements.players.filter(
                sprite => sprite.texture && sprite.texture.key === 'raimonBody'
            );
            if (this.isSwapMode) {
                // Find clicked player for swapping
                for (let i = 0; i < playerSprites.length; i++) {
                    const sprite = playerSprites[i];
                    const bounds = sprite.getBounds();
                    if (pointer.x >= bounds.left && pointer.x <= bounds.right &&
                        pointer.y >= bounds.top && pointer.y <= bounds.bottom) {
                        if (i !== this.scene.selectedPlayer) {
                            // Perform the swap
                            this.swapPlayers(this.selectedPlayer, i);
                            this.exitSwapMode();
                        }
                        break;
                    }
                }
            } else {
                // Find clicked player
                for (let i = 0; i < playerSprites.length; i++) {
                    const sprite = playerSprites[i];
                    const bounds = sprite.getBounds();
                    if (pointer.x >= bounds.left && pointer.x <= bounds.right &&
                        pointer.y >= bounds.top && pointer.y <= bounds.bottom) {
                        this.selectedPlayer = i;
                        this.updateSelectionIndicator();
                        this.updatePlayerPortrait();
                        break;
                    }
                }
            }
        });
    }
    setupSwapIndicators() {
        this.swapIndicators = [];
        const playerCount = this.scene.formationLogic.formationElements.players.length;
        for (let i = 0; i < playerCount; i++) {
            const indicator = this.scene.add.rectangle(0, 0, 40, 62, 0x06c6d9);
            indicator.setStrokeStyle(2, 0xffffff);
            indicator.setFillStyle(0xffff00, 0.2);
            indicator.setDepth(0);
            indicator.setVisible(false);
            this.swapIndicators.push(indicator);
        }

        // Add click detection for player selection
        this.input.on('pointerdown', (pointer) => {
            const playerSprites = this.scene.formationLogic.formationElements.players.filter(
                sprite => sprite.texture && sprite.texture.key === 'raimonBody'
            );

            if (this.isSwapMode) {
                // Find clicked player for swapping
                for (let i = 0; i < playerSprites.length; i++) {
                    const sprite = playerSprites[i];
                    const bounds = sprite.getBounds();
                    if (pointer.x >= bounds.left && pointer.x <= bounds.right &&
                        pointer.y >= bounds.top && pointer.y <= bounds.bottom) {
                        if (i !== this.scene.selectedPlayer) {
                            // Perform the swap
                            this.swapPlayers(this.selectedPlayer, i);
                            this.exitSwapMode();
                        }
                        break;
                    }
                }
            } else {

                // Find clicked player
                for (let i = 0; i < playerSprites.length; i++) {
                    const sprite = playerSprites[i];
                    const bounds = sprite.getBounds();
                    if (pointer.x >= bounds.left && pointer.x <= bounds.right &&
                        pointer.y >= bounds.top && pointer.y <= bounds.bottom) {
                        this.selectedPlayer = i;
                        this.updateSelectionIndicator();
                        this.updatePlayerPortrait();
                        console.log('Selected player:', i); // Debug log
                        break;
                    }
                }
            }
        });

        // Update indicator position based on selected player
        this.updateSelectionIndicator();
        // Update indicator position based on selected player
        this.updateSelectionIndicator();
    }

    setupFormationPanels() {
        this.formationFicha1 = this.scene.add.image(580, 290, 'FormFichaBlue');
        this.formationFicha2 = this.scene.add.image(580, 290, 'FormFichaBlue');
        this.formationFicha2.setFlipX(true);

        this.formationStatsText = this.scene.add.bitmapText(380 + 97, 105 + 30, 'customFont',
            this.localization[this.currentLanguage]['Stats_Stats'], 36);
        this.formationStatsText.setOrigin(0.5);

        this.formationTechniqueText = this.scene.add.bitmapText(585 + 110, 105 + 30, 'customFont',
            this.localization[this.currentLanguage]['Stats_Hissatsu'], 36);
        this.formationTechniqueText.setOrigin(0.5);

        // Set initial depth and opacity for panels and text
        this.formationFicha1.setDepth(1);
        this.formationFicha2.setDepth(0);
        this.formationStatsText.setDepth(2);
        this.formationTechniqueText.setDepth(2);

        // Set initial alpha values
        this.formationFicha1.setAlpha(1);
        this.formationFicha2.setAlpha(0.75);
        this.formationStatsText.setAlpha(1);
        this.formationTechniqueText.setAlpha(0.75);

        // Add interactive areas for panel switching
        const leftRect = this.scene.add.rectangle(380 + 97, 105 + 30, 195, 60, 0x000000, 0);
        const rightRect = this.scene.add.rectangle(585 + 97, 105 + 30, 195, 60, 0x000000, 0);

        leftRect.setOrigin(0.5);
        rightRect.setOrigin(0.5);

        leftRect.setInteractive({
            useHandCursor: true
        });
        rightRect.setInteractive({
            useHandCursor: true
        });

        this.setupPanelInteractions(leftRect, rightRect);
    }
    setupPanelInteractions(leftRect, rightRect) {
        leftRect.on('pointerdown', () => {
            this.isHissatsuPanelActive = false;

            // Update panel depths and visibility
            this.formationFicha1.setDepth(2);
            this.formationFicha2.setDepth(1);
            this.formationStatsText.setDepth(3);
            this.formationTechniqueText.setDepth(3);

            // Update alpha values
            this.formationFicha1.setAlpha(1);
            this.formationStatsText.setAlpha(1);
            this.formationFicha2.setAlpha(0.75);
            this.formationTechniqueText.setAlpha(0.75);

            // Handle panel-specific elements
            this.handlePanelElementsVisibility(false);
        });
        rightRect.on('pointerdown', () => {
            this.isHissatsuPanelActive = true;

            // Update panel depths and visibility
            this.formationFicha2.setDepth(2);
            this.formationFicha1.setDepth(1);
            this.formationTechniqueText.setDepth(3);
            this.formationStatsText.setDepth(3);

            // Update alpha values
            this.formationFicha2.setAlpha(1);
            this.formationTechniqueText.setAlpha(1);
            this.formationFicha1.setAlpha(0.75);
            this.formationStatsText.setAlpha(0.75);

            // Handle panel-specific elements
            this.handlePanelElementsVisibility(true);
        });
    }
    handlePanelElementsVisibility(isHissatsuPanel) {
        const elements = isHissatsuPanel ? [
            this.hissatsuPortraitDisplay,
            this.hissatsuNameText,
            this.hissatsuPowerText,
            this.hissatsuTPText,
            this.hissatsuTypeText,
            this.hissatsuAttributeText,
            this.hissatsuAttributeIcon,
            this.hissatsuRankText,
            ...(this.hissatsuStars || [])
        ] : this.getPanelElements();
        elements.forEach(element => {
            if (element) {
                element.setVisible(true);
                element.setDepth(isHissatsuPanel ? 2.5 : 2);
                element.setAlpha(isHissatsuPanel ? 1 : 0.75);
            }
        });
        // Handle Hissatsu slots visibility
        if (this.hissatsuSlots) {
            this.hissatsuSlots.forEach(({
                sprite,
                text,
                container
            }) => {
                if (sprite && text && container) {
                    const depth = isHissatsuPanel ? 2.5 : 0.5;
                    const alpha = isHissatsuPanel ? 1 : 0.75;

                    [sprite, text, container].forEach(element => {
                        element.setDepth(depth);
                        element.setAlpha(alpha);
                    });
                    if (isHissatsuPanel) {
                        sprite.setInteractive({
                            useHandCursor: true
                        });
                    } else {
                        sprite.disableInteractive();
                    }
                }
            });
        }
    }

    setupPlayerPortrait() {
        const portraitX = 380 + 50;
        const portraitY = 105 + 110;

        this.playerPortrait = this.scene.add.sprite(portraitX, portraitY, 'raiTeiPortrait', 0);
        this.playerBorder = this.scene.add.sprite(portraitX, portraitY, 'frameBorder', 0);

        this.setupPlayerInfoTexts(portraitX, portraitY);
        const buttonY = portraitY + 220; // Position buttons below all stats
        const buttonSpacing = 120; // Space between buttons

        // Create the move button
        this.moveButton = this.scene.add.image(portraitX + 150 - buttonSpacing, buttonY, 'BtFichaMove')
            .setInteractive({
                useHandCursor: true
            })
            .setScale(0.9, 1);

        this.moveButtonText = this.scene.add.bitmapText(
            portraitX + 150 - buttonSpacing,
            buttonY,
            'customFont',
            this.localization[this.currentLanguage]['Formation_MovePlayer'],
            26
        ).setOrigin(0.5);
        // Create the change button
        this.changeButton = this.scene.add.image(portraitX + 150, buttonY, 'BtFichaChange')
            .setInteractive({
                useHandCursor: true
            })
            .setScale(0.9, 1);

        this.changeButtonText = this.scene.add.bitmapText(
            portraitX + 150,
            buttonY,
            'customFont',
            this.localization[this.currentLanguage]['Formation_ChangePlayer'],
            26
        ).setOrigin(0.5);
        // Create the enhance button
        this.enhanceButton = this.scene.add.image(portraitX + 150 + buttonSpacing, buttonY, 'BtFichaEnhance')
            .setInteractive({
                useHandCursor: true
            })
            .setScale(0.9, 1);

        this.enhanceButtonText = this.scene.add.bitmapText(
            portraitX + 150 + buttonSpacing,
            buttonY,
            'customFont',
            this.localization[this.currentLanguage]['Formation_Enhance'],
            26
        ).setOrigin(0.5);
        // Set up move button click handler
        this.moveButton.on('pointerdown', () => this.handleMoveButtonClick());
        this.moveButtonText.setInteractive({
                useHandCursor: true
            })
            .on('pointerdown', () => this.handleMoveButtonClick());
    }
    handleMoveButtonClick() {
        if (this.formationLogic.formationMenuOpen) {
            return;
        }
        if (!this.isSwapMode) {
            if (this.swapAreaRect) {
                this.swapAreaRect.setAlpha(0);
            }
            this.isSwapMode = true;
            this.moveButtonText.setText(this.localization[this.currentLanguage]['Formation_Cancel']);
            const playerSprites = this.scene.formationLogic.formationElements.players.filter(
                sprite => sprite.texture && sprite.texture.key === 'raimonBody'
            );
            if (this.swapIndicators) {
                this.swapIndicators.forEach(indicator => {
                    if (indicator) {
                        indicator.destroy();
                    }
                });
            }
            this.swapIndicators = [];
            playerSprites.forEach((sprite, index) => {
                if (index !== this.scene.selectedPlayer) {
                    const indicator = this.scene.add.rectangle(
                        sprite.x,
                        sprite.y - sprite.height * 0.85,
                        40, 62, 0xffff00
                    );
                    indicator.setFillStyle(0xffff00, 0.5);
                    indicator.setDepth(0);
                    this.swapIndicators.push(indicator);
                }
            });
        } else {
            this.exitSwapMode();
        }
    }

    setupPlayerInfoTexts(portraitX, portraitY) {
        this.playerNameText = this.scene.add.bitmapText(portraitX + 50, portraitY - 40, 'customFont', '', 24);
        this.playerLevelText = this.scene.add.bitmapText(portraitX + 50, portraitY - 15, 'customFont', '', 20);
        this.playerExpText = this.scene.add.bitmapText(portraitX + 160, portraitY - 15, 'customFont', '', 20);
        this.playerPositionText = this.scene.add.bitmapText(portraitX, portraitY + 50, 'customFont', '', 24);
        this.playerPositionText.setOrigin(0.5);

        // Create attribute and rank labels with their icons
        const attributeLabel = this.scene.localization[this.currentLanguage]['Stats_Attribute'] + ':';
        const rankLabel = this.scene.localization[this.currentLanguage]['Stats_Rarity'] + ':';

        this.playerAttributeText = this.scene.add.bitmapText(portraitX + 50, portraitY + 10, 'customFont', attributeLabel, 20);
        this.playerAttributeIcon = this.scene.add.sprite(portraitX + 140, portraitY + 22, 'attributes', 0);

        this.playerRarityText = this.scene.add.bitmapText(portraitX + 160, portraitY + 10, 'customFont', rankLabel, 20);
        this.playerRarityIcon = this.scene.add.sprite(portraitX + 240, portraitY + 22, 'raritySprite', 0);

        this.playerTPText = this.scene.add.bitmapText(portraitX + 50, portraitY + 50, 'customFont',
            this.localization[this.currentLanguage]['Stats_TP'] + ': 0', 20);
        this.playerFPText = this.scene.add.bitmapText(portraitX + 160, portraitY + 50, 'customFont',
            this.localization[this.currentLanguage]['Stats_FP'] + ': 0', 20);

        this.playerShootText = this.scene.add.bitmapText(portraitX + 50, portraitY + 75, 'customFont',
            this.localization[this.currentLanguage]['Stats_Shoot'] + ': 0', 20);
        this.playerDribbleText = this.scene.add.bitmapText(portraitX + 160, portraitY + 75, 'customFont',
            this.localization[this.currentLanguage]['Stats_Dribble'] + ': 0', 20);

        this.playerStrengthText = this.scene.add.bitmapText(portraitX + 50, portraitY + 100, 'customFont',
            this.localization[this.currentLanguage]['Stats_Strength'] + ': 0', 20);
        this.playerSpeedText = this.scene.add.bitmapText(portraitX + 160, portraitY + 100, 'customFont',
            this.localization[this.currentLanguage]['Stats_Speed'] + ': 0', 20);

        this.playerKeeperText = this.scene.add.bitmapText(portraitX + 50, portraitY + 125, 'customFont',
            this.localization[this.currentLanguage]['Stats_Catch'] + ': 0', 20);
        // Add action buttons at the bottom of the panel
        const buttonY = portraitY + 220; // Position buttons below all stats
        const buttonSpacing = 120; // Space between buttons
        // Create the three buttons
        // Create the three buttons with their texts
        this.moveButton = this.scene.add.image(portraitX + 150 - buttonSpacing, buttonY, 'BtFichaMove')
            .setInteractive({
                useHandCursor: true
            })
            .setScale(0.9, 1)
            .on('pointerdown', () => {
                if (this.formationLogic.formationMenuOpen) {
                    return; // Don't enter swap mode if formation menu is open
                }

                if (!this.isSwapMode) {
                    // Enter swap mode
                    if (this.swapAreaRect) {
                        this.swapAreaRect.setAlpha(0);
                    }
                    // Enter swap mode
                    this.isSwapMode = true;
                    this.moveButtonText.setText(this.localization[this.currentLanguage]['Formation_Cancel']);

                    // Create swap indicators for other players immediately
                    const playerSprites = this.scene.formationLogic.formationElements.players.filter(
                        sprite => sprite.texture && sprite.texture.key === 'raimonBody'
                    );

                    // Clear any existing swap indicators
                    if (this.swapIndicators) {
                        this.swapIndicators.forEach(indicator => {
                            if (indicator) {
                                indicator.destroy();
                            }
                        });
                    }

                    // Create new indicators
                    this.swapIndicators = [];
                    playerSprites.forEach((sprite, index) => {
                        if (index !== this.scene.selectedPlayer) {
                            const indicator = this.scene.add.rectangle(
                                sprite.x,
                                sprite.y - sprite.height * 0.85,
                                40, 62, 0xffff00
                            );
                            indicator.setFillStyle(0xffff00, 0.5);
                            indicator.setDepth(0);

                            this.swapIndicators.push(indicator);
                        }
                    });
                } else {
                    // Cancel swap mode
                    this.exitSwapMode();
                }
            });
        this.moveButtonText = this.scene.add.bitmapText(
                portraitX + 150 - buttonSpacing,
                buttonY,
                'customFont',
                this.localization[this.currentLanguage]['Formation_MovePlayer'],
                26
            ).setOrigin(0.5)
            .setInteractive({
                useHandCursor: true
            })
            .on('pointerdown', () => {
                if (this.formationLogic.formationMenuOpen) {
                    return;
                }
                if (!this.isSwapMode) {
                    if (this.swapAreaRect) {
                        this.swapAreaRect.setAlpha(0);
                    }
                    this.isSwapMode = true;
                    this.moveButtonText.setText(this.localization[this.currentLanguage]['Formation_Cancel']);
                    const playerSprites = this.scene.formationLogic.formationElements.players.filter(
                        sprite => sprite.texture && sprite.texture.key === 'raimonBody'
                    );
                    if (this.swapIndicators) {
                        this.swapIndicators.forEach(indicator => {
                            if (indicator) {
                                indicator.destroy();
                            }
                        });
                    }
                    this.swapIndicators = [];
                    playerSprites.forEach((sprite, index) => {
                        if (index !== this.scene.selectedPlayer) {
                            const indicator = this.scene.add.rectangle(
                                sprite.x,
                                sprite.y - sprite.height * 0.85,
                                40, 62, 0xffff00
                            );
                            indicator.setFillStyle(0xffff00, 0.5);
                            indicator.setDepth(0);
                            this.swapIndicators.push(indicator);
                        }
                    });
                } else {
                    this.exitSwapMode();
                }
            });
        this.changeButton = this.scene.add.image(portraitX + 150, buttonY, 'BtFichaChange')
            .setInteractive({
                useHandCursor: true
            })
            .setScale(0.9, 1);
        this.changeButtonText = this.scene.add.bitmapText(
            portraitX + 150,
            buttonY,
            'customFont',
            this.localization[this.currentLanguage]['Formation_ChangePlayer'],
            26
        ).setOrigin(0.5);
        this.enhanceButton = this.scene.add.image(portraitX + 150 + buttonSpacing, buttonY, 'BtFichaEnhance')
            .setInteractive({
                useHandCursor: true
            })
            .setScale(0.9, 1);
        this.enhanceButtonText = this.scene.add.bitmapText(
            portraitX + 150 + buttonSpacing,
            buttonY,
            'customFont',
            this.localization[this.currentLanguage]['Formation_Enhance'],
            26
        ).setOrigin(0.5);
        // Add the buttons to the list of panel elements
        this.panelButtons = [
            this.moveButton, this.moveButtonText,
            this.changeButton, this.changeButtonText,
            this.enhanceButton, this.enhanceButtonText
        ];
        // Set depth for all elements
        [this.playerNameText, this.playerLevelText, this.playerExpText,
            this.playerAttributeIcon, this.playerAttributeText,
            this.playerRarityIcon, this.playerRarityText,
            this.playerPositionText,
            this.playerTPText, this.playerFPText,
            this.playerShootText, this.playerDribbleText,
            this.playerStrengthText, this.playerSpeedText,
            this.playerKeeperText,
            ...this.panelButtons
        ].forEach(element => {
            element.setDepth(2);
        });

        // Set initial depths for portrait elements
        this.playerPortrait.setDepth(1.5);
        this.playerBorder.setDepth(1.5);

        // Update portrait for initial selected player
        this.updatePlayerPortrait();
        // Force update of Hissatsu slots for initial player
        if (this.updateHissatsuSlots) {
            const playerKey = this.scene.playerStats.activePlayers[this.selectedPlayer];
            if (playerKey) {
                const player = this.scene.playerStats.getPlayerStats(playerKey);
                if (player && player.hissatsu) {
                    this.updateHissatsuSlots();
                }
            }
        }
        // Create invisible interactive areas
        const leftRect = this.scene.add.rectangle(380 + 97, 105 + 30, 195, 60, 0x000000, 0);
        const rightRect = this.scene.add.rectangle(585 + 97, 105 + 30, 195, 60, 0x000000, 0);

        // Set origin for proper positioning
        leftRect.setOrigin(0.5);
        rightRect.setOrigin(0.5);

        // Make rectangles interactive first
        leftRect.setInteractive({
            useHandCursor: true
        });
        rightRect.setInteractive({
            useHandCursor: true
        });

        // Helper method to get all panel elements
        this.getPanelElements = () => {
            return [
                this.playerPortrait, this.playerBorder,
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
        };
        // Helper method to update panel visuals
        this.updatePanelVisuals = (frontPanel, backPanel, frontText, backText, elementsDepth, elementsAlpha) => {
            // Update panel depths and alpha
            frontPanel.setDepth(2);
            backPanel.setDepth(1);
            frontText.setDepth(3);
            backText.setDepth(3);
            frontPanel.setAlpha(1);
            frontText.setAlpha(1);
            backPanel.setAlpha(0.75);
            backText.setAlpha(0.75);

            const isPanel2Active = frontPanel === this.scene.formationFicha2;

            // Get all elements that should only be visible in panel 2
            const panel2Elements = [
                this.hissatsuPortraitDisplay,
                this.hissatsuNameText,
                this.hissatsuPowerText,
                this.hissatsuTPText,
                this.hissatsuTypeText,
                this.hissatsuAttributeText,
                this.hissatsuAttributeIcon,
                this.hissatsuRankText,
                ...this.hissatsuStars
            ];

            // Update Hissatsu elements visibility and depth based on active panel
            panel2Elements.forEach(element => {
                if (element) {
                    element.setVisible(isPanel2Active);
                    element.setDepth(isPanel2Active ? 2.5 : 0.5);
                    element.setAlpha(isPanel2Active ? 1 : 0.75);
                }
            });

            // Handle Hissatsu slots visibility and interactivity
            if (this.hissatsuSlots) {
                this.hissatsuSlots.forEach(({
                    sprite,
                    text,
                    container,
                    selected
                }) => {
                    if (isPanel2Active) {
                        sprite.setDepth(2.5);
                        sprite.setAlpha(1);
                        text.setDepth(2.5);
                        text.setAlpha(1);
                        container.setDepth(2.5);
                        if (selected) {
                            sprite.setScale(1.05);
                        } else {
                            sprite.setScale(1);
                        }
                        sprite.setInteractive({
                            useHandCursor: true
                        });
                    } else {
                        sprite.setDepth(0.5);
                        sprite.setAlpha(0.75);
                        text.setDepth(0.5);
                        text.setAlpha(0.75);
                        container.setDepth(0.5);
                        sprite.setScale(1);
                        sprite.disableInteractive();
                    }
                });
            }

            // Update panel elements
            this.getPanelElements().forEach(element => {
                element.setDepth(elementsDepth);
                element.setAlpha(elementsAlpha);

                // Only make elements interactive when they're in the front panel
                if (element.setInteractive && element.disableInteractive) {
                    if (elementsDepth > 2) {
                        element.setAlpha(1);
                        if (element instanceof Phaser.GameObjects.Image) {
                            element.setInteractive({
                                useHandCursor: true
                            });
                        }
                    } else {
                        element.disableInteractive();
                        element.setAlpha(0.75);
                    }
                }
            });
        };
        // Add click handlers
        leftRect.on('pointerdown', () => {
            this.isHissatsuPanelActive = false;
            this.updatePanelVisuals(this.formationFicha1, this.formationFicha2, this.formationStatsText, this.formationTechniqueText, 2.5, 1);

            // Enable interaction for panel 1 buttons
            this.panelButtons.forEach(button => {
                if (button.setInteractive) {
                    button.setInteractive({
                        useHandCursor: true
                    });
                }
            });
            // Explicitly disable ALL Hissatsu slots
            if (this.hissatsuSlots) {
                this.hissatsuSlots.forEach(({
                    sprite
                }) => {
                    if (sprite) {
                        sprite.disableInteractive();
                        sprite.removeInteractive();
                    }
                });
            }

            // Explicitly disable Hissatsu slots interaction when in panel 1
            if (this.hissatsuSlots) {
                this.hissatsuSlots.forEach(({
                    sprite
                }) => {
                    if (sprite && sprite.input) {
                        sprite.disableInteractive();
                    }
                });
            }
        });
        rightRect.on('pointerdown', () => {
            this.isHissatsuPanelActive = true;
            this.updatePanelVisuals(this.formationFicha2, this.formationFicha1, this.formationTechniqueText, this.formationStatsText, 0.5, 0.75);
            // Hide all Hissatsu details until a technique is selected
            [
                this.hissatsuPortraitDisplay,
                this.hissatsuNameText,
                this.hissatsuPowerText,
                this.hissatsuTPText,
                this.hissatsuTypeText,
                this.hissatsuAttributeText,
                this.hissatsuAttributeIcon,
                this.hissatsuRankText,
                ...this.hissatsuStars
            ].forEach(element => {
                if (element) element.setVisible(false);
            });
            // Disable all panel 1 buttons
            this.panelButtons.forEach(button => {
                if (button.disableInteractive) {
                    button.disableInteractive();
                    button.removeInteractive();
                }
            });
            // Enable ALL Hissatsu slots
            if (this.hissatsuSlots) {
                this.hissatsuSlots.forEach(({
                    sprite
                }) => {
                    if (sprite) {
                        sprite.setInteractive({
                            useHandCursor: true
                        });
                    }
                });
            }
            // Enable Hissatsu slots interaction when in panel 2
            if (this.hissatsuSlots) {
                this.hissatsuSlots.forEach(({
                    sprite
                }) => {
                    if (sprite) {
                        sprite.setInteractive({
                            useHandCursor: true
                        });
                    }
                });
            }

            // Force update Hissatsu slots when switching to panel 2
            const playerKey = this.scene.playerStats.activePlayers[this.selectedPlayer];
            if (playerKey) {
                const player = this.scene.playerStats.getPlayerStats(playerKey);
                if (player && player.hissatsu && this.updateHissatsuSlots) {
                    this.updateHissatsuSlots();
                }
            }
        });

        // Define base positions first
        const baseX = 475; // Center position of the panel
        const startY = 190; // Starting Y position for the information

        // Create Hissatsu portrait and info display
        // Initialize the Hissatsu display elements if they don't exist
        if (!this.hissatsuPortraitDisplay) {
            this.hissatsuPortraitDisplay = this.scene.add.sprite(baseX - 80, startY, 'hissatsuPortrait', 0);
            this.hissatsuPortraitDisplay.setVisible(false);
            this.hissatsuPortraitDisplay.setDepth(2.5);
        }
        this.hissatsuPortraitDisplay.setOrigin(0, 0);

        this.hissatsuNameText = this.scene.add.bitmapText(baseX + 110, startY, 'customFont', '', 24)
            .setOrigin(0, 0);

        this.hissatsuPowerText = this.scene.add.bitmapText(baseX + 110, startY + 26, 'customFont', '', 22)
            .setOrigin(0, 0);

        this.hissatsuTPText = this.scene.add.bitmapText(baseX + 110, startY + 52, 'customFont', '', 22)
            .setOrigin(0, 0);

        this.hissatsuTypeText = this.scene.add.bitmapText(baseX + 210, startY + 52, 'customFont', '', 22)
            .setOrigin(0, 0);

        // Create attribute icon and text
        this.hissatsuAttributeText = this.scene.add.bitmapText(baseX + 110, startY + 60, 'customFont', 'Attribute:', 22)
            .setOrigin(0, 0);

        this.hissatsuAttributeIcon = this.scene.add.sprite(baseX + 190, startY + 90, 'attributes', 0)
            .setScale(0.8);

        // Create rank text and stars
        this.hissatsuRankText = this.scene.add.bitmapText(baseX + 210, startY + 60, 'customFont', 'Rank:', 22)
            .setOrigin(0, 0);

        this.hissatsuStars = [];

        // Set initial visibility
        [this.hissatsuNameText, this.hissatsuPowerText, this.hissatsuTPText,
            this.hissatsuTypeText, this.hissatsuAttributeText, this.hissatsuAttributeIcon,
            this.hissatsuRankText
        ].forEach(element => {
            element.setVisible(false);
            element.setDepth(2.5);
        });
    }
    setupHissatsuSystem() {
        this.setupHissatsuDisplayElements();
        this.createHissatsuSlots();
    }

    setupHissatsuDisplayElements() {
        const baseX = 475;
        const startY = 190;

        // Create Hissatsu portrait and info display
        this.hissatsuPortraitDisplay = this.scene.add.sprite(baseX - 80, startY, 'hissatsuPortrait', 0)
            .setOrigin(0, 0)
            .setVisible(false)
            .setDepth(2.5);
        // Create text elements for Hissatsu info
        this.hissatsuNameText = this.scene.add.bitmapText(baseX + 110, startY, 'customFont', '', 24)
            .setOrigin(0, 0);
        this.hissatsuPowerText = this.scene.add.bitmapText(baseX + 110, startY + 26, 'customFont', '', 22)
            .setOrigin(0, 0);
        this.hissatsuTPText = this.scene.add.bitmapText(baseX + 110, startY + 52, 'customFont', '', 22)
            .setOrigin(0, 0);
        this.hissatsuTypeText = this.scene.add.bitmapText(baseX + 205, startY + 52, 'customFont', '', 22)
            .setOrigin(0, 0);
        // Create attribute icon and text
        this.hissatsuAttributeText = this.scene.add.bitmapText(baseX + 110, startY + 77, 'customFont', 'Attribute:', 22)
            .setOrigin(0, 0);
        this.hissatsuAttributeIcon = this.scene.add.sprite(baseX + 190, startY + 90, 'attributes', 0)
            .setScale(0.8);
        // Create rank text and stars
        this.hissatsuRankText = this.scene.add.bitmapText(baseX + 205, startY + 77, 'customFont', 'Rank:', 22)
            .setOrigin(0, 0);
        // Initialize stars array
        this.hissatsuStars = [];
        // Set initial visibility for all elements
        [
            this.hissatsuNameText,
            this.hissatsuPowerText,
            this.hissatsuTPText,
            this.hissatsuTypeText,
            this.hissatsuAttributeText,
            this.hissatsuAttributeIcon,
            this.hissatsuRankText
        ].forEach(element => {
            if (element) {
                element.setVisible(false);
                element.setDepth(2.5);
            }
        });
    }

    createHissatsuSlots() {
        const slotSpacing = 50;
        const slotStartY = 330;
        const leftX = 535;
        const rightX = 725;

        this.hissatsuSlots = [];

        // Clear existing slots if any
        this.hissatsuSlots.forEach(({
            sprite,
            text,
            border
        }) => {
            if (sprite && sprite.active) sprite.destroy();
            if (text && text.active) text.destroy();
            if (border && border.active) border.destroy();
        });
        this.hissatsuSlots = [];
        // Track which panel is active
        this.isHissatsuPanelActive = false;

        // Create 6 slots (3 pairs, arranged top to bottom)
        for (let i = 0; i < 6; i++) {
            const isRightSlot = i % 2 === 1;
            const pairIndex = Math.floor(i / 2);
            const x = isRightSlot ? rightX : leftX;
            const y = slotStartY + pairIndex * slotSpacing;

            // Create sprite with proper frame and position
            const slot = this.scene.add.sprite(0, 0, 'hissatsuButton')
                .setOrigin(0.5)
                .setScale(1)
                .setDepth(0.5)
                .setAlpha(0.75);
            // Create a container for the slot at the correct position
            const container = this.scene.add.container(x - 50, y);
            container.setDepth(0.5);
            // Add the slot sprite to the container
            container.add(slot);
            // Only set interactive if hissatsu panel is active
            if (this.isHissatsuPanelActive) {
                slot.setInteractive({
                    useHandCursor: true
                });
            }
            // Create text with proper positioning
            const slotText = this.scene.add.bitmapText(0, 0, 'customFont', '', 20)
                .setOrigin(0.5)
                .setDepth(0.5)
                .setAlpha(0.75);

            // Add text to container
            container.add(slotText);

            // Initialize selected state
            slot.isSelected = false;

            // Add to hissatsu slots array with all components
            this.hissatsuSlots.push({
                sprite: slot,
                text: slotText,
                container: container,
                selected: false,
                index: i
            });
            // Ensure visibility
            slot.setVisible(true);
            container.setVisible(true);
            slotText.setVisible(true);
            // Add click handler for slot
            slot.on('pointerdown', () => {
                // Deselect all other slots
                this.hissatsuSlots.forEach(slotData => {
                    if (slotData.sprite) {
                        slotData.selected = false;
                        slotData.sprite.setScale(1);
                    }
                });
                // Select this slot
                this.hissatsuSlots[i].selected = true;
                slot.setScale(1.05); // Slight scale up to show selection
                // Update portrait and information display
                const playerKey = this.scene.playerStats.activePlayers[this.selectedPlayer];
                const player = this.scene.playerStats.getPlayerStats(playerKey);
                if (player && player.hissatsu && player.hissatsu[i]) {
                    const hissatsuId = player.hissatsu[i];
                    const technique = this.scene.hissatsuTechniques[hissatsuId];
                    if (technique) {
                        // Show portrait
                        this.hissatsuPortraitDisplay.setFrame(technique.hPortrait);
                        this.hissatsuPortraitDisplay.setVisible(true);
                        this.hissatsuPortraitDisplay.setAlpha(1);
                        // Update name based on language/style settings
                        let displayName;
                        if (this.currentLanguage === 'pt-br') {
                            displayName = technique.loc_name;
                        } else if (this.selectedNameStyle === 'dub') {
                            displayName = technique.name;
                        } else {
                            displayName = technique.undub_name;
                        }
                        // Set texts
                        this.hissatsuNameText.setText(displayName);
                        this.hissatsuPowerText.setText(`Power: ${technique.power}`);
                        this.hissatsuTPText.setText(`TP Cost: ${technique.tp_cost}`);
                        this.hissatsuTypeText.setText(`Type: ${technique.type}`);
                        this.hissatsuAttributeText.setText('Attribute:');
                        // Set attribute icon
                        let attributeFrame;
                        switch (technique.attribute) {
                            case 'Fire':
                                attributeFrame = 0;
                                break;
                            case 'Earth':
                                attributeFrame = 1;
                                break;
                            case 'Wood':
                                attributeFrame = 2;
                                break;
                            case 'Wind':
                                attributeFrame = 3;
                                break;
                            default:
                                attributeFrame = 0;
                        }
                        this.hissatsuAttributeIcon.setFrame(attributeFrame);
                        // Clear existing stars
                        this.hissatsuStars.forEach(star => star.destroy());
                        this.hissatsuStars = [];
                        // Create new stars based on rank
                        const baseX = 475; // Base X position for Hissatsu elements
                        const startY = 190; // Base Y position for Hissatsu elements
                        for (let s = technique.starRank - 1; s >= 0; s--) {
                            const star = this.scene.add.image(baseX + 260 + (s * 10), startY + 90, 'starIcon');
                            star.setDepth(2.5 + (technique.starRank - s));
                            this.hissatsuStars.push(star);
                        }
                        // Show all elements
                        [this.hissatsuNameText, this.hissatsuPowerText, this.hissatsuTPText,
                            this.hissatsuTypeText, this.hissatsuAttributeText, this.hissatsuAttributeIcon,
                            this.hissatsuRankText
                        ].forEach(element => {
                            element.setVisible(true);
                            element.setDepth(2.5);
                            element.setAlpha(1);
                        });
                    }
                } else {
                    // Hide all elements if no technique
                    this.hissatsuPortraitDisplay.setVisible(false);
                    [this.hissatsuNameText, this.hissatsuPowerText, this.hissatsuTPText,
                        this.hissatsuTypeText, this.hissatsuAttributeText, this.hissatsuAttributeIcon,
                        this.hissatsuRankText
                    ].forEach(element => {
                        element.setVisible(false);
                    });
                    // Clear and destroy stars
                    this.hissatsuStars.forEach(star => star.destroy());
                    this.hissatsuStars = [];
                }
            });
        }

        // Add method to update Hissatsu slots
        this.updateHissatsuSlots = () => {
            const playerKey = this.scene.playerStats.activePlayers[this.selectedPlayer];
            if (!playerKey) {
                console.log('No player key found for selected player:', this.selectedPlayer);
                return;
            }

            const player = this.scene.playerStats.getPlayerStats(playerKey);
            if (!player || !player.hissatsu) {
                console.log('No player data or hissatsu found for key:', playerKey);
                return;
            }
            console.log('Updating hissatsu slots for player:', playerKey, 'Hissatsu:', player.hissatsu);

            // Update each slot with safety checks
            this.hissatsuSlots.forEach(({
                sprite,
                text,
                container
            }, index) => {
                if (!sprite || !sprite.active) return;

                // Ensure container and sprite are visible
                if (container) container.setVisible(true);
                sprite.setVisible(true);

                if (index < player.hissatsu.length) {
                    const hissatsuId = player.hissatsu[index];
                    const technique = this.scene.hissatsuTechniques[hissatsuId];

                    if (technique) {
                        // Set frame based on attribute and ensure visibility
                        let frame;
                        switch (technique.attribute) {
                            case 'Fire':
                                frame = 1;
                                break;
                            case 'Earth':
                                frame = 2;
                                break;
                            case 'Wood':
                                frame = 3;
                                break;
                            case 'Wind':
                                frame = 4;
                                break;
                            default:
                                frame = 0;
                        }
                        sprite.setFrame(frame);
                        sprite.setVisible(true);
                        container.setVisible(true);
                        sprite.setScale(1);
                        sprite.setAlpha(0.75);
                        container.setAlpha(1);

                        // Update text only if it exists and is active
                        if (text && text.active) {
                            let hissatsuName;
                            if (this.currentLanguage === 'pt-br') {
                                hissatsuName = technique.loc_name;
                            } else if (this.selectedNameStyle === 'dub') {
                                hissatsuName = technique.name;
                            } else {
                                hissatsuName = technique.undub_name;
                            }
                            text.setText(hissatsuName || ' ');
                        }
                    } else {
                        sprite.setFrame(0);
                        if (text && text.active) text.setText(' ');
                    }
                } else {
                    sprite.setFrame(0);
                    if (text && text.active) text.setText(' ');
                }
            });
            // Add return here to properly close the if block before the else
            return;
        }
    }


    updatePlayerPortrait() {
        // Clear any displayed Hissatsu details
        this.hissatsuPortraitDisplay?.setVisible(false);
        [
            this.hissatsuNameText,
            this.hissatsuPowerText,
            this.hissatsuTPText,
            this.hissatsuTypeText,
            this.hissatsuAttributeText,
            this.hissatsuAttributeIcon,
            this.hissatsuRankText
        ].forEach(element => {
            if (element) element.setVisible(false);
        });

        // Clear and destroy any existing stars
        this.hissatsuStars?.forEach(star => star.destroy());
        this.hissatsuStars = [];

        const playerKey = this.scene.playerStats.activePlayers[this.selectedPlayer];
        if (playerKey) {
            const player = this.scene.playerStats.getPlayerStats(playerKey);
            if (player && player.hissatsu && this.updateHissatsuSlots) {
                this.updateHissatsuSlots();
            }
        }
        if (this.playerPortrait && this.playerBorder) {
            const selectedPlayerKey = this.scene.playerStats.activePlayers[this.selectedPlayer];
            if (selectedPlayerKey) {
                const playerData = this.scene.playerStats.getPlayerStats(selectedPlayerKey);
                if (playerData) {
                    // Set portrait frame directly from player data
                    this.playerPortrait.setFrame(playerData.portraitFrame || 0);
                    this.playerPortrait.setVisible(true);
                    // Use playerStats' getRarityFrame method for the border
                    const borderFrame = this.scene.playerStats.getRarityFrame(playerData.rarity);
                    this.playerBorder.setFrame(borderFrame);
                    this.playerBorder.setVisible(true);
                    // Update player information
                    const fullName = (this.selectedNameStyle === 'dub' && this.currentLanguage === 'en') ?
                        playerData.name : playerData.undubName;

                    // Update text elements with safety checks
                    if (this.playerNameText && this.playerNameText.active) this.playerNameText.setText(fullName || '');
                    if (this.playerLevelText && this.playerLevelText.active) this.playerLevelText.setText(`Lv.${playerData.level || 1}`);
                    if (this.playerExpText && this.playerExpText.active) this.playerExpText.setText(`Exp: ${playerData.exp || 0}/500`);
                    if (this.playerTPText && this.playerTPText.active) this.playerTPText.setText(`${this.localization[this.currentLanguage]['Stats_TP']}: ${playerData.TP || 0}`);
                    if (this.playerFPText && this.playerFPText.active) this.playerFPText.setText(`${this.localization[this.currentLanguage]['Stats_FP']}: ${playerData.FP || 0}`);
                    if (this.playerShootText && this.playerShootText.active) this.playerShootText.setText(`${this.localization[this.currentLanguage]['Stats_Shoot']}: ${playerData.shoot || 0}`);
                    if (this.playerDribbleText && this.playerDribbleText.active) this.playerDribbleText.setText(`${this.localization[this.currentLanguage]['Stats_Dribble']}: ${playerData.dribble || 0}`);
                    if (this.playerStrengthText && this.playerStrengthText.active) this.playerStrengthText.setText(`${this.localization[this.currentLanguage]['Stats_Strength']}: ${playerData.strength || 0}`);
                    if (this.playerSpeedText && this.playerSpeedText.active) this.playerSpeedText.setText(`${this.localization[this.currentLanguage]['Stats_Speed']}: ${playerData.speed || 0}`);
                    if (this.playerKeeperText && this.playerKeeperText.active) this.playerKeeperText.setText(`${this.localization[this.currentLanguage]['Stats_Catch']}: ${playerData.keeper || 0}`);


                    // Update attribute and rank labels with safety checks
                    if (this.playerAttributeText && this.playerAttributeText.active) {
                        this.playerAttributeText.setText(this.localization[this.currentLanguage]['Stats_Attribute'] + ':');
                    }
                    if (this.playerRarityText && this.playerRarityText.active) {
                        this.playerRarityText.setText(this.localization[this.currentLanguage]['Stats_Rarity'] + ':');
                    }

                    // Update only the icons
                    const attributeFrame = this.scene.playerStats.getAttributeFrame(playerData.attribute);
                    this.playerAttributeIcon.setFrame(attributeFrame);
                    this.playerRarityIcon.setFrame(borderFrame);
                    // Update position text
                    const position = this.scene.formationLogic.getPlayerPosition(this.selectedPlayer);
                    this.playerPositionText.setText(position);

                    // Show all elements
                    [this.playerNameText, this.playerLevelText, this.playerExpText,
                        this.playerAttributeIcon, this.playerAttributeText,
                        this.playerRarityIcon, this.playerRarityText,
                        this.playerPositionText
                    ].forEach(element => {
                        element.setVisible(true);
                    });
                } else {
                    // Hide all elements if no player data
                    [this.playerPortrait, this.playerBorder,
                        this.playerNameText, this.playerLevelText, this.playerExpText,
                        this.playerAttributeIcon, this.playerAttributeText,
                        this.playerRarityIcon, this.playerRarityText,
                        this.playerPositionText
                    ].forEach(element => {
                        element.setVisible(false);
                    });
                }
            }
        }
    }

    exitSwapMode() {
        this.isSwapMode = false;
        this.moveButtonText.setText(this.localization[this.currentLanguage]['Formation_MovePlayer']);
        // Hide the swap area rectangle
        if (this.swapAreaRect) {
            this.swapAreaRect.setAlpha(0);
        }
        // Destroy all swap indicators
        if (this.swapIndicators) {
            this.swapIndicators.forEach(indicator => {
                if (indicator) {
                    if (indicator.timeline) {
                        indicator.timeline.stop();
                    }
                    indicator.destroy();
                }
            });
            this.swapIndicators = [];
        }
    }

    swapPlayers(index1, index2) {
        // Swap players in the activePlayers array
        const temp = this.scene.playerStats.activePlayers[index1];
        this.playerStats.activePlayers[index1] = this.scene.playerStats.activePlayers[index2];
        this.playerStats.activePlayers[index2] = temp;
        // Update the formation display
        if (this.formationLogic) {
            // Refresh the formation screen to update player positions
            this.formationLogic.showFormationScreen();
        }
        // Update the player portrait and position display
        this.updatePlayerPortrait();
        // Save the changes
        this.saveGameData();
    }

    updateSelectionIndicator() {
        if (this.selectionIndicator && this.formationLogic) {
            // Hide all indicators if formation menu is open
            if (this.formationLogic.formationMenuOpen) {
                this.selectionIndicator.setVisible(false);
                if (this.swapIndicators) {
                    this.swapIndicators.forEach(indicator => {
                        if (indicator) {
                            indicator.setVisible(false);
                        }
                    });
                }
                return;
            }

            const playerSprites = this.scene.formationLogic.formationElements.players.filter(
                sprite => sprite.texture && sprite.texture.key === 'raimonBody'
            );

            // Update main selection indicator
            const targetSprite = playerSprites[this.selectedPlayer];
            if (targetSprite) {
                this.selectionIndicator.setPosition(targetSprite.x, targetSprite.y - targetSprite.height * 0.85);
                this.selectionIndicator.setVisible(true);
                this.selectionIndicator.setAlpha(1);
            } else {
                this.selectionIndicator.setVisible(false);
            }
            // Update swap indicators
            playerSprites.forEach((sprite, index) => {
                const swapIndicator = this.scene.swapIndicators[index];
                if (swapIndicator) {
                    if (this.isSwapMode && index !== this.scene.selectedPlayer) {
                        // Position and show swap indicator for other players
                        swapIndicator.setPosition(sprite.x, sprite.y - sprite.height * 0.85);
                        swapIndicator.setVisible(true);
                        // Add blinking effect if not already added
                        if (!swapIndicator.timeline) {
                            swapIndicator.timeline = this.scene.tweens.add({
                                targets: swapIndicator,
                                alpha: {
                                    from: 0.2,
                                    to: 0.8
                                },
                                duration: 600,
                                yoyo: true,
                                repeat: -1
                            });
                        }
                    } else {
                        swapIndicator.setVisible(false);
                        if (swapIndicator.timeline) {
                            swapIndicator.timeline.stop();
                            swapIndicator.timeline = null;
                        }
                    }
                }
            });
        }
    }

    getCurrentScreen() {
        // Return the current active screen
        if (this.lobbyInterface && this.lobbyInterface.currentScreen) {
            return this.lobbyInterface.currentScreen;
        }
        return null;
    }
    getPlayerPosition(playerIndex) {
        if (this.formationLogic) {
            const position = this.scene.formationLogic.getPlayerPosition(playerIndex);
            // If this is the selected player, update the indicator
            if (this.selectedPlayer === playerIndex && this.selectionIndicator) {
                this.updateSelectionIndicator();
            }
            return position;
        }
        return 'Unknown';
    }

    cleanup() {
        // Exit swap mode if active
        if (this.isSwapMode) {
            this.exitSwapMode();
        }
        // Destroy the swap area rectangle
        if (this.swapAreaRect) {
            this.swapAreaRect.destroy();
            this.swapAreaRect = null;
        }

        // Clean up Hissatsu slots
        if (this.hissatsuSlots) {
            this.hissatsuSlots.forEach(({
                sprite,
                text,
                border
            }) => {
                if (sprite) sprite.destroy();
                if (text) text.destroy();
                if (border) border.destroy();
            });
            this.hissatsuSlots = [];
        }

        // Clear the update function
        this.updateHissatsuSlots = null;

        // Remove pointer event listeners
        this.input.removeAllListeners('pointerdown');

        // Destroy selection indicator
        if (this.selectionIndicator) {
            this.selectionIndicator.destroy();
            this.selectionIndicator = null;
        }

        // Destroy swap indicators
        if (this.swapIndicators) {
            this.swapIndicators.forEach(indicator => {
                if (indicator) {
                    if (indicator.timeline) {
                        indicator.timeline.stop();
                    }
                    indicator.destroy();
                }
            });
            this.swapIndicators = [];
        }

        // Reset swap mode flag
        this.isSwapMode = false;

        // Close formation menu if open
        if (this.formationLogic && this.formationLogic.formationMenuOpen) {
            this.formationLogic.closeFormationMenu();
        }
    }
}

// Make it available globally
window.FormationManager = FormationManager;
