class FormationLogic {
    constructor(scene) {
        this.scene = scene;
        this.formationElements = {
            players: [],
            texts: []
        };
        this.currentFormation = '2-1-2';
        this.formationMenuOpen = false;
        this.formationButtons = [];
    }

    showFormationScreen() {
        // Clear any existing elements
        if (this.formationElements.players.length > 0) {
            this.formationElements.players.forEach(player => player.destroy());
            this.formationElements.players = [];
        }

        const fieldX = 180;
        const fieldY = 100;
        // Add formation field
        const formField = this.scene.add.image(fieldX, fieldY, 'formField');
        formField.setOrigin(0.5, 0);

        // Add formation button
        const formationButton = this.scene.add.image(fieldX, 505, 'button');
        formationButton.setOrigin(0.5).setInteractive();
        const formationText = this.scene.add.bitmapText(fieldX, 505, 'customFont', this.currentFormation, 30)
            .setOrigin(0.5)
            .setTint(0xFFFFFF);

        // Add click handler for formation button
        formationButton.on('pointerdown', () => {
            if (this.formationMenuOpen) {
                this.closeFormationMenu();
            } else {
                this.openFormationMenu(fieldX, formationButton.y);
            }
        });

        this.formationElements.players.push(formationButton);
        this.formationElements.players.push(formationText);
        // Position players according to current formation
        this.positionPlayersInFormation(fieldX, fieldY);
    }

    getFormationPositions() {
        return {
            '2-1-2': (fieldX, fieldY) => [{
                x: fieldX,
                y: fieldY + 350
            }, // GK
            {
                x: fieldX - 60,
                y: fieldY + 270
            }, // DF Left
            {
                x: fieldX + 60,
                y: fieldY + 270
            }, // DF Right
            {
                x: fieldX,
                y: fieldY + 190
            }, // MF
            {
                x: fieldX - 50,
                y: fieldY + 110
            }, // FW Left
            {
                x: fieldX + 50,
                y: fieldY + 110
            } // FW Right
            ],
            '3-1-1': (fieldX, fieldY) => [{
                x: fieldX,
                y: fieldY + 350
            }, // GK
            {
                x: fieldX - 70,
                y: fieldY + 270
            }, // DF Left
            {
                x: fieldX,
                y: fieldY + 270
            }, // DF Center
            {
                x: fieldX + 70,
                y: fieldY + 270
            }, // DF Right
            {
                x: fieldX,
                y: fieldY + 190
            }, // MF
            {
                x: fieldX,
                y: fieldY + 110
            } // FW
            ],
            '2-2-1': (fieldX, fieldY) => [{
                x: fieldX,
                y: fieldY + 350
            }, // GK
            {
                x: fieldX - 60,
                y: fieldY + 270
            }, // DF Left
            {
                x: fieldX + 60,
                y: fieldY + 270
            }, // DF Right
            {
                x: fieldX - 50,
                y: fieldY + 190
            }, // MF Left
            {
                x: fieldX + 50,
                y: fieldY + 190
            }, // MF Right
            {
                x: fieldX,
                y: fieldY + 110
            } // FW
            ],
            '1-2-2': (fieldX, fieldY) => [{
                x: fieldX,
                y: fieldY + 350
            }, // GK
            {
                x: fieldX,
                y: fieldY + 270
            }, // DF
            {
                x: fieldX - 60,
                y: fieldY + 190
            }, // MF Left
            {
                x: fieldX + 60,
                y: fieldY + 190
            }, // MF Right
            {
                x: fieldX - 50,
                y: fieldY + 110
            }, // FW Left
            {
                x: fieldX + 50,
                y: fieldY + 110
            } // FW Right
            ],
            '1-1-3': (fieldX, fieldY) => [{
                x: fieldX,
                y: fieldY + 350
            }, // GK
            {
                x: fieldX,
                y: fieldY + 270
            }, // DF
            {
                x: fieldX,
                y: fieldY + 190
            }, // MF
            {
                x: fieldX - 70,
                y: fieldY + 110
            }, // FW Left
            {
                x: fieldX,
                y: fieldY + 110
            }, // FW Center
            {
                x: fieldX + 70,
                y: fieldY + 110
            } // FW Right
            ],
            '1-3-1': (fieldX, fieldY) => [{
                x: fieldX,
                y: fieldY + 350
            }, // GK
            {
                x: fieldX,
                y: fieldY + 270
            }, // DF
            {
                x: fieldX - 70,
                y: fieldY + 190
            }, // MF Left
            {
                x: fieldX,
                y: fieldY + 190
            }, // MF Center
            {
                x: fieldX + 70,
                y: fieldY + 190
            }, // MF Right
            {
                x: fieldX,
                y: fieldY + 110
            } // FW
            ],
        };
    }

    positionPlayersInFormation(fieldX, fieldY) {
        const activePlayers = this.scene.playerStats.activePlayers;
        const formationPositions = this.getFormationPositions()[this.currentFormation];

        if (!formationPositions) {
            console.error(`Formation ${this.currentFormation} not found`);
            return;
        }
        const positions = formationPositions(fieldX, fieldY);
        activePlayers.forEach((playerKey, index) => {
            if (index < positions.length) {
                const playerData = this.scene.playerStats.getPlayerStats(playerKey);
                const pos = positions[index];
                // Add player body
                const body = this.scene.add.image(pos.x, pos.y, 'raimonBody', 0);
                body.setOrigin(0.5, 1).setScale(1.75);
                // Add player head if configuration exists
                if (playerData.headSpriteConfig) {
                    const head = this.scene.add.image(
                        pos.x - 0.5,
                        pos.y - (body.height * 1.75) + (9 * 1.75),
                        playerData.headSpriteConfig.key,
                        playerData.headSpriteConfig.frames.front
                    );
                    head.setOrigin(0.5, 0.5).setScale(1.75);
                    this.formationElements.players.push(head);
                }
                this.formationElements.players.push(body);
            }
        });
    }

    openFormationMenu(x, baseY) {
        this.formationMenuOpen = true;
        const formations = Object.keys(this.getFormationPositions());
        const spacing = 60;

        formations.forEach((formation, index) => {
            if (formation !== this.currentFormation) {
                const button = this.scene.add.image(x, baseY - ((index + 1) * spacing), 'button');
                const text = this.scene.add.bitmapText(x, baseY - ((index + 1) * spacing), 'customFont', formation, 30)
                    .setOrigin(0.5)
                    .setTint(0xFFFFFF);

                button.setOrigin(0.5).setInteractive();
                button.on('pointerdown', () => this.changeFormation(formation));

                this.formationButtons.push({
                    button,
                    text
                });
            }
        });
    }

    closeFormationMenu() {
        this.formationMenuOpen = false;
        this.formationButtons.forEach(({
            button,
            text
        }) => {
            button.destroy();
            text.destroy();
        });
        this.formationButtons = [];
    }

    changeFormation(newFormation) {
        this.closeFormationMenu();
        this.currentFormation = newFormation;
        const formationText = this.formationElements.players[1];
        formationText.setText(newFormation);
        this.formationElements.players.forEach(player => {
            if (player instanceof Phaser.GameObjects.Image &&
                (player.texture.key === 'raimonBody' || player.texture.key === 'raimonHead')) {
                player.destroy();
            }
        });
        this.positionPlayersInFormation(180, 100);
        this.scene.saveGameData();
    }

    getPlayerPosition(playerIndex) {
        const formationPositions = this.getFormationPositions()[this.currentFormation];
        if (!formationPositions) {
            console.error(`Formation ${this.currentFormation} not found`);
            return 'Unknown';
        }

        const positions = formationPositions(180, 100);

        if (!positions || playerIndex >= positions.length) {
            console.error(`Invalid player index: ${playerIndex}`);
            return 'Unknown';
        }

        const playerY = positions[playerIndex].y;

        if (playerIndex === 0) {
            return 'GK';
        } else if (playerY >= 370) {
            return 'DF';
        } else if (playerY >= 290) {
            return 'MF';
        } else {
            return 'FW';
        }
    }
}
