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
                console.log('Starting new game...');
                this.scene.showLobby();
                break;
            case 'MenuOption_Continue':
                console.log('Continuing game...');
                this.scene.handleContinue();
                break;
            case 'MenuOption_Instructions':
                console.log('Showing instructions...');
                this.scene.showInstructionsScreen();
                break;
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
}
