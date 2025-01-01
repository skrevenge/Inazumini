class PlayerInfoPanel {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.board = null;
    }

    setup() {
        // Create the player board sprite
        this.board = this.scene.add.image(565, 280, 'PlayerBBoard');
        
        // Create a container for player information
        this.container = this.scene.add.container(565, 280);
        
        // Initialize with current player's information
        this.updateInfo();
        
        // Add name to track this element for cleanup
        this.container.setName('playerInfoContainer');
        this.board.setName('playerBoardSprite');
    }

    updateInfo() {
        if (!this.container) return;

        // Get the selected player's data
        const selectedPlayer = this.scene.playerStats.getPlayerStats(
            this.scene.playerStats.activePlayers[this.scene.selectedPlayerIndex]
        );

        // Get existing sprites
        let portrait = this.container.getByName('playerPortrait');
        let rarityFrame = this.container.getByName('rarityFrame');

        // Update portrait and frame
        if (!portrait) {
            portrait = this.scene.add.sprite(-170, -100, 'raiTeiPortrait', selectedPlayer.portraitFrame);
            portrait.setName('playerPortrait');
            this.container.add(portrait);
        } else {
            portrait.setFrame(selectedPlayer.portraitFrame);
        }

        if (!rarityFrame) {
            rarityFrame = this.scene.add.sprite(-170, -100, 'frameBorder', 
                this.scene.playerStats.getRarityFrame(selectedPlayer.rarity));
            rarityFrame.setName('rarityFrame');
            this.container.add(rarityFrame);
        } else {
            rarityFrame.setFrame(this.scene.playerStats.getRarityFrame(selectedPlayer.rarity));
        }

        // Clean up existing elements
        this.cleanupExistingElements();

        // Add player information
        this.addPlayerBasicInfo(selectedPlayer);
        this.addPlayerStats(selectedPlayer);
        this.addHissatsuSlots(selectedPlayer);
    }

    cleanupExistingElements() {
        const elementNames = [
            'playerName', 'rarityLabel', 'rarityIcon', 'levelText',
            'expText', 'elementLabel', 'elementIcon', 'tpText', 'fpText', 
            'shootText', 'dribbleText', 'strengthText', 'speedText', 'keeperText'
        ];

        // Add hissatsu slot names
        for (let i = 0; i < 6; i++) {
            elementNames.push(`hissatsuSlot${i}`, `hissatsuName${i}`);
        }

        elementNames.forEach(name => {
            const element = this.container.getByName(name);
            if (element) element.destroy();
        });
    }

    addPlayerBasicInfo(player) {
        const fullName = (this.scene.selectedNameStyle === 'dub' && this.scene.currentLanguage === 'en') ?
            player.name : player.undubName;

        // Add name
        const nameText = this.scene.add.bitmapText(-120, -160, 'customFont', fullName, 26);
        nameText.setName('playerName');
        this.container.add(nameText);

        // Add rarity
        const rarityLabel = this.scene.add.bitmapText(80, -160, 'customFont',
            this.scene.localization[this.scene.currentLanguage]['Stats_Rarity'] + ':', 26);
        rarityLabel.setName('rarityLabel');
        this.container.add(rarityLabel);

        const rarityIcon = this.scene.add.sprite(175, -145, 'raritySprite',
            this.scene.playerStats.getRarityFrame(player.rarity));
        rarityIcon.setName('rarityIcon');
        this.container.add(rarityIcon);
    }

    addPlayerStats(player) {
        const stats = [
            { name: 'levelText', x: -120, y: -125, text: `${this.scene.localization[this.scene.currentLanguage]['Stats_Level']}: ${player.level}` },
            { name: 'expText', x: -50, y: -125, text: `${this.scene.localization[this.scene.currentLanguage]['Stats_Exp']}: ${player.exp || 0}/500` },
            { name: 'tpText', x: -120, y: -90, text: `${this.scene.localization[this.scene.currentLanguage]['Stats_TP']}: ${player.TP}` },
            { name: 'fpText', x: 30, y: -90, text: `${this.scene.localization[this.scene.currentLanguage]['Stats_FP']}: ${player.FP}` },
            { name: 'shootText', x: -120, y: -60, text: `${this.scene.localization[this.scene.currentLanguage]['Stats_Shoot']}: ${player.shoot}` },
            { name: 'dribbleText', x: 30, y: -60, text: `${this.scene.localization[this.scene.currentLanguage]['Stats_Dribble']}: ${player.dribble}` },
            { name: 'strengthText', x: -120, y: -30, text: `${this.scene.localization[this.scene.currentLanguage]['Stats_Strength']}: ${player.strength}` },
            { name: 'speedText', x: 30, y: -30, text: `${this.scene.localization[this.scene.currentLanguage]['Stats_Speed']}: ${player.speed}` },
            { name: 'keeperText', x: -120, y: 0, text: `${this.scene.localization[this.scene.currentLanguage]['Stats_Catch']}: ${player.keeper}` }
        ];

        stats.forEach(stat => {
            const text = this.scene.add.bitmapText(stat.x, stat.y, 'customFont', stat.text, 26);
            text.setName(stat.name);
            this.container.add(text);
        });

        // Add element label and icon
        const elementLabel = this.scene.add.bitmapText(80, -125, 'customFont',
            this.scene.localization[this.scene.currentLanguage]['Stats_Element'] + ':', 26);
        elementLabel.setName('elementLabel');
        this.container.add(elementLabel);

        const elementIcon = this.scene.add.sprite(175, -110, 'attributes',
            this.scene.playerStats.getAttributeFrame(player.attribute));
        elementIcon.setName('elementIcon');
        this.container.add(elementIcon);
    }

    addHissatsuSlots(player) {
        const slotStartY = 50;
        const slotSpacingY = 45;
        const leftSlotX = -100;
        const rightSlotX = 100;

        for (let i = 0; i < 6; i++) {
            const isRightSide = i >= 3;
            const slotX = isRightSide ? rightSlotX : leftSlotX;
            const slotY = slotStartY + (i % 3) * slotSpacingY;

            const hissatsuId = player.hissatsu && player.hissatsu[i];
            const hissatsu = hissatsuId ? this.scene.hissatsuDB.getTechnique(hissatsuId) : null;

            this.createHissatsuSlot(slotX, slotY, i, hissatsu);
        }
    }

    createHissatsuSlot(x, y, index, hissatsu) {
        let frame = 0;
        if (hissatsu) {
            const attributeFrames = { 'Fire': 1, 'Earth': 2, 'Wood': 3, 'Wind': 4 };
            frame = attributeFrames[hissatsu.attribute] || 0;
        }

        const slot = this.scene.add.sprite(x, y, 'hissatsuSlot', frame);
        slot.setName(`hissatsuSlot${index}`);
        this.container.add(slot);

        if (hissatsu) {
            this.addHissatsuName(x, y, index, hissatsu);
            this.setupHissatsuInteraction(slot, hissatsu);
        } else {
            slot.setInteractive();
        }
    }

    addHissatsuName(x, y, index, hissatsu) {
        const techName = (this.scene.selectedNameStyle === 'dub' && this.scene.currentLanguage === 'en') ?
            hissatsu.name : (this.scene.currentLanguage === 'en' ? hissatsu.undub_name : hissatsu.loc_name);

        const nameText = this.scene.add.bitmapText(x, y - 2, 'customFont', techName, 20);
        nameText.setOrigin(0.5);
        nameText.setTint(0xFFFFFF);
        nameText.setName(`hissatsuName${index}`);
        this.container.add(nameText);
    }

    setupHissatsuInteraction(slot, hissatsu) {
        slot.setInteractive();
        slot.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            this.closeHissatsuInfo();
            this.showHissatsuInfo(hissatsu);
        });
    }

    showHissatsuInfo(hissatsu) {
        const infoBox = this.scene.add.container(0, -110);
        infoBox.setName('hissatsuInfoBox');

        const bgGraphics = this.scene.add.graphics();
        bgGraphics.setDepth(100);
        bgGraphics.fillStyle(0x000000, 1);
        bgGraphics.fillRoundedRect(-200, -162, 400, 190, 16);
        bgGraphics.setName('hissatsuInfoBg');

        this.container.add(bgGraphics);
        this.container.add(infoBox);

        const portrait = this.scene.add.sprite(-90, 40, 'hissatsuPort', hissatsu.hPortrait);
        infoBox.add(portrait);

        this.addHissatsuStats(infoBox, hissatsu);
        this.addHissatsuStars(infoBox, hissatsu);

        this.scene.input.on('pointerdown', () => this.closeHissatsuInfo());
    }

    addHissatsuStats(infoBox, hissatsu) {
        const techName = (this.scene.selectedNameStyle === 'dub' && this.scene.currentLanguage === 'en') ?
            hissatsu.name : (this.scene.currentLanguage === 'en' ? hissatsu.undub_name : hissatsu.loc_name);

        const stats = [
            techName,
            `${this.scene.localization[this.scene.currentLanguage]['Stats_TP']}: ${hissatsu.tp_cost}`,
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Element']}: ${this.scene.localization[this.scene.currentLanguage][`Attribute_${hissatsu.attribute}`]}`,
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Type']}: ${this.scene.localization[this.scene.currentLanguage][`HissatsuType_${hissatsu.type}`]}`,
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Power']}: ${hissatsu.power}`,
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Rank']}:`
        ];

        stats.forEach((text, index) => {
            const statsText = this.scene.add.bitmapText(20, -30 + (index * 25), 'customFont', text, 22);
            statsText.setTint(0xFFFFFF);
            infoBox.add(statsText);
        });
    }

    addHissatsuStars(infoBox, hissatsu) {
        const starX = 90;
        const starY = 105;
        const starSpacing = 25;

        for (let i = 0; i < hissatsu.starRank; i++) {
            const star = this.scene.add.image(starX + (i * starSpacing), starY, 'starIcon');
            star.setScale(1);
            star.setDepth(101);
            infoBox.add(star);
        }
    }

    closeHissatsuInfo() {
        const infoBox = this.container.getByName('hissatsuInfoBox');
        const bgGraphics = this.container.getByName('hissatsuInfoBg');
        if (infoBox) infoBox.destroy();
        if (bgGraphics) bgGraphics.destroy();
    }

    cleanup() {
        if (this.board) {
            this.board.destroy();
            this.board = null;
        }

        if (this.container) {
            this.container.destroy();
            this.container = null;
        }

        // Remove any remaining listeners
        this.scene.input.off('pointerdown');
    }
}
