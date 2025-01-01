class PlayerInfoPanel {
    constructor(scene) {
        this.scene = scene;
        this.playerInfoContainer = null;
    }

    setupPlayerInfoMask() {
        // Create the player board sprite
        const playerBoard = this.scene.add.image(565, 280, 'PlayerBBoard');

        // Create a container for player information
        this.playerInfoContainer = this.scene.add.container(565, 280);

        // Initialize with current player's information
        this.updatePlayerInfo();

        // Add name to track this element for cleanup
        this.playerInfoContainer.setName('playerInfoContainer');
        playerBoard.setName('playerBoardSprite');
    }

    updatePlayerInfo() {
        if (!this.playerInfoContainer) return;

        // Get the selected player's data
        const selectedPlayer = this.scene.playerStats.getPlayerStats(this.scene.playerStats.activePlayers[this.scene.selectedPlayerIndex]);

        // Get existing sprites
        let portrait = this.playerInfoContainer.getByName('playerPortrait');
        let rarityFrame = this.playerInfoContainer.getByName('rarityFrame');

        // Update portrait and frame
        if (!portrait) {
            portrait = this.scene.add.sprite(-170, -100, 'raiTeiPortrait', selectedPlayer.portraitFrame);
            portrait.setName('playerPortrait');
            this.playerInfoContainer.add(portrait);
        } else {
            portrait.setFrame(selectedPlayer.portraitFrame);
        }

        if (!rarityFrame) {
            rarityFrame = this.scene.add.sprite(-170, -100, 'frameBorder', this.scene.playerStats.getRarityFrame(selectedPlayer.rarity));
            rarityFrame.setName('rarityFrame');
            this.playerInfoContainer.add(rarityFrame);
        } else {
            rarityFrame.setFrame(this.scene.playerStats.getRarityFrame(selectedPlayer.rarity));
        }

        // Clean up existing text and icons
        const existingElements = ['playerName', 'rarityLabel', 'rarityIcon', 'levelText',
            'expText', 'elementLabel', 'elementIcon', 'tpText', 'fpText', 'shootText',
            'dribbleText', 'strengthText', 'speedText', 'keeperText',
            'hissatsuSlot0', 'hissatsuSlot1', 'hissatsuSlot2',
            'hissatsuSlot3', 'hissatsuSlot4', 'hissatsuSlot5',
            'hissatsuName0', 'hissatsuName1', 'hissatsuName2',
            'hissatsuName3', 'hissatsuName4', 'hissatsuName5'
        ];
        existingElements.forEach(name => {
            const element = this.playerInfoContainer.getByName(name);
            if (element) element.destroy();
        });

        // Line 1: Player Name and Rarity Icon
        const fullName = (this.scene.selectedNameStyle === 'dub' && this.scene.currentLanguage === 'en') ?
            selectedPlayer.name : selectedPlayer.undubName;
        const nameText = this.scene.add.bitmapText(-120, -160, 'customFont', fullName, 26);
        nameText.setName('playerName');
        this.playerInfoContainer.add(nameText);

        // Line 2: Rarity label and icon (fixed positions)
        const rarityLabel = this.scene.add.bitmapText(80, -160, 'customFont',
            this.scene.localization[this.scene.currentLanguage]['Stats_Rarity'] + ':', 26);
        rarityLabel.setName('rarityLabel');
        this.playerInfoContainer.add(rarityLabel);

        const rarityIcon = this.scene.add.sprite(175, -145, 'raritySprite',
            this.scene.playerStats.getRarityFrame(selectedPlayer.rarity));
        rarityIcon.setName('rarityIcon');
        this.playerInfoContainer.add(rarityIcon);

        // Line 3: Level and Experience
        const levelLabel = this.scene.add.bitmapText(-120, -125, 'customFont',
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Level']}: ${selectedPlayer.level}`, 26);
        levelLabel.setName('levelText');
        this.playerInfoContainer.add(levelLabel);

        const currentExp = selectedPlayer.exp || 0;
        const expForNextLevel = 500;
        const expText = this.scene.add.bitmapText(-50, -125, 'customFont',
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Exp']}: ${currentExp}/${expForNextLevel}`, 26);
        expText.setName('expText');
        this.playerInfoContainer.add(expText);

        // Line 4: Element label and icon (fixed positions)
        const elementLabel = this.scene.add.bitmapText(80, -125, 'customFont',
            this.scene.localization[this.scene.currentLanguage]['Stats_Element'] + ':', 26);
        elementLabel.setName('elementLabel');
        this.playerInfoContainer.add(elementLabel);

        const elementIcon = this.scene.add.sprite(175, -110, 'attributes',
            this.scene.playerStats.getAttributeFrame(selectedPlayer.attribute));
        elementIcon.setName('elementIcon');
        this.playerInfoContainer.add(elementIcon);

        // Line 3: TP and FP
        const tpText = this.scene.add.bitmapText(-120, -90, 'customFont',
            `${this.scene.localization[this.scene.currentLanguage]['Stats_TP']}: ${selectedPlayer.TP}`, 26);
        tpText.setName('tpText');
        this.playerInfoContainer.add(tpText);

        const fpText = this.scene.add.bitmapText(30, -90, 'customFont',
            `${this.scene.localization[this.scene.currentLanguage]['Stats_FP']}: ${selectedPlayer.FP}`, 26);
        fpText.setName('fpText');
        this.playerInfoContainer.add(fpText);

        // Line 4: Shoot and Dribble
        const shootText = this.scene.add.bitmapText(-120, -60, 'customFont',
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Shoot']}: ${selectedPlayer.shoot}`, 26);
        shootText.setName('shootText');
        this.playerInfoContainer.add(shootText);

        const dribbleText = this.scene.add.bitmapText(30, -60, 'customFont',
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Dribble']}: ${selectedPlayer.dribble}`, 26);
        dribbleText.setName('dribbleText');
        this.playerInfoContainer.add(dribbleText);

        // Line 5: Strength and Speed
        const strengthText = this.scene.add.bitmapText(-120, -30, 'customFont',
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Strength']}: ${selectedPlayer.strength}`, 26);
        strengthText.setName('strengthText');
        this.playerInfoContainer.add(strengthText);

        const speedText = this.scene.add.bitmapText(30, -30, 'customFont',
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Speed']}: ${selectedPlayer.speed}`, 26);
        speedText.setName('speedText');
        this.playerInfoContainer.add(speedText);

        // Line 6: Keeper
        const keeperText = this.scene.add.bitmapText(-120, 0, 'customFont',
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Catch']}: ${selectedPlayer.keeper}`, 26);
        keeperText.setName('keeperText');
        this.playerInfoContainer.add(keeperText);

        // Add Hissatsu slots
        const slotStartY = 50;
        const slotSpacingY = 45;
        const leftSlotX = -100;
        const rightSlotX = 100;

        // Clean up existing hissatsu slots
        for (let i = 0; i < 6; i++) {
            const existingSlot = this.playerInfoContainer.getByName(`hissatsuSlot${i}`);
            if (existingSlot) existingSlot.destroy();
        }

        // Create new slots
        for (let i = 0; i < 6; i++) {
            const isRightSide = i >= 3;
            const slotX = isRightSide ? rightSlotX : leftSlotX;
            const slotY = slotStartY + (i % 3) * slotSpacingY;

            const hissatsuId = selectedPlayer.hissatsu && selectedPlayer.hissatsu[i];
            const hissatsu = hissatsuId ? this.scene.hissatsuDB.getTechnique(hissatsuId) : null;

            let frame = 0;
            if (hissatsu) {
                switch (hissatsu.attribute) {
                    case 'Fire': frame = 1; break;
                    case 'Earth': frame = 2; break;
                    case 'Wood': frame = 3; break;
                    case 'Wind': frame = 4; break;
                }
            }

            const slot = this.scene.add.sprite(slotX, slotY, 'hissatsuSlot', frame);
            slot.setName(`hissatsuSlot${i}`);
            this.playerInfoContainer.add(slot);

            if (hissatsu) {
                const techName = (this.scene.selectedNameStyle === 'dub' && this.scene.currentLanguage === 'en') ?
                    hissatsu.name : (this.scene.currentLanguage === 'en' ? hissatsu.undub_name : hissatsu.loc_name);
                const nameText = this.scene.add.bitmapText(slotX, slotY - 2, 'customFont', techName, 20);
                nameText.setOrigin(0.5);
                nameText.setTint(0xFFFFFF);
                nameText.setName(`hissatsuName${i}`);
                this.playerInfoContainer.add(nameText);

                slot.setInteractive();
                slot.on('pointerdown', (pointer, localX, localY, event) => {
                    event.stopPropagation();
                    this.closeHissatsuInfoBox();
                    this.showHissatsuInfoBox(hissatsu);
                });
            } else {
                slot.setInteractive();
            }
        }
    }

    showHissatsuInfoBox(hissatsu) {
        const infoBox = this.scene.add.container(0, -110);
        infoBox.setName('hissatsuInfoBox');

        const bgGraphics = this.scene.add.graphics();
        bgGraphics.setDepth(100);
        bgGraphics.fillStyle(0x000000, 1);
        bgGraphics.fillRoundedRect(-200, -162, 400, 190, 16);
        bgGraphics.setName('hissatsuInfoBg');
        this.playerInfoContainer.add(bgGraphics);
        this.playerInfoContainer.add(infoBox);

        const portrait = this.scene.add.sprite(-90, 40, 'hissatsuPort', hissatsu.hPortrait);
        infoBox.add(portrait);

        const techNameFull = (this.scene.selectedNameStyle === 'dub' && this.scene.currentLanguage === 'en') ?
            hissatsu.name : (this.scene.currentLanguage === 'en' ? hissatsu.undub_name : hissatsu.loc_name);

        const statsTexts = [
            techNameFull,
            `${this.scene.localization[this.scene.currentLanguage]['Stats_TP']}: ${hissatsu.tp_cost}`,
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Element']}: ${this.scene.localization[this.scene.currentLanguage][`Attribute_${hissatsu.attribute}`]}`,
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Type']}: ${this.scene.localization[this.scene.currentLanguage][`HissatsuType_${hissatsu.type}`]}`,
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Power']}: ${hissatsu.power}`,
            `${this.scene.localization[this.scene.currentLanguage]['Stats_Rank']}:`
        ];

        statsTexts.forEach((text, index) => {
            const statsText = this.scene.add.bitmapText(20, -30 + (index * 25), 'customFont', text, 22);
            statsText.setTint(0xFFFFFF);
            infoBox.add(statsText);
        });

        const starX = 90;
        const starY = 105;
        const starSpacing = 25;

        for (let i = 0; i < hissatsu.starRank; i++) {
            const star = this.scene.add.image(starX + (i * starSpacing), starY, 'starIcon');
            star.setScale(1);
            star.setDepth(101);
            infoBox.add(star);
        }

        const closeInfoBox = () => {
            this.closeHissatsuInfoBox();
            this.scene.input.off('pointerdown', closeInfoBox);
        };

        this.scene.input.on('pointerdown', closeInfoBox);
    }

    closeHissatsuInfoBox() {
        const infoBox = this.playerInfoContainer.getByName('hissatsuInfoBox');
        const bgGraphics = this.playerInfoContainer.getByName('hissatsuInfoBg');
        if (infoBox) infoBox.destroy();
        if (bgGraphics) bgGraphics.destroy();
    }

    cleanup() {
        const playerBoard = this.scene.children.getByName('playerBoardSprite');
        const infoContainer = this.scene.children.getByName('playerInfoContainer');
        const portrait = this.scene.children.getByName('playerPortrait');
        const rarityFrame = this.scene.children.getByName('rarityFrame');

        if (playerBoard) {
            playerBoard.destroy();
        }

        if (infoContainer) {
            infoContainer.destroy();
        }

        this.playerInfoContainer = null;

        if (this.scene.getCurrentScreen() === 'formation') {
            this.updatePlayerInfo();
        }
    }
}

// Export the class
export default PlayerInfoPanel;
