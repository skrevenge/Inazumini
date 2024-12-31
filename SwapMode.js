class SwapMode {
    constructor(scene) {
        this.scene = scene;
        this.yellowIndicator = null;
        this.blueIndicators = [];
        this.playerSelectionHandler = null;
    }

    setupFormationField() {
        // Create red rectangle
        const redRect = this.scene.add.rectangle(30, 100, 300, 375, 0xFF0000, 0);
        redRect.setOrigin(0, 0);
        redRect.setDepth(1);
        redRect.setName('formationRedRect');

        // Add swap button on the right side
        const swapButton = this.scene.add.image(570, 500, 'btSwap');
        swapButton.setDepth(10);
        swapButton.setName('btSwap');
        swapButton.setInteractive({ useHandCursor: true });

        // Add swap text below the button
        const swapText = this.scene.add.bitmapText(570, 500, 'customFont',
            this.scene.localization[this.scene.currentLanguage]['Formation_SwapPlayer'], 26);
        swapText.setOrigin(0.5);
        swapText.setDepth(10);
        swapText.setName('btSwapText');

        // Initialize swap properties
        swapButton.isSwapMode = false;
        swapButton.firstSelectedIndex = -1;

        // Setup swap button click handler
        this.setupSwapButtonHandler(swapButton, swapText);

        // Add flag to track formation changes
        this.scene.formationLogic.justChangedFormation = false;

        // Add method to handle formation changes
        this.setupFormationChangeHandler();

        // Add reserves section
        this.setupReservesSection();
    }

    setupSwapButtonHandler(swapButton, swapText) {
        swapButton.on('pointerdown', () => {
            if (this.scene.formationLogic.formationMenuOpen) {
                console.log('Cannot enter swap mode while formation menu is open');
                return;
            }

            console.log('Swap button clicked');
            console.log('Current swap mode:', swapButton.isSwapMode);

            swapButton.isSwapMode = !swapButton.isSwapMode;
            console.log('New swap mode:', swapButton.isSwapMode);

            if (swapButton.isSwapMode) {
                swapButton.firstSelectedIndex = this.scene.selectedPlayerIndex;
                this.createBlueIndicators();
                // Show reserves elements when entering swap mode
                const reservesIcon = this.scene.children.getByName('reservesIcon');
                const benchText = this.scene.children.getByName('benchText');
                if (reservesIcon) reservesIcon.setVisible(true);
                if (benchText) benchText.setVisible(true);
                console.log('Entering swap mode with player:', this.scene.selectedPlayerIndex);
            } else {
                swapButton.firstSelectedIndex = -1;
                this.clearBlueIndicators();
                // Hide reserves elements when exiting swap mode
                const reservesIcon = this.scene.children.getByName('reservesIcon');
                const benchText = this.scene.children.getByName('benchText');
                if (reservesIcon) reservesIcon.setVisible(false);
                if (benchText) benchText.setVisible(false);
                console.log('Canceling swap mode');
            }

            swapText.setText(this.scene.localization[this.scene.currentLanguage][
                swapButton.isSwapMode ? 'Formation_Cancel' : 'Formation_SwapPlayer'
            ]);
        });
    }

    setupFormationChangeHandler() {
        const originalChangeFormation = this.scene.formationLogic.changeFormation;
        this.scene.formationLogic.changeFormation = (newFormation) => {
            originalChangeFormation.call(this.scene.formationLogic, newFormation);
            this.scene.formationLogic.justChangedFormation = true;
            this.scene.selectedPlayerIndex = 0;
            this.updateYellowIndicator();
        };
    }

    setupReservesSection() {
        const reservesImage = this.scene.add.image(275, 105, 'reserves');
        reservesImage.setOrigin(0, 0);
        reservesImage.setDepth(5);
        reservesImage.setName('reservesIcon');
        reservesImage.setVisible(false);

        const benchText = this.scene.add.bitmapText(
            275 + (reservesImage.width / 2),
            105 + reservesImage.height - 15,
            'customFont',
            this.scene.localization[this.scene.currentLanguage]['Formation_Bench'],
            26
        );
        benchText.setOrigin(0.5, 0);
        benchText.setDepth(5);
        benchText.setName('benchText');
        benchText.setVisible(false);
    }

    setupPlayerSelection() {
        // Remove existing listeners if any
        this.scene.input.removeAllListeners('pointerdown');

        // Store the handler function for later cleanup
        this.playerSelectionHandler = (pointer) => {
            // Only process if we're in formation screen
            if (this.scene.getCurrentScreen() !== 'formation') return;
            if (!this.scene.formationLogic || !this.scene.formationLogic.formationElements) return;

            const swapButton = this.scene.children.getByName('btSwap');
            const redRect = this.scene.children.getByName('formationRedRect');

            // Ignore clicks on the swap button itself to prevent immediate cancellation
            if (swapButton && pointer.x >= swapButton.x - swapButton.width / 2 &&
                pointer.x <= swapButton.x + swapButton.width / 2 &&
                pointer.y >= swapButton.y - swapButton.height / 2 &&
                pointer.y <= swapButton.y + swapButton.height / 2) {
                return;
            }

            // Check if we're in swap mode and clicked outside the red rectangle
            if (swapButton && swapButton.isSwapMode && redRect) {
                const redRectBounds = redRect.getBounds();
                if (!redRectBounds.contains(pointer.x, pointer.y)) {
                    // Cancel swap mode
                    swapButton.isSwapMode = false;
                    swapButton.firstSelectedIndex = -1;
                    this.clearBlueIndicators();
                    // Hide reserves elements
                    const reservesIcon = this.scene.children.getByName('reservesIcon');
                    const benchText = this.scene.children.getByName('benchText');
                    if (reservesIcon) reservesIcon.setVisible(false);
                    if (benchText) benchText.setVisible(false);
                    const swapText = this.scene.children.getByName('btSwapText');
                    if (swapText) {
                        swapText.setText(this.scene.localization[this.scene.currentLanguage]['Formation_SwapPlayer']);
                    }
                    return;
                }
            }

            const playerBodies = this.scene.formationLogic.formationElements.players.filter(element =>
                element && element.texture && element.texture.key === 'raimonBody'
            );

            for (let i = 0; i < playerBodies.length; i++) {
                const body = playerBodies[i];
                if (!body || !body.active) continue;

                const bodyHeight = body.height * body.scale;
                const bodyWidth = body.width * body.scale;
                const clickArea = new Phaser.Geom.Rectangle(
                    body.x - (bodyWidth / 2),
                    body.y - bodyHeight,
                    bodyWidth,
                    bodyHeight
                );

                if (clickArea.contains(pointer.x, pointer.y)) {
                    if (swapButton && swapButton.isSwapMode && swapButton.firstSelectedIndex !== -1) {
                        // Perform swap
                        if (i !== swapButton.firstSelectedIndex) {
                            this.swapPlayers(swapButton.firstSelectedIndex, i);
                        }
                        // Exit swap mode
                        swapButton.isSwapMode = false;
                        swapButton.firstSelectedIndex = -1;
                        this.clearBlueIndicators();
                        const swapText = this.scene.children.getByName('btSwapText');
                        if (swapText) {
                            swapText.setText(this.scene.localization[this.scene.currentLanguage]['Formation_SwapPlayer']);
                        }
                    }
                    this.scene.selectedPlayerIndex = i;
                    this.updateYellowIndicator();
                    this.scene.updatePlayerInfo();
                    console.log(`Selected player: ${i}, Position: ${this.scene.getPlayerPosition(i)}`);
                    break;
                }
            }
        };

        // Add click handler for player selection
        this.scene.input.on('pointerdown', this.playerSelectionHandler);
    }

    createYellowIndicator() {
        if (this.yellowIndicator) {
            this.yellowIndicator.destroy();
        }

        // Create a rectangle that covers both head and body with fill color
        this.yellowIndicator = this.scene.add.rectangle(0, 0, 40, 60, 0xffff00, 0.9);
        this.yellowIndicator.setDepth(2);

        // Initialize blue indicators array
        this.blueIndicators = [];

        // Make sure selectedPlayerIndex is valid
        if (typeof this.scene.selectedPlayerIndex === 'undefined') {
            this.scene.selectedPlayerIndex = 0;
        }

        // Update indicator position
        this.updateYellowIndicator();

        // Add blinking animation
        this.scene.tweens.add({
            targets: this.yellowIndicator,
            alpha: {
                from: 0.3,
                to: 0.6
            },
            duration: 500,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });
    }

    updateYellowIndicator() {
        if (!this.yellowIndicator || !this.scene.formationLogic) return;

        // Reset to player 0 if formation menu is open or was just closed
        if (this.scene.formationLogic.formationMenuOpen || this.scene.formationLogic.justChangedFormation) {
            this.scene.selectedPlayerIndex = 0;
            this.scene.formationLogic.justChangedFormation = false;
            // Hide indicator when formation menu is open
            this.yellowIndicator.setVisible(false);
        } else {
            // Only show indicator when in formation screen and menu is closed
            this.yellowIndicator.setVisible(this.scene.getCurrentScreen() === 'formation');
        }

        // Get all player bodies
        const playerBodies = this.scene.formationLogic.formationElements.players.filter(element =>
            element.texture.key === 'raimonBody'
        );

        if (playerBodies && this.scene.selectedPlayerIndex < playerBodies.length) {
            // Get the selected player
            const selectedPlayer = playerBodies[this.scene.selectedPlayerIndex];
            // Update indicator position to match selected player
            this.yellowIndicator.setPosition(
                selectedPlayer.x,
                selectedPlayer.y - (selectedPlayer.height * selectedPlayer.scale / 2)
            );
            this.yellowIndicator.setVisible(true);
        }
    }

    createBlueIndicators() {
        // Clear any existing blue indicators first
        this.clearBlueIndicators();

        if (!this.scene.formationLogic || !this.scene.formationLogic.formationElements) return;

        const playerBodies = this.scene.formationLogic.formationElements.players.filter(element =>
            element && element.texture && element.texture.key === 'raimonBody'
        );

        playerBodies.forEach((player, index) => {
            if (index !== this.scene.selectedPlayerIndex) {
                const blueIndicator = this.scene.add.rectangle(
                    player.x,
                    player.y - (player.height * player.scale / 2),
                    40,
                    60,
                    0x00bfff,
                    0.6
                );
                blueIndicator.setDepth(1);

                // Add blinking animation
                this.scene.tweens.add({
                    targets: blueIndicator,
                    alpha: {
                        from: 0.3,
                        to: 0.6
                    },
                    duration: 500,
                    ease: 'Linear',
                    yoyo: true,
                    repeat: -1
                });

                this.blueIndicators.push(blueIndicator);
            }
        });
    }

    clearBlueIndicators() {
        if (this.blueIndicators) {
            this.blueIndicators.forEach(indicator => {
                this.scene.tweens.killTweensOf(indicator);
                indicator.destroy();
            });
            this.blueIndicators = [];
        }
    }

    swapPlayers(index1, index2) {
        if (!this.scene.formationLogic || !this.scene.formationLogic.formationElements) return;

        // Swap players in the active players array
        const temp = this.scene.playerStats.activePlayers[index1];
        this.scene.playerStats.activePlayers[index1] = this.scene.playerStats.activePlayers[index2];
        this.scene.playerStats.activePlayers[index2] = temp;

        // Clear existing player sprites
        this.scene.formationLogic.formationElements.players = this.scene.formationLogic.formationElements.players.filter(player => {
            if (player instanceof Phaser.GameObjects.Image &&
                (player.texture.key === 'raimonBody' || player.texture.key === 'raimonHead')) {
                player.destroy();
                return false;
            }
            return true;
        });

        // Reposition all players with updated positions
        this.scene.formationLogic.positionPlayersInFormation(180, 100);

        // Hide reserves elements after swap
        const reservesIcon = this.scene.children.getByName('reservesIcon');
        const benchText = this.scene.children.getByName('benchText');
        if (reservesIcon) reservesIcon.setVisible(false);
        if (benchText) benchText.setVisible(false);

        // Save the changes
        this.scene.saveGameData();
    }
}
