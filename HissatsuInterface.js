class HissatsuInterface {
    constructor(scene) {
        this.scene = scene;
        this.slots = [];
        this.stars = [];
        this.slotConfig = {
            spacing: 50,
            startY: 330,
            leftX: 535,
            rightX: 725
        };
        this.isHissatsuPanelActive = false;
        this.initialize();
    }

    initialize() {
        this.setupDisplayElements();
        this.createSlots();
    }

    setupDisplayElements() {
        const baseX = 475;
        const startY = 190;

        // Create Hissatsu portrait and info display
        this.portraitDisplay = this.scene.add.sprite(baseX - 80, startY, 'hissatsuPortrait', 0)
            .setOrigin(0, 0)
            .setVisible(false)
            .setDepth(2.5);

        // Create text elements for Hissatsu info
        this.nameText = this.scene.add.bitmapText(baseX + 110, startY, 'customFont', '', 24)
            .setOrigin(0, 0);
        this.powerText = this.scene.add.bitmapText(baseX + 110, startY + 26, 'customFont', '', 22)
            .setOrigin(0, 0);
        this.tpText = this.scene.add.bitmapText(baseX + 110, startY + 52, 'customFont', '', 22)
            .setOrigin(0, 0);
        this.typeText = this.scene.add.bitmapText(baseX + 205, startY + 52, 'customFont', '', 22)
            .setOrigin(0, 0);

        // Create attribute icon and text
        this.attributeText = this.scene.add.bitmapText(baseX + 110, startY + 77, 'customFont', 'Attribute:', 22)
            .setOrigin(0, 0);
        this.attributeIcon = this.scene.add.sprite(baseX + 190, startY + 90, 'attributes', 0)
            .setScale(0.8);

        // Create rank text
        this.rankText = this.scene.add.bitmapText(baseX + 205, startY + 77, 'customFont', 'Rank:', 22)
            .setOrigin(0, 0);

        // Set initial visibility for all elements
        this.getAllElements().forEach(element => {
            if (element) {
                element.setVisible(false);
                element.setDepth(2.5);
            }
        });
    }

    createSlots() {
        this.clearExistingSlots();

        for (let i = 0; i < 6; i++) {
            const slotPosition = this.calculateSlotPosition(i);
            const slotComponents = this.createSlotComponents(slotPosition.x, slotPosition.y);
            this.setupSlotInteraction(slotComponents, i);
            this.slots.push({
                ...slotComponents,
                selected: false,
                index: i
            });
        }
    }

    clearExistingSlots() {
        if (this.slots.length > 0) {
            this.slots.forEach(({ sprite, text, border }) => {
                if (sprite && sprite.active) sprite.destroy();
                if (text && text.active) text.destroy();
                if (border && border.active) border.destroy();
            });
            this.slots = [];
        }
    }

    calculateSlotPosition(index) {
        const isRightSlot = index % 2 === 1;
        const pairIndex = Math.floor(index / 2);
        return {
            x: isRightSlot ? this.slotConfig.rightX : this.slotConfig.leftX,
            y: this.slotConfig.startY + pairIndex * this.slotConfig.spacing
        };
    }

    createSlotComponents(x, y) {
        const slot = this.scene.add.sprite(0, 0, 'hissatsuButton')
            .setOrigin(0.5)
            .setScale(1)
            .setDepth(0.5)
            .setAlpha(0.75);

        const container = this.scene.add.container(x - 50, y)
            .setDepth(0.5);

        const slotText = this.scene.add.bitmapText(0, 0, 'customFont', '', 20)
            .setOrigin(0.5)
            .setDepth(0.5)
            .setAlpha(0.75);

        container.add([slot, slotText]);
        [slot, container, slotText].forEach(element => element.setVisible(true));

        if (this.isHissatsuPanelActive) {
            slot.setInteractive({ useHandCursor: true });
        }

        return { sprite: slot, text: slotText, container };
    }

    setupSlotInteraction(slotComponents, slotIndex) {
        const { sprite: slot } = slotComponents;
        
        slot.on('pointerdown', () => {
            this.handleSlotSelection(slotIndex);
            this.updateDisplay(slotIndex);
        });
    }

    handleSlotSelection(selectedIndex) {
        this.slots.forEach(slotData => {
            if (slotData.sprite) {
                slotData.selected = false;
                slotData.sprite.setScale(1);
            }
        });
        this.slots[selectedIndex].selected = true;
        this.slots[selectedIndex].sprite.setScale(1.05);
    }

    updateDisplay(slotIndex) {
        const playerKey = this.scene.playerStats.activePlayers[this.scene.selectedPlayer];
        const player = this.scene.playerStats.getPlayerStats(playerKey);
        
        if (player?.hissatsu?.[slotIndex]) {
            this.showInfo(player.hissatsu[slotIndex]);
        } else {
            this.hideInfo();
        }
    }

    showInfo(hissatsuId) {
        const technique = this.scene.hissatsuTechniques[hissatsuId];
        if (!technique) return;

        this.updatePortrait(technique);
        this.updateTexts(technique);
        this.updateAttributes(technique);
        this.updateStars(technique);

        this.getAllElements().forEach(element => {
            if (element) {
                element.setVisible(true);
                element.setDepth(2.5);
                element.setAlpha(1);
            }
        });
    }

    updatePortrait(technique) {
        this.portraitDisplay.setFrame(technique.hPortrait);
        this.portraitDisplay.setVisible(true);
        this.portraitDisplay.setAlpha(1);
    }

    updateTexts(technique) {
        this.nameText.setText(this.getDisplayName(technique));
        this.powerText.setText(`Power: ${technique.power}`);
        this.tpText.setText(`TP Cost: ${technique.tp_cost}`);
        this.typeText.setText(`Type: ${technique.type}`);
        this.attributeText.setText('Attribute:');
    }

    getDisplayName(technique) {
        if (this.scene.currentLanguage === 'pt-br') return technique.loc_name;
        return this.scene.selectedNameStyle === 'dub' ? technique.name : technique.undub_name;
    }

    updateAttributes(technique) {
        const attributeFrames = {
            'Fire': 0,
            'Earth': 1,
            'Wood': 2,
            'Wind': 3
        };
        this.attributeIcon.setFrame(attributeFrames[technique.attribute] || 0);
    }

    updateStars(technique) {
        this.clearStars();
        const baseX = 475;
        const startY = 190;

        for (let s = technique.starRank - 1; s >= 0; s--) {
            const star = this.scene.add.image(baseX + 260 + (s * 10), startY + 90, 'starIcon');
            star.setDepth(2.5 + (technique.starRank - s));
            this.stars.push(star);
        }
    }

    clearStars() {
        this.stars?.forEach(star => star.destroy());
        this.stars = [];
    }

    hideInfo() {
        this.portraitDisplay.setVisible(false);
        this.getAllElements().forEach(element => element?.setVisible(false));
        this.clearStars();
    }

    getAllElements() {
        return [
            this.nameText,
            this.powerText,
            this.tpText,
            this.typeText,
            this.attributeText,
            this.attributeIcon,
            this.rankText
        ];
    }

    updateAllSlots(player) {
        this.slots.forEach(({ sprite, text, container }, index) => {
            if (!sprite?.active) return;

            this.updateSlotVisibility(sprite, container);
            if (index < player.hissatsu.length) {
                this.updateSlotContent(sprite, text, player.hissatsu[index]);
            } else {
                this.clearSlot(sprite, text);
            }
        });
    }

    updateSlotVisibility(sprite, container) {
        if (container) container.setVisible(true);
        sprite.setVisible(true);
    }

    updateSlotContent(sprite, text, hissatsuId) {
        const technique = this.scene.hissatsuTechniques[hissatsuId];
        if (!technique) {
            this.clearSlot(sprite, text);
            return;
        }

        const frame = this.getAttributeFrame(technique.attribute);
        sprite.setFrame(frame);
        sprite.setVisible(true);
        sprite.setScale(1);
        sprite.setAlpha(0.75);

        if (text?.active) {
            text.setText(this.getDisplayName(technique));
        }
    }

    getAttributeFrame(attribute) {
        const frames = {
            'Fire': 1,
            'Earth': 2,
            'Wood': 3,
            'Wind': 4
        };
        return frames[attribute] || 0;
    }

    clearSlot(sprite, text) {
        sprite.setFrame(0);
        if (text?.active) text.setText(' ');
    }

    destroy() {
        this.clearExistingSlots();
        this.clearStars();
        this.getAllElements().forEach(element => {
            if (element) element.destroy();
        });
        if (this.portraitDisplay) this.portraitDisplay.destroy();
    }
}
