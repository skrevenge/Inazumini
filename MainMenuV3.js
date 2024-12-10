class MainMenu {
    constructor(scene) {
        this.scene = scene;
    }

    create() {
        console.log('Showing main menu');
        this.scene.children.removeAll();
        const background = this.scene.add.image(400, 300, 'menuBG');
        background.setOrigin(0.5);
        background.setDisplaySize(800, 600);
        const logo = this.scene.add.image(400, 100, 'inaMiniLogo');
        logo.setOrigin(0.5);

        const menuItems = ['MenuOption_NewGame', 'MenuOption_Continue', 'MenuOption_Instructions'];
        const hasSaveData = localStorage.getItem('inazuminiSave') !== null;
        menuItems.forEach((item, index) => {
            const y = 460 + index * 52; // Moved down to 460 and kept the 52 pixel spacing
            // Add the CommonBarMenu image at its original size
            const bar = this.scene.add.image(0, 0, 'commonBarMenu');
            bar.setOrigin(0.5);
            const text = this.scene.add.text(0, 0, this.scene.localization[this.scene.currentLanguage][item], {
                fontSize: '28px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            // Create a container for the bar and text
            const container = this.scene.add.container(400, y, [bar, text]);
            container.setSize(bar.width, bar.height);
            container.setInteractive();
            this.addHoverEffect(container);
            container.on('pointerdown', () => this.handleMenuSelection(item, container));
            console.log(`Created menu item: ${item} at y=${y}`);
        });
        console.log('Main menu creation complete');
    }

handleMenuSelection(item, selectedContainer) {
    console.log(`Selected menu item: ${item}`);
    // Apply darkening effect
    this.scene.tweens.add({
        targets: selectedContainer.first, // Target the bar image
        alpha: 0.5, // Darken the button
        duration: 100,
        yoyo: true, // This will reverse the tween, bringing the alpha back to 1
        ease: 'Power2'
    });
    // Implement the logic for each menu option here
    switch (item) {
        case 'MenuOption_NewGame':
            if (localStorage.getItem('inazuminiSave')) {
                // Chama a função handleNewGame para mostrar o modal
                this.handleNewGame(); 
            } else {
                // Não há save, inicia um novo jogo diretamente
                this.destroy();
                this.scene.showLobby('lobby'); 
            }
            break;
        case 'MenuOption_Continue':
            console.log('Continuing game...');
            this.handleContinue();
            break;
        case 'MenuOption_Instructions':
            console.log('Showing instructions...');
            this.showInstructionsScreen();
            break;
    }
}

 handleNewGame() {
    if (localStorage.getItem('inazuminiSave')) {
        // Create confirmation dialog
        const dialogWidth = 400;
        const dialogHeight = 200;
        const x = 400;
        const y = 300;
        
        // Add semi-transparent background
        const overlay = this.scene.add.rectangle(0, 0, 800, 600, 0x000000, 0.7)
            .setOrigin(0)
            .setDepth(3);
        
        // Add dialog background
        const dialogBg = this.scene.add.rectangle(x, y, dialogWidth, dialogHeight, 0x333333)
            .setOrigin(0.5)
            .setDepth(3);
        
        // Add warning text
        const warningText = this.scene.add.bitmapText(x, y - 40, 'customFont',
            'Existing save data detected!\nStart new game and delete save?', 24)
            .setOrigin(0.5)
            .setDepth(3);
        
        // Add Yes button
        const yesButton = this.scene.add.image(x - 80, y + 40, 'button')
            .setInteractive()
            .setDepth(3);
        const yesText = this.scene.add.bitmapText(x - 80, y + 40, 'customFont', 'Yes', 24)
            .setOrigin(0.5)
            .setDepth(3);
        
        // Add No button
        const noButton = this.scene.add.image(x + 80, y + 40, 'button')
            .setInteractive()
            .setDepth(3);
        const noText = this.scene.add.bitmapText(x + 80, y + 40, 'No', 24)
            .setOrigin(0.5)
            .setDepth(3);

        // Handle button clicks
        yesButton.on('pointerdown', () => {
            // Clear save data
            localStorage.removeItem('inazuminiSave');

            // Reset to default state
            this.scene.playerStats = new PlayerStats();
            this.scene.playerStats.initializeDefaultPlayers();
            this.scene.playerStats.activePlayers = this.scene.playerStats.getAllPlayers().slice(0, 6);

            // Clean up dialog and start new game
            overlay.destroy();
            dialogBg.destroy();
            warningText.destroy();
            yesButton.destroy();
            yesText.destroy();
            noButton.destroy();
            noText.destroy();
            this.destroy();
            this.scene.showLobby('lobby'); 
        });

        noButton.on('pointerdown', () => {
            // Just clean up dialog
            overlay.destroy();
            dialogBg.destroy();
            warningText.destroy();
            yesButton.destroy();
            yesText.destroy();
            noButton.destroy();
            noText.destroy();
        });
    } else {
        // No save data exists, start new game directly
        this.destroy();
        this.scene.showLobby('lobby');
    }
}


    handleContinue() {
        console.log('Handling continue...');
        const savedData = localStorage.getItem('inazuminiSave');

        if (savedData) {
            try {
                // Parse the saved data
                const saveData = JSON.parse(savedData);

                // Version check (for future compatibility)
                if (saveData.version !== '1.0') {
                    console.warn('Save data version mismatch');
                    return false;
                }

                // Load formation
                this.scene.currentFormation = saveData.formation;
                console.log('Loaded formation:', this.scene.currentFormation);

                // Load active players
                this.scene.playerStats.activePlayers = saveData.players.active.map(playerData => playerData.key);
                console.log('Loaded active players:', this.scene.playerStats.activePlayers);

                // Update individual player stats
                saveData.players.active.forEach(playerData => {
                    const player = this.scene.playerStats.getPlayerStats(playerData.key);
                    if (player) {
                        player.level = playerData.stats.level;
                        player.exp = playerData.stats.exp;
                        player.rarity = playerData.stats.rarity;
                        console.log(`Updated player ${playerData.key}:`, player);
                    }
                });

                // Clear menu and show lobby
                this.scene.children.removeAll();
                this.scene.showLobby('lobby');
                console.log('Successfully loaded game and transitioned to lobby');

            } catch (error) {
                console.error('Error loading game data:', error);
            }
        } else {
            console.log('No save data available');
        }
    }

    showInstructionsScreen(page = 1) {
        if (this.scene.instructionScreen) {
            this.scene.instructionScreen.show(page);
        }
    }

    addHoverEffect(container) {
        const baseScale = 1;
        const hoverScale = baseScale * 1.1;
        container.on('pointerover', () => {
            this.scene.tweens.add({
                targets: container,
                scaleX: hoverScale,
                scaleY: hoverScale,
                duration: 100
            });
        });
        container.on('pointerout', () => {
            this.scene.tweens.add({
                targets: container,
                scaleX: baseScale,
                scaleY: baseScale,
                duration: 100
            });
        });
    }

    destroy() {
        this.scene.children.removeAll();
    }
}
