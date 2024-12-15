class FormationScreen {
    constructor(scene) {
        this.scene = scene;
        this.formationElements = {
            field: null,
            players: [],
            buttons: [],
            texts: []
        };
        this.isMovingPlayer = false;
        this.sourcePlayerIndex = null;
        this.selectedPlayer = 0;
        this.currentFormation = '2-1-2';
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
            // Clean up field
            if (this.formationElements.field) {
                this.formationElements.field.destroy();
            }

            // Clean up players
            if (this.formationElements.players) {
                this.formationElements.players.forEach(player => {
                    if (player.body) player.body.destroy();
                    if (player.head) player.head.destroy();
                });
            }

            // Clean up buttons
            if (this.formationElements.buttons) {
                this.formationElements.buttons.forEach(button => {
                    if (button && button.destroy) button.destroy();
                });
            }

            // Clean up texts
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
        // Create FormFichaBlue images
        this.formFichaBlue1 = this.scene.add.image(580, 290, 'FormFichaBlue')
            .setOrigin(0.5)
            .setDepth(2);

        this.formFichaBlue2 = this.scene.add.image(580, 290, 'FormFichaBlue')
            .setOrigin(0.5)
            .setScale(-1, 1)
            .setDepth(1)
            .setAlpha(0.75);

        // Add Stats and Hissatsu text labels
        const statsText = this.scene.add.bitmapText(440, 135, 'customFont', 
            this.scene.localization[this.scene.currentLanguage]['Stats_Stats'], 38)
            .setOrigin(0, 0.5)
            .setDepth(2);

        // Add player portrait and details to ficha 1
        this.updatePlayerDetails(this.selectedPlayer);

        const hissatsuText = this.scene.add.bitmapText(750, 135, 'customFont',
            this.scene.localization[this.scene.currentLanguage]['Stats_Hissatsu'], 38)
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
                toggleButton.setPosition(this.formFichaBlue1.x + this.formFichaBlue1.width / 2 - 200,
                    this.formFichaBlue1.y - this.formFichaBlue1.height / 2);
            } else {
                toggleButton.setPosition(this.formFichaBlue1.x - this.formFichaBlue1.width / 2 + 5,
                    this.formFichaBlue1.y - this.formFichaBlue1.height / 2);
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
            this.scene.localization[this.scene.currentLanguage]['savedChanges'], 30)
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
