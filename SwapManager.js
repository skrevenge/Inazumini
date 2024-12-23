class SwapManager {
    constructor(scene) {
        this.scene = scene;
        this.swapAreaRect = null;
        this.isSwapMode = false;
        this.swapIndicators = [];
    }

    setupSwapArea() {
        this.swapAreaRect = this.scene.add.rectangle(30, 100, 300, 375, 0xFF0000);
        this.swapAreaRect.setAlpha(0);
        this.swapAreaRect.setOrigin(0, 0);
        this.swapAreaRect.setDepth(1);
    }

    enterSwapMode(selectedPlayer, moveButtonText, localization, currentLanguage) {
        // Always check if we can enter swap mode
        if (this.scene.formationLogic.formationMenuOpen || this.isSwapMode) {
            return;
        }

        // Set swap mode and update button text
        this.isSwapMode = true;
        if (moveButtonText) {
            moveButtonText.setText(localization[currentLanguage]['Formation_Cancel']);
            moveButtonText.setVisible(true);
        }

        // Update swap area visibility
        if (this.swapAreaRect) {
            this.swapAreaRect.setAlpha(0);
        }

        // Get valid player sprites
        const playerSprites = this.scene.formationLogic.formationElements.players.filter(
            sprite => sprite.texture && sprite.texture.key === 'raimonBody'
        );

        // Clear and create new indicators
        this.clearSwapIndicators();
        playerSprites.forEach((sprite, index) => {
            if (index !== selectedPlayer) {
                const indicator = this.scene.add.rectangle(
                    sprite.x,
                    sprite.y - sprite.height * 0.85,
                    40, 62, 0xffff00
                );
                indicator.setFillStyle(0xffff00, 0.5);
                indicator.setDepth(0);
                
                // Add blinking effect
                indicator.timeline = this.scene.tweens.add({
                    targets: indicator,
                    alpha: { from: 0.2, to: 0.8 },
                    duration: 600,
                    yoyo: true,
                    repeat: -1
                });
                
                this.swapIndicators.push(indicator);
            }
        });
    }

    exitSwapMode(moveButtonText, localization, currentLanguage) {
        // Reset swap mode state
        this.isSwapMode = false;

        // Update button text and ensure visibility
        if (moveButtonText) {
            moveButtonText.setText(localization[currentLanguage]['Formation_MovePlayer']);
            moveButtonText.setVisible(true);
        }
        
        // Clear visual elements
        if (this.swapAreaRect) {
            this.swapAreaRect.setAlpha(0);
        }
        
        this.clearSwapIndicators();

        // Force update the scene's selection indicator
        if (this.scene.updateSelectionIndicator) {
            this.scene.updateSelectionIndicator();
        }
    }

    clearSwapIndicators() {
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
        this.scene.playerStats.activePlayers[index1] = this.scene.playerStats.activePlayers[index2];
        this.scene.playerStats.activePlayers[index2] = temp;

        // Update the formation display
        if (this.scene.formationLogic) {
            this.scene.formationLogic.showFormationScreen();
        }

        // Update the player portrait and position display
        this.scene.updatePlayerPortrait();

        // Save the changes
        this.scene.saveGameData();
    }

    updateSwapIndicators(selectedPlayer) {
        const playerSprites = this.scene.formationLogic.formationElements.players.filter(
            sprite => sprite.texture && sprite.texture.key === 'raimonBody'
        );

        playerSprites.forEach((sprite, index) => {
            const swapIndicator = this.swapIndicators[index];
            if (swapIndicator) {
                if (this.isSwapMode && index !== selectedPlayer) {
                    swapIndicator.setPosition(sprite.x, sprite.y - sprite.height * 0.85);
                    swapIndicator.setVisible(true);
                    
                    if (!swapIndicator.timeline) {
                        swapIndicator.timeline = this.scene.tweens.add({
                            targets: swapIndicator,
                            alpha: { from: 0.2, to: 0.8 },
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

    cleanup() {
        if (this.isSwapMode) {
            this.exitSwapMode();
        }

        if (this.swapAreaRect) {
            this.swapAreaRect.destroy();
            this.swapAreaRect = null;
        }

        this.clearSwapIndicators();
    }
}
