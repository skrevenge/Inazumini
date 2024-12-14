class LobbyInterface {
    constructor(scene) {
        this.scene = scene;
        this.currentScreen = 'lobby';
        this.fullScreenInteractive = null;
        this.lobbyBg = null;
        this.lobbyHeader = null;
        this.leftSideBt = null;
        this.centerBt = null;
        this.rightSideBt = null;
        this.leftText = null;
        this.centerText = null;
        this.rightText = null;
        this.messageText = null;
    }

    create(activeScreen = 'lobby') {
        this.currentScreen = activeScreen;
        this.createBackground();
        this.createHeader();
        this.createButtons();
        this.createMessageText();
        this.updateLobbyScreen(this.currentScreen);
    }

    createBackground() {
        // Clear any existing background
        if (this.lobbyBg) {
            this.lobbyBg.destroy();
        }
        
        // Create static lobby background
        this.lobbyBg = this.scene.add.image(400, 300, 'LobbyBackG')
            .setOrigin(0.5)
            .setDepth(0)
            .setDisplaySize(800, 600);
        
    createHeader() {
        const headerKey = this.scene.currentLanguage === 'en' ? 'lobbyHeader' : 'lobbyHeaderLoc';
        this.lobbyHeader = this.scene.add.sprite(400, 50, headerKey);
        this.lobbyHeader.setOrigin(0.5);
    }

    createButtons() {
        // Left button (Inventory)
        this.leftSideBt = this.scene.add.image(0, 600, 'sideBt');
        this.leftSideBt.setOrigin(0, 1).setFlipX(true).setInteractive();
        this.leftText = this.scene.add.text(10, 585, this.scene.localization[this.scene.currentLanguage]['LobbyButton_Inventory'], {
            fontSize: '34px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0, 1);

        // Center button (Play)
        this.centerBt = this.scene.add.image(400, 600, 'centerBt');
        this.centerBt.setOrigin(0.5, 1).setInteractive();
        this.centerText = this.scene.add.text(400, 585, this.scene.localization[this.scene.currentLanguage]['LobbyButton_Play'], {
            fontSize: '40px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5, 1);

        // Right button (Formation)
        this.rightSideBt = this.scene.add.image(800, 600, 'sideBt');
        this.rightSideBt.setOrigin(1, 1).setInteractive();
        this.rightText = this.scene.add.text(790, 585, this.scene.localization[this.scene.currentLanguage]['LobbyButton_Formation'], {
            fontSize: '34px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(1, 1);

        // Add click events
        this.leftSideBt.on('pointerdown', () => this.updateLobbyScreen('inventory'));
        this.centerBt.on('pointerdown', () => this.updateLobbyScreen('play'));
        this.rightSideBt.on('pointerdown', () => this.updateLobbyScreen('formation'));
    }

    createMessageText() {
        this.messageText = this.scene.add.bitmapText(400, 150, 'customFont', '', 24)
            .setOrigin(1)
            .setTint(0xffffff);
    }


    updateLobbyScreen(screen) {
        if (screen === this.currentScreen && screen !== 'lobby') {
            screen = 'lobby';
        }
        this.currentScreen = screen;

        this.scene.children.getAll().forEach(child => {
            if (![this.fullScreenInteractive, this.lobbyBg, this.leftSideBt, this.centerBt, this.rightSideBt,
                 this.leftText, this.centerText, this.rightText, this.messageText, this.lobbyHeader].includes(child)) {
                child.destroy();
            }
        });

        [this.leftSideBt, this.centerBt, this.rightSideBt].forEach(btn => btn.clearTint());

        switch (screen) {
            case 'inventory':
                this.leftSideBt.setTint(0x808080);
                this.scene.showInventoryScreen();
                break;
            case 'play':
                this.centerBt.setTint(0x808080);
                this.scene.showPlayScreen();
                break;
            case 'formation':
                this.rightSideBt.setTint(0x808080);
                this.scene.showFormationScreen();
                break;
            case 'lobby':
                this.showPlayerBlocks();
                break;
            default:
                this.messageText.setText('');
                break;
        }

        this.updateHeaderFrame(screen);
    }

    updateHeaderFrame(screen) {
        switch (screen) {
            case 'lobby':
                this.lobbyHeader.setFrame(0);
                break;
            case 'play':
                this.lobbyHeader.setFrame(1);
                break;
            case 'inventory':
                this.lobbyHeader.setFrame(2);
                break;
            case 'formation':
                this.lobbyHeader.setFrame(3);
                break;
        }
    }

    showPlayerBlocks() {
        const portraitWidth = 64;
        const portraitHeight = 64;
        const portraitSpacing = 60;
        const portraitStartX = (800 - (6 * portraitWidth + 5 * portraitSpacing)) / 2;
        const portraitY = 100;
        const blockWidth = 64;
        const blockY = 400;

        const teamBlockBg = this.scene.add.image(400, 290, 'lobbyTeamBlock');
        teamBlockBg.setOrigin(0.5);
        teamBlockBg.setDepth(1);

        const activePlayers = this.scene.playerStats.activePlayers || this.scene.playerStats.getAllPlayers().slice(0, 6);
        activePlayers.forEach((playerKey, index) => {
            const portraitX = portraitStartX + index * (portraitWidth + portraitSpacing);
            const blockX = portraitX + portraitWidth / 2 - blockWidth / 2;
            const playerData = this.scene.playerStats.getPlayerStats(playerKey);
            if (playerData) {
                this.addPlayerPortrait(playerData, portraitX, portraitY, portraitWidth, portraitHeight);
                this.addPlayerBlock(playerData, blockX, blockY, blockWidth);
                this.addPlayerInfo(playerData, blockX, blockY, blockWidth);
            }
        });
    }

    addPlayerPortrait(playerData, portraitX, portraitY, portraitWidth, portraitHeight) {
        const portrait = this.scene.add.image(portraitX + portraitWidth / 2, portraitY + 100, 'raiTeiPortrait', playerData.portraitFrame);
        portrait.setOrigin(0.5, 0).setDisplaySize(portraitWidth, portraitHeight).setDepth(2);

        const borderFrame = this.scene.getRarityFrame(playerData.rarity);
        const portraitBorder = this.scene.add.image(portraitX + portraitWidth / 2, portraitY + 100, 'frameBorder', borderFrame);
        portraitBorder.setOrigin(0.5, 0).setDisplaySize(portraitWidth + 6, portraitHeight + 6).setDepth(2);
    }

    addPlayerBlock(playerData, blockX, blockY, blockWidth) {
        const block = this.scene.add.image(blockX + 19, blockY + 50, 'block');
        block.setOrigin(0, 0).setDepth(2);

        const body = this.scene.add.image(blockX + blockWidth / 2, blockY + 60, 'raimonBody', 0);
        body.setOrigin(0.5, 1).setDepth(3);

        if (playerData.headSpriteConfig) {
            const head = this.scene.add.image(blockX + blockWidth / 2 - 0.5, blockY + 60 - body.height + 9, playerData.headSpriteConfig.key, playerData.headSpriteConfig.frames.front);
            head.setOrigin(0.5, 0.5).setDepth(4);
        }
    }

    addPlayerInfo(playerData, blockX, blockY, blockWidth) {
        const fullName = (this.scene.selectedNameStyle === 'dub' && this.scene.currentLanguage === 'en') ? playerData.name : playerData.undubName;
        const displayName = (this.scene.selectedNameStyle === 'dub' && this.scene.currentLanguage === 'en') ?
            fullName.split(' ')[0] : fullName.split(' ').pop();

        const currentExp = playerData.exp || 0;
        const expForNextLevel = 500;
        const infoY = blockY - 110;
        const infoX = blockX + blockWidth / 2;

        this.addText(infoX, infoY, displayName, '20px');
        this.addText(infoX, infoY + 25, `Lv.${playerData.level}`, '20px');

        const rarityFrame = this.scene.getRarityFrame(playerData.rarity);
        const raritySprite = this.scene.add.image(infoX, infoY + 50, 'raritySprite', rarityFrame);
        raritySprite.setOrigin(0.5, 0).setDepth(5);

        const attributeFrame = this.scene.getAttributeFrame(playerData.attribute);
        const attributeSprite = this.scene.add.image(infoX, infoY + 85, 'attributes', attributeFrame);
        attributeSprite.setOrigin(0.5, 0).setDepth(5).setScale(0.8);

        this.addText(infoX, infoY + 115, `Exp: ${currentExp}/${expForNextLevel}`, '14px');
    }

    addText(x, y, text, fontSize) {
        // Convert fontSize to a number
        const size = parseInt(fontSize);
        
        // Create the main text
        const mainText = this.scene.add.bitmapText(x, y, 'customFont', text, size)
            .setOrigin(0.5, 0)
            .setDepth(5)
            .setTint(0xffffff);  // White color
        
        // Create a shadow text for better visibility
        const shadowText = this.scene.add.bitmapText(x + 2, y + 2, 'customFont', text, size)
            .setOrigin(0.5, 0)
            .setDepth(4)
            .setTint(0x000000)  // Black color
            .setAlpha(0.6);     // Semi-transparent
        
        // Return an object containing both text objects
        return { mainText, shadowText };
    }
}
