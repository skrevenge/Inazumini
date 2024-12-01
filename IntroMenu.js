class IntroMenu {
    constructor(scene) {
        this.scene = scene;
    }

    create() {
        // Add the background image and make it cover the entire screen
        const background = this.scene.add.image(400, 300, 'background');
        background.setDisplaySize(this.scene.sys.game.config.width, this.scene.sys.game.config.height);

        // Add the instruction text
        this.scene.add.text(400, 100, this.scene.localization['initial']['MenuOption_ChooseLanguage'], {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create language selection buttons
        this.createButton(400, 250, this.scene.localization['initial']['MenuOption_English'], () => this.selectLanguage('en'));
        this.createButton(400, 350, this.scene.localization['initial']['MenuOption_Portuguese'], () => this.selectLanguage('pt-br'));
    }

    createButton(x, y, text, callback) {
        const button = this.scene.add.image(x, y, 'button');
        button.setInteractive();

        const buttonText = this.scene.add.text(x, y, text, {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        button.on('pointerover', () => {
            button.setTint(0xdddddd);
            this.scene.tweens.add({
                targets: [button, buttonText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        button.on('pointerout', () => {
            button.clearTint();
            this.scene.tweens.add({
                targets: [button, buttonText],
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        button.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: [button, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: callback
            });
        });
    }

    selectLanguage(lang) {
        console.log(`Selected language: ${lang}`);
        this.scene.currentLanguage = lang;
        this.scene.selectedNameStyle = lang === 'pt-br' ? 'undub' : 'dub';
        if (lang === 'en') {
            this.showNameStyleQuestion();
        } else if (lang === 'pt-br') {
            this.showGameplayStyleQuestion(lang);
        }
    }

    showNameStyleQuestion() {
        // Remove only specific elements (buttons and text), keeping the background
        this.scene.children.list
            .filter(child => child instanceof Phaser.GameObjects.Image && child.texture.key !== 'background' ||
                child instanceof Phaser.GameObjects.Text)
            .forEach(child => child.destroy());

        // Add new question text
        this.scene.add.text(400, 100, this.scene.localization['en']['MenuOption_ChooseNameStyle'], {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create new buttons
        this.createButton(400, 250, this.scene.localization['en']['MenuOption_DubNames'], () => this.onNameStyleSelected('dub'));
        this.createButton(400, 350, this.scene.localization['en']['MenuOption_UndubNames'], () => this.onNameStyleSelected('undub'));
    }

    onNameStyleSelected(style) {
        console.log(`Name style selected: ${style}`);
        this.scene.selectedNameStyle = style;
        this.showGameplayStyleQuestion('en');
    }

    showGameplayStyleQuestion(lang) {
        // Remove previous elements
        this.scene.children.list
            .filter(child => child instanceof Phaser.GameObjects.Image && child.texture.key !== 'background' ||
                child instanceof Phaser.GameObjects.Text)
            .forEach(child => child.destroy());

        // Add new question text
        const questionText = this.scene.localization[lang]['MenuOption_ChooseGameplayStyle'];
        this.scene.add.text(400, 100, questionText, {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create new image buttons
        const keyboardMouseText = this.scene.localization[lang]['MenuOption_KeyboardMouse'];
        const touchscreenText = this.scene.localization[lang]['MenuOption_Touchscreen'];

        // Keyboard/Mouse option
        const keyboardImage = this.scene.add.image(250, 300, 'keyboardGS');
        keyboardImage.setScale(0.8); // Reduce size to 80% of original
        keyboardImage.setInteractive();
        keyboardImage.on('pointerdown', () => this.selectGameplayStyle('keyboard'));
        this.scene.add.text(250, 430, keyboardMouseText, {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Touchscreen option
        const touchImage = this.scene.add.image(550, 300, 'touchGS');
        touchImage.setScale(0.8); // Reduce size to 80% of original
        touchImage.setInteractive();
        touchImage.on('pointerdown', () => this.selectGameplayStyle('touch'));
        this.scene.add.text(550, 430, touchscreenText, {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Add hover effects
        this.addHoverEffect(keyboardImage);
        this.addHoverEffect(touchImage);
    }

    selectGameplayStyle(style) {
        console.log(`Selected gameplay style: ${style}`);
        this.scene.showMainMenu();
    }

    addHoverEffect(image) {
        const baseScale = 0.8;
        const hoverScale = baseScale * 1.1;

        image.on('pointerover', () => {
            this.scene.tweens.add({
                targets: image,
                scaleX: hoverScale,
                scaleY: hoverScale,
                duration: 100
            });
        });
        image.on('pointerout', () => {
            this.scene.tweens.add({
                targets: image,
                scaleX: baseScale,
                scaleY: baseScale,
                duration: 100
            });
        });
    }
}
