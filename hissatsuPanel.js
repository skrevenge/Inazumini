class HissatsuPanel {
    constructor(scene) {
        this.scene = scene;
        this.hissatsuSlots = [];
        this.hissatsuStars = [];
        this.isHissatsuPanelActive = false;
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

        // Create rank text
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

        // Clear existing slots if any
        this.hissatsuSlots.forEach(({ sprite, text, border }) => {
            if (sprite && sprite.active) sprite.destroy();
            if (text && text.active) text.destroy();
            if (border && border.active) border.destroy();
        });
        this.hissatsuSlots = [];

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
            container.add(slot);

            // Create text with proper positioning
            const slotText = this.scene.add.bitmapText(0, 0, 'customFont', '', 20)
                .setOrigin(0.5)
                .setDepth(0.5)
                .setAlpha(0.75);

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

            this.setupSlotInteraction(slot, i);
        }
    }

    setupSlotInteraction(slot, index) {
        slot.on('pointerdown', () => {
            this.handleSlotClick(index);
        });
    }

    handleSlotClick(index) {
        // Deselect all other slots
        this.hissatsuSlots.forEach(slotData => {
            if (slotData.sprite) {
                slotData.selected = false;
                slotData.sprite.setScale(1);
            }
        });

        // Select this slot
        this.hissatsuSlots[index].selected = true;
        this.hissatsuSlots[index].sprite.setScale(1.05);

        // Get player and update display
        const playerKey = this.scene.playerStats.activePlayers[this.scene.selectedPlayer];
        const player = this.scene.playerStats.getPlayerStats(playerKey);

        if (player?.hissatsu?.[index]) {
            this.updateHissatsuDisplay(player.hissatsu[index]);
        } else {
            this.hideHissatsuDisplay();
        }
    }

    updateHissatsuDisplay(hissatsuId) {
        const technique = this.scene.hissatsuTechniques[hissatsuId];
        if (!technique) return;

        // Show and update portrait
        this.hissatsuPortraitDisplay.setFrame(technique.hPortrait);
        this.hissatsuPortraitDisplay.setVisible(true);
        this.hissatsuPortraitDisplay.setAlpha(1);

        // Get display name based on language settings
        let displayName;
        if (this.scene.currentLanguage === 'pt-br') {
            displayName = technique.loc_name;
        } else if (this.scene.selectedNameStyle === 'dub') {
            displayName = technique.name;
        } else {
            displayName = technique.undub_name;
        }

        // Update text displays
        this.hissatsuNameText.setText(displayName);
        this.hissatsuPowerText.setText(`Power: ${technique.power}`);
        this.hissatsuTPText.setText(`TP Cost: ${technique.tp_cost}`);
        this.hissatsuTypeText.setText(`Type: ${technique.type}`);
        this.hissatsuAttributeText.setText('Attribute:');

        // Update attribute icon
        const attributeFrames = { 'Fire': 0, 'Earth': 1, 'Wood': 2, 'Wind': 3 };
        this.hissatsuAttributeIcon.setFrame(attributeFrames[technique.attribute] || 0);

        // Update stars
        this.updateStars(technique.starRank);

        // Show all elements
        this.showAllElements();
    }

    updateStars(starRank) {
        // Clear existing stars
        this.hissatsuStars.forEach(star => star.destroy());
        this.hissatsuStars = [];

        // Create new stars
        const baseX = 475;
        const startY = 190;
        for (let s = starRank - 1; s >= 0; s--) {
            const star = this.scene.add.image(baseX + 260 + (s * 10), startY + 90, 'starIcon');
            star.setDepth(2.5 + (starRank - s));
            this.hissatsuStars.push(star);
        }
    }

    showAllElements() {
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
                element.setVisible(true);
                element.setDepth(2.5);
                element.setAlpha(1);
            }
        });
    }

    hideHissatsuDisplay() {
        this.hissatsuPortraitDisplay.setVisible(false);
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

        // Clear stars
        this.hissatsuStars.forEach(star => star.destroy());
        this.hissatsuStars = [];
    }

    updateHissatsuSlots() {
        const playerKey = this.scene.playerStats.activePlayers[this.scene.selectedPlayer];
        if (!playerKey) return;

        const player = this.scene.playerStats.getPlayerStats(playerKey);
        if (!player?.hissatsu) return;

        this.hissatsuSlots.forEach(({ sprite, text, container }, index) => {
            if (!sprite?.active) return;

            if (container) container.setVisible(true);
            sprite.setVisible(true);

            if (index < player.hissatsu.length) {
                const hissatsuId = player.hissatsu[index];
                const technique = this.scene.hissatsuTechniques[hissatsuId];

                if (technique) {
                    const attributeFrames = { 'Fire': 1, 'Earth': 2, 'Wood': 3, 'Wind': 4 };
                    sprite.setFrame(attributeFrames[technique.attribute] || 0);
                    sprite.setVisible(true);
                    container.setVisible(true);
                    sprite.setScale(1);
                    sprite.setAlpha(0.75);
                    container.setAlpha(1);

                    if (text?.active) {
                        const name = this.scene.currentLanguage === 'pt-br' ? technique.loc_name :
                            this.scene.selectedNameStyle === 'dub' ? technique.name : technique.undub_name;
                        text.setText(name || ' ');
                    }
                } else {
                    sprite.setFrame(0);
                    if (text?.active) text.setText(' ');
                }
            } else {
                sprite.setFrame(0);
                if (text?.active) text.setText(' ');
            }
        });
    }

    cleanup() {
        // Destroy all hissatsu slots
        this.hissatsuSlots.forEach(({ sprite, text, container }) => {
            if (sprite) sprite.destroy();
            if (text) text.destroy();
            if (container) container.destroy();
        });
        this.hissatsuSlots = [];

        // Destroy all stars
        this.hissatsuStars.forEach(star => star.destroy());
        this.hissatsuStars = [];

        // Destroy all display elements
        [
            this.hissatsuPortraitDisplay,
            this.hissatsuNameText,
            this.hissatsuPowerText,
            this.hissatsuTPText,
            this.hissatsuTypeText,
            this.hissatsuAttributeText,
            this.hissatsuAttributeIcon,
            this.hissatsuRankText
        ].forEach(element => {
            if (element) element.destroy();
        });
    }
}
