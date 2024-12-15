class FormationScreen {
    constructor(config) {
        // Store scene reference and configuration
        this.scene = config.scene;
        this.selectedPlayer = config.selectedPlayer;
        this.currentFormation = config.currentFormation;
        this.playerStats = config.playerStats;
        this.selectedNameStyle = config.selectedNameStyle;
        this.localization = config.localization;
        this.currentLanguage = config.currentLanguage;
        
        // Store utility methods
        this.getRarityFrame = config.utilityMethods.getRarityFrame;
        this.getAttributeFrame = config.utilityMethods.getAttributeFrame;
        this.getPlayerPosition = config.utilityMethods.getPlayerPosition;
        this.getFormationPositions = config.utilityMethods.getFormationPositions;
        this.saveGameData = config.utilityMethods.saveGameData;

        // Initialize class properties
        this.formationElements = {
            field: null,
            players: [],
            buttons: [],
            texts: []
        };
        this.isMovingPlayer = false;
        this.sourcePlayerIndex = null;
        this.swapIndicators = [];
        this.selectionIndicator = null;
        this.playerDetailsGroup = null;
        this.moveInstruction = null;
        this.changesSavedText = null;
        this.formFichaBlue1 = null;
        this.formFichaBlue2 = null;
        this.moveButton = null;
        this.moveText = null;
    }

    create() {
        // Clear any existing elements first
        this.clearExistingElements();
        
        // Create basic formation screen elements
        this.createField();
        this.createFormationButton();
        this.createFichas();
        this.createChangesSavedText();
        
        // Display current formation
        this.displayFormation(this.currentFormation);
        
        // Create selection indicator
        this.createSelectionIndicator();
    }

    clearExistingElements() {
        if (this.formationElements) {
            if (this.formationElements.field) {
                this.formationElements.field.destroy();
            }
            if (this.formationElements.players) {
                this.formationElements.players.forEach(player => {
                    if (player.body) player.body.destroy();
                    if (player.head) player.head.destroy();
                });
            }
            if (this.formationElements.buttons) {
                this.formationElements.buttons.forEach(button => {
                    if (button && button.destroy) button.destroy();
                });
            }
            if (this.formationElements.texts) {
                this.formationElements.texts.forEach(text => {
                    if (text && text.destroy) text.destroy();
                });
            }
        }
    }

    createField() {
        this.formationElements.field = this.scene.add.image(170, 290, 'formField').setOrigin(0.5);
    }

    createFormationButton() {
        const formationButton = this.scene.add.image(150, 505, 'button')
            .setInteractive()
            .on('pointerdown', () => this.showFormationOptions());

        const formationText = this.scene.add.text(150, 505, this.currentFormation, {
            fontSize: '20px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.formationElements.buttons.push(formationButton);
        this.formationElements.texts.push(formationText);
    }

    createFichas() {
        this.formFichaBlue1 = this.scene.add.image(580, 290, 'FormFichaBlue')
            .setOrigin(0.5)
            .setDepth(2);

        this.formFichaBlue2 = this.scene.add.image(580, 290, 'FormFichaBlue')
            .setOrigin(0.5)
            .setScale(-1, 1)
            .setDepth(1)
            .setAlpha(0.75);

        const statsText = this.scene.add.bitmapText(440, 135, 'customFont', 
            this.localization[this.currentLanguage]['Stats_Stats'], 38)
            .setOrigin(0, 0.5)
            .setDepth(2);

        this.updatePlayerDetails(this.selectedPlayer);

        const hissatsuText = this.scene.add.bitmapText(750, 135, 'customFont',
            this.localization[this.currentLanguage]['Stats_Hissatsu'], 38)
            .setOrigin(1, 0.5)
            .setDepth(3)
            .setAlpha(0.75);

        this.createFichaToggle(statsText, hissatsuText);
    }

    createFichaToggle(statsText, hissatsuText) {
        const toggleButton = this.scene.add.rectangle(0, 0, 195, 60);
        toggleButton.setOrigin(0, 0);
        toggleButton.setInteractive();
        toggleButton.input.cursor = 'pointer';

        const updateTogglePosition = () => {
            if (this.formFichaBlue1.depth === 2) {
                toggleButton.setPosition(
                    this.formFichaBlue1.x + this.formFichaBlue1.width / 2 - 200,
                    this.formFichaBlue1.y - this.formFichaBlue1.height / 2
                );
            } else {
                toggleButton.setPosition(
                    this.formFichaBlue1.x - this.formFichaBlue1.width / 2 + 5,
                    this.formFichaBlue1.y - this.formFichaBlue1.height / 2
                );
            }
        };

        updateTogglePosition();

        toggleButton.on('pointerdown', () => {
            this.toggleFicha(statsText, hissatsuText, updateTogglePosition);
        });
    }

    toggleFicha(statsText, hissatsuText, updateTogglePosition) {
        if (this.formFichaBlue1.depth === 2) {
            this.formFichaBlue1.setDepth(1).setAlpha(0.75);
            this.formFichaBlue2.setDepth(2).setAlpha(1);
            statsText.setAlpha(0.75);
            hissatsuText.setAlpha(1);
            if (this.playerDetailsGroup) {
                this.playerDetailsGroup.setVisible(false);
            }
        } else {
            this.formFichaBlue1.setDepth(2).setAlpha(1);
            this.formFichaBlue2.setDepth(1).setAlpha(0.75);
            statsText.setAlpha(1);
            hissatsuText.setAlpha(0.75);
            if (this.playerDetailsGroup) {
                this.playerDetailsGroup.setVisible(true);
            }
        }
        updateTogglePosition();
    }

    createChangesSavedText() {
        this.changesSavedText = this.scene.add.bitmapText(640, 505, 'customFont',
            this.localization[this.currentLanguage]['savedChanges'], 30)
            .setOrigin(0.5)
            .setDepth(2)
            .setVisible(false);
    }

    createSelectionIndicator() {
        const positions = this.getFormationPositions()[this.currentFormation];
        const currentPosition = positions[this.selectedPlayer];
        
        if (this.selectionIndicator) {
            this.selectionIndicator.destroy();
        }

        this.selectionIndicator = this.scene.add.rectangle(
            currentPosition.x,
            currentPosition.y - 25,
            44,
            54,
            0xffff00,
            0.5
        ).setDepth(0);

        this.scene.tweens.add({
            targets: this.selectionIndicator,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    displayFormation(formation) {
        // Clear existing player sprites
        if (this.formationElements.players.length > 0) {
            this.formationElements.players.forEach(player => {
                player.body.destroy();
                player.head.destroy();
            });
            this.formationElements.players = [];
        }

        const positions = this.getFormationPositions()[formation];
        const activePlayers = this.playerStats.activePlayers;

        // Create new player sprites
        activePlayers.forEach((playerKey, index) => {
            const playerData = this.playerStats.getPlayerStats(playerKey);
            const position = positions[index];

            // Create clickable area for player selection
            const hitArea = this.add.rectangle(position.x, position.y - 25, 40, 50)
                .setInteractive()
                .on('pointerdown', () => {
                    this.selectedPlayer = index;

                    // Get current formation positions
                    const currentPositions = this.getFormationPositions()[this.currentFormation];
                    // Clear previous selection indicator
                    if (this.selectionIndicator) {
                        this.selectionIndicator.destroy();
                    }
                    // Create new selection indicator
                    this.selectionIndicator = this.add.rectangle(position.x, position.y - 25, 44, 54, 0xffff00, 0.5);
                    this.selectionIndicator.setDepth(0);
                    // Create blinking effect
                    this.tweens.add({
                        targets: this.selectionIndicator,
                        alpha: 0,
                        duration: 500,
                        yoyo: true,
                        repeat: -1
                    });

                    // Always update the player details
                    this.updatePlayerDetails(index);

                    // Set visibility based on current ficha
                    if (this.playerDetailsGroup) {
                        this.playerDetailsGroup.setVisible(this.formFichaBlue1.depth === 2);
                    }

                    // Here you would update ficha 2 details
                    // if (this.hissatsuDetailsGroup) {
                    //     this.hissatsuDetailsGroup.setVisible(this.formFichaBlue2.depth === 2);
                    // }
                    // this.updateHissatsuDetails(index);
                });

            // Create body sprite
            const body = this.add.sprite(position.x, position.y, 'raimonBody', 0)
                .setOrigin(0.5, 1)
                .setScale(1.5);

            // Create head sprite
            let head = null;
            if (playerData.headSpriteConfig) {
                head = this.add.sprite(
                        position.x - 0.5,
                        position.y - body.height + 12,
                        playerData.headSpriteConfig.key,
                        playerData.headSpriteConfig.frames.front
                    )
                    .setOrigin(0.5, 1)
                    .setScale(1.5);
            }

            this.formationElements.players.push({
                body: body,
                head: head,
                playerKey: playerKey
            });
        });
    }

        updatePlayerDetails(playerIndex) {
        // Clear previous details if they exist
        if (this.playerDetailsGroup) {
            this.playerDetailsGroup.clear(true, true);
        } else {
            this.playerDetailsGroup = this.add.group();
        }
        const player = this.playerStats.getPlayerStats(this.playerStats.activePlayers[playerIndex]);

        // Base positions
        const portraitX = 440;
        const portraitY = 215; // Adjusted down 5px more

        // Add portrait with correct frame
        const portrait = this.add.sprite(portraitX, portraitY, 'raiTeiPortrait', player.portraitFrame)
            .setDepth(2)
            .setDisplaySize(64, 64);
        this.playerDetailsGroup.add(portrait);
        // Add rarity frame
        const rarityFrame = this.add.sprite(portraitX, portraitY, 'frameBorder', this.getRarityFrame(player.rarity))
            .setDepth(2)
            .setDisplaySize(70, 70);
        this.playerDetailsGroup.add(rarityFrame);
        // Add player name - always show full name in status screen
        const fullName = (this.selectedNameStyle === 'dub' && this.currentLanguage === 'en') ? player.name : player.undubName;
        const nameText = this.add.bitmapText(portraitX + 50, portraitY - 25, 'customFont', fullName, 24)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(nameText);
        // Add attribute and rank on the same line
        const attributeText = this.add.bitmapText(portraitX + 50, portraitY + 5, 'customFont', this.localization[this.currentLanguage]['Stats_Attribute'] + ':', 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(attributeText);
        const attributeIcon = this.add.sprite(portraitX + 140, portraitY + 10, 'attributes', this.getAttributeFrame(player.attribute))
            .setScale(0.8)
            .setDepth(2);
        this.playerDetailsGroup.add(attributeIcon);
        // Add rarity text and icon on the same line
        const rarityText = this.add.bitmapText(portraitX + 180, portraitY + 10, 'customFont', this.localization[this.currentLanguage]['Stats_Rarity'] + ':', 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(rarityText);

        const rarityIcon = this.add.sprite(portraitX + 250, portraitY + 10, 'raritySprite', this.getRarityFrame(player.rarity))
            .setScale(0.8)
            .setDepth(2);
        this.playerDetailsGroup.add(rarityIcon);
        // Add position text below portrait
        const position = this.getPlayerPosition(playerIndex);
        const positionText = this.add.bitmapText(portraitX, portraitY + 40, 'customFont', position, 24)
            .setOrigin(0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(positionText);
        // Add level and exp on the same line
        const levelText = this.add.bitmapText(portraitX + 50, portraitY + 35, 'customFont', `${this.localization[this.currentLanguage]['Stats_Level']}: ${player.level}`, 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(levelText);
        const expText = this.add.bitmapText(portraitX + 180, portraitY + 35, 'customFont', `${this.localization[this.currentLanguage]['Stats_Exp']}: ${player.exp}/500`, 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(expText);
        // Add TP and FP on the same line
        const tpText = this.add.bitmapText(portraitX + 50, portraitY + 70, 'customFont', `${this.localization[this.currentLanguage]['Stats_TP']}: ${player.TP}`, 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(tpText);
        const fpText = this.add.bitmapText(portraitX + 180, portraitY + 70, 'customFont', `${this.localization[this.currentLanguage]['Stats_FP']}: ${player.FP}`, 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(fpText);
        // Add Shoot and Strength on the same line
        const shootText = this.add.bitmapText(portraitX + 50, portraitY + 100, 'customFont', `${this.localization[this.currentLanguage]['Stats_Shoot']}: ${player.shoot}`, 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(shootText);
        const strengthText = this.add.bitmapText(portraitX + 180, portraitY + 100, 'customFont', `${this.localization[this.currentLanguage]['Stats_Strength']}: ${player.strength}`, 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(strengthText);
        // Add Dribble and Keeper on the same line
        const dribbleText = this.add.bitmapText(portraitX + 50, portraitY + 130, 'customFont', `${this.localization[this.currentLanguage]['Stats_Dribble']}: ${player.dribble}`, 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(dribbleText);
        const keeperText = this.add.bitmapText(portraitX + 180, portraitY + 130, 'customFont', `${this.localization[this.currentLanguage]['Stats_Catch']}: ${player.keeper}`, 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(keeperText);
        // Add Speed on its own line
        const speedText = this.add.bitmapText(portraitX + 50, portraitY + 160, 'customFont', `${this.localization[this.currentLanguage]['Stats_Speed']}: ${player.speed}`, 20)
            .setOrigin(0, 0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(speedText);

        // Add action buttons at the bottom of ficha 1
        const buttonY = portraitY + 230;
        const buttonSpacing = 110;

        // Move Player button
        const moveButton = this.add.image(portraitX + 15, buttonY - 20, 'BtFichaMove')
            .setInteractive()
            .setDepth(2)
            .on('pointerdown', () => this.handleMovePlayer());
        moveButton.setDisplaySize(moveButton.width - 20, moveButton.height);
        this.playerDetailsGroup.add(moveButton);

        const moveText = this.add.bitmapText(portraitX + 15, buttonY - 20, 'customFont', this.localization[this.currentLanguage]['Formation_MovePlayer'], 26)
            .setOrigin(0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(moveText);

        // Change Player button
        const changeButton = this.add.image(portraitX + 30 + buttonSpacing, buttonY - 22, 'BtFichaChange')
            .setInteractive()
            .setDepth(2);
        changeButton.setDisplaySize(changeButton.width - 20, changeButton.height);
        this.playerDetailsGroup.add(changeButton);

        const changeText = this.add.bitmapText(portraitX + 30 + buttonSpacing, buttonY - 22, 'customFont', this.localization[this.currentLanguage]['Formation_ChangePlayer'], 26)
            .setOrigin(0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(changeText);

        // Enhance button
        const enhanceButton = this.add.image(portraitX + 45 + buttonSpacing * 2, buttonY - 20, 'BtFichaEnhance')
            .setInteractive()
            .setDepth(2);
        enhanceButton.setDisplaySize(enhanceButton.width - 20, enhanceButton.height);
        this.playerDetailsGroup.add(enhanceButton);

        const enhanceText = this.add.bitmapText(portraitX + 45 + buttonSpacing * 2, buttonY - 20, 'customFont', this.localization[this.currentLanguage]['Formation_Enhance'], 26)
            .setOrigin(0.5)
            .setDepth(2);
        this.playerDetailsGroup.add(enhanceText);

        // Store references for move player functionality
        this.moveButton = moveButton;
        this.moveText = moveText;
    }

        handleMovePlayer() {
        if (!this.isMovingPlayer) {
            // Enter move player mode
            this.isMovingPlayer = true;
            this.sourcePlayerIndex = this.selectedPlayer;

            // Change button text to Cancel
            this.moveText.setText('Cancel');

            // Add instruction text above the field
            this.moveInstruction = this.add.bitmapText(640, 505, 'customFont', this.localization[this.currentLanguage]['Formation_SelectToSwap'], 30)
                .setOrigin(0.5)
                .setDepth(2);

            // Create selection indicators for all players except source
            this.swapIndicators = [];
            const positions = this.getFormationPositions()[this.currentFormation];
            positions.forEach((pos, index) => {
                if (index !== this.sourcePlayerIndex) {
                    const indicator = this.add.rectangle(pos.x, pos.y - 25, 44, 54, 0x00ff00, 0.5)
                        .setDepth(1);

                    // Add blinking effect
                    this.tweens.add({
                        targets: indicator,
                        alpha: 0,
                        duration: 500,
                        yoyo: true,
                        repeat: -1
                    });

                    this.swapIndicators.push(indicator);
                }
            });

            // Make all players clickable for swapping
            this.formationElements.players.forEach((player, index) => {
                if (index !== this.sourcePlayerIndex) {
                    const hitArea = this.add.rectangle(positions[index].x, positions[index].y - 25, 40, 50)
                        .setInteractive()
                        .on('pointerdown', () => this.swapPlayers(index));
                    this.swapIndicators.push(hitArea);
                }
            });
        } else {
            // Cancel move player mode
            this.cancelMovePlayer();
        }
    }

        cancelMovePlayer() {
        this.isMovingPlayer = false;
        this.moveText.setText('Move\nPlayer');

        // Remove instruction text
        if (this.moveInstruction) {
            this.moveInstruction.destroy();
        }

        // Remove all swap indicators
        if (this.swapIndicators) {
            this.swapIndicators.forEach(indicator => indicator.destroy());
            this.swapIndicators = [];
        }
    }

    swapPlayers(targetIndex) {
        // Swap players in the activePlayers array
        const temp = this.playerStats.activePlayers[this.sourcePlayerIndex];
        this.playerStats.activePlayers[this.sourcePlayerIndex] = this.playerStats.activePlayers[targetIndex];
        this.playerStats.activePlayers[targetIndex] = temp;
        // Save the game after player swap
        this.saveGameData();
        // Reset move player mode
        this.cancelMovePlayer();
        // Redisplay formation with new positions
        this.displayFormation(this.currentFormation);
        // Update player details
        this.updatePlayerDetails(this.selectedPlayer);
        // Show 'Changes Saved' message
        this.showChangesSaved();

    }

        showFormationOptions() {
        // Clear existing formation options if any
        if (this.formationOptions) {
            this.formationOptions.forEach(option => {
                option.btn.destroy();
                option.text.destroy();
            });
        }

        const formations = ['3-1-1', '2-2-1', '2-1-2', '1-3-1', '1-2-2'];
        this.formationOptions = formations.map((formation, index) => {
            const yPos = 460 - (index * 40);

            const btn = this.add.image(150, yPos, 'button')
                .setInteractive()
                .setDepth(3)
                .on('pointerdown', () => {
                    this.handleFormationSelection(formation);
                });

            const text = this.add.text(150, yPos, formation, {
                    fontSize: '20px',
                    fill: '#ffffff'
                })
                .setOrigin(0.5)
                .setDepth(3);

            return {
                btn,
                text
            };
        });
    }

    handleFormationSelection(formation) {
        // Update formation text
        this.formationElements.texts[0].setText(formation);
        // Store the current formation temporarily
        const previousFormation = this.currentFormation;
        // Update current formation immediately for position calculation
        this.currentFormation = formation;
        // Save the game after formation change
        this.saveGameData();
        // Get new positions for the formation
        const newPositions = this.getFormationPositions()[formation];
        // Update selection indicator position before displaying new formation
        if (this.selectionIndicator && this.selectedPlayer !== undefined) {
            const newPos = newPositions[this.selectedPlayer];
            this.selectionIndicator.x = newPos.x;
            this.selectionIndicator.y = newPos.y - 25;
        }
        // Display new formation
        this.displayFormation(formation);
        // Update player details to reflect new position
        if (this.selectedPlayer !== undefined) {
            this.updatePlayerDetails(this.selectedPlayer);
        }
        // Show 'Changes Saved' message
        this.showChangesSaved();
        // Clear formation options
        if (this.formationOptions) {
            this.formationOptions.forEach(option => {
                option.btn.destroy();
                option.text.destroy();
            });
            this.formationOptions = null;
        }
    }

        getFormationPositions() {
        return {
            '3-1-1': [{
                x: 170,
                y: 470
            }, {
                x: 100,
                y: 400
            }, {
                x: 170,
                y: 400
            }, {
                x: 240,
                y: 400
            }, {
                x: 170,
                y: 250
            }, {
                x: 170,
                y: 150
            }],
            '2-2-1': [{
                x: 170,
                y: 470
            }, {
                x: 120,
                y: 400
            }, {
                x: 220,
                y: 400
            }, {
                x: 120,
                y: 250
            }, {
                x: 220,
                y: 250
            }, {
                x: 170,
                y: 150
            }],
            '2-1-2': [{
                x: 170,
                y: 470
            }, {
                x: 120,
                y: 400
            }, {
                x: 220,
                y: 400
            }, {
                x: 170,
                y: 300
            }, {
                x: 120,
                y: 170
            }, {
                x: 220,
                y: 170
            }],
            '1-3-1': [{
                x: 170,
                y: 470
            }, {
                x: 170,
                y: 400
            }, {
                x: 100,
                y: 250
            }, {
                x: 170,
                y: 250
            }, {
                x: 240,
                y: 250
            }, {
                x: 170,
                y: 150
            }],
            '1-2-2': [{
                x: 170,
                y: 470
            }, {
                x: 170,
                y: 400
            }, {
                x: 120,
                y: 300
            }, {
                x: 220,
                y: 300
            }, {
                x: 120,
                y: 170
            }, {
                x: 220,
                y: 170
            }]
        };
    }

    showChangesSaved() {
        if (this.changesSavedText) {
            this.changesSavedText.setVisible(true);
            this.scene.time.delayedCall(2000, () => {
                if (this.changesSavedText?.active) {
                    this.changesSavedText.setVisible(false);
                }
            });
        }
    }

    destroy() {
        this.clearExistingElements();
        if (this.selectionIndicator) this.selectionIndicator.destroy();
        if (this.playerDetailsGroup) this.playerDetailsGroup.destroy();
        if (this.changesSavedText) this.changesSavedText.destroy();
        if (this.formFichaBlue1) this.formFichaBlue1.destroy();
        if (this.formFichaBlue2) this.formFichaBlue2.destroy();
    }
}
