class TeamCardsManager {
    constructor(scene) {
        this.scene = scene;
        this.playScreenContainer = null;
        this.scrollableContainer = null;
        this.teamCards = [];
        this.selectionBorder = null;
        this.selectionBorderContainer = null;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
    }

    createContainers() {
        // Create main container
        this.playScreenContainer = this.scene.add.container(0, 0);

        // Create and setup mask
        const maskGraphics = this.scene.add.graphics();
        maskGraphics.fillStyle(0xffffff, 0);
        maskGraphics.fillRect(0, 90, 800, 380);

        // Create the mask
        const mask = new Phaser.Display.Masks.GeometryMask(this.scene, maskGraphics);

        // Create and setup scrollable container
        this.scrollableContainer = this.scene.add.container(0, 100);
        this.scrollableContainer.setMask(mask);

        // Add containers to main container
        this.playScreenContainer.add([
            maskGraphics,
            this.scrollableContainer
        ]);

        // Create team cards
        this.createTeamCards();
        // Setup scrolling
        this.setupScrolling();
    }

    createTeamCards() {
        const rivalTeams = this.scene.rivalTeamsManager.getAllTeams();
        let xOffset = 400;
        this.teamCards = [];

        rivalTeams.forEach((team, index) => {
            const rivalTeamCard = this.createRivalTeamCard(team);
            rivalTeamCard.x = xOffset;
            this.scrollableContainer.add(rivalTeamCard);
            this.teamCards.push(rivalTeamCard);
            xOffset += 450;
        });

        // Create selection border
        this.selectionBorder = this.scene.add.graphics();
        this.selectionBorder.lineStyle(4, 0xffff00);
        this.selectionBorder.strokeRoundedRect(-205, -175, 410, 350, 15);
        this.selectionBorder.setVisible(false);

        // Create border container
        this.selectionBorderContainer = this.scene.add.container(0, 190);
        this.selectionBorderContainer.add(this.selectionBorder);
        this.scrollableContainer.add(this.selectionBorderContainer);

        // Animate border
        this.scene.tweens.add({
            targets: this.selectionBorder,
            alpha: {
                from: 1,
                to: 0.3
            },
            yoyo: true,
            repeat: -1,
            duration: 500
        });

        this.updateSelectionBorder();
    }

    createRivalTeamCard(teamData) {
        const rivalTeamCard = this.scene.add.container(0, 190);
        const cardBackground = this.createCardBackground();
        rivalTeamCard.add(cardBackground);

        this.addRivalPlayers(rivalTeamCard, teamData.players);

        const teamName = this.scene.add.bitmapText(0, -140, 'customFont', teamData.teamName, 32)
            .setOrigin(0.5);
        rivalTeamCard.add(teamName);

        const formationText = this.scene.add.bitmapText(0, 140, 'customFont',
            `${this.scene.localization[this.scene.currentLanguage]['LobbyButton_Formation']}: ${teamData.formation}`, 32)
            .setOrigin(0.5);
        rivalTeamCard.add(formationText);

        return rivalTeamCard;
    }

    createCardBackground() {
        const cardBackground = this.scene.add.graphics();
        cardBackground.fillStyle(0x81DAFE, 0.75);
        cardBackground.lineStyle(2, 0x000000, 1);
        cardBackground.fillRoundedRect(-200, -170, 400, 340, 15);
        cardBackground.strokeRoundedRect(-200, -170, 400, 340, 15);
        return cardBackground;
    }

    addRivalPlayers(teamCard, players) {
        players.forEach((player, index) => {
            const playerContainer = this.scene.rivalTeamsManager.createPlayerContainer(player, index);
            playerContainer.y += 10;
            teamCard.add(playerContainer);
        });
    }

    setupScrolling() {
        this.scene.input.on('pointerdown', this.startDrag, this);
        this.scene.input.on('pointermove', this.doDrag, this);
        this.scene.input.on('pointerup', this.stopDrag, this);
    }

    startDrag(pointer) {
        if (pointer.y > 100 && pointer.y < 500) {
            this.isDragging = true;
            this.startX = pointer.x;
            this.currentX = this.scrollableContainer.x;
        }
    }

    doDrag(pointer) {
        if (this.isDragging) {
            const diff = pointer.x - this.startX;
            let newX = this.currentX + diff;
            const teamCount = this.scene.rivalTeamsManager.getAllTeams().length;
            const maxScroll = -(teamCount - 1) * 450;
            newX = Phaser.Math.Clamp(newX, maxScroll, 0);
            this.scrollableContainer.x = newX;
            this.updateSelectionBorder();
        }
    }

    stopDrag() {
        this.isDragging = false;
        if (!this.scrollableContainer) return;

        const cardWidth = 450;
        const currentPosition = -this.scrollableContainer.x;
        const nearestCardIndex = Math.round(currentPosition / cardWidth);
        const targetX = -(nearestCardIndex * cardWidth);

        this.scene.tweens.add({
            targets: this.scrollableContainer,
            x: targetX,
            duration: 300,
            ease: 'Cubic.out',
            onComplete: () => {
                this.updateSelectionBorder();
            }
        });
    }

    updateSelectionBorder() {
        if (!this.selectionBorder || !this.scrollableContainer) return;

        const cardWidth = 450;
        const currentPosition = -this.scrollableContainer.x;
        const centerCardIndex = Math.round(currentPosition / cardWidth);
        const cardCenterX = centerCardIndex * cardWidth;
        this.selectionBorderContainer.x = cardCenterX + 400;
        this.selectionBorder.setVisible(true);
    }

    cleanup() {
        if (this.playScreenContainer) {
            this.scene.input.off('pointerdown', this.startDrag, this);
            this.scene.input.off('pointermove', this.doDrag, this);
            this.scene.input.off('pointerup', this.stopDrag, this);
            this.playScreenContainer.destroy();
            this.playScreenContainer = null;
            this.scrollableContainer = null;
            this.teamCards = [];
            this.selectionBorder = null;
            this.selectionBorderContainer = null;
        }
    }
}
