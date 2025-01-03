class MainMenu {
    constructor(scene, localization) {
        this.scene = scene;
        this.menuGroup = null;
        this.language = null;
        this.nameStyle = null;
        this.localization = localization;
    }

    createButtonContainer(x, y, text, width, height) {
        const container = this.scene.add.container(x, y);
        const cornerRadius = 15;
        const background = this.scene.add.graphics();
        background.fillStyle(0x000000, 0.5);
        background.lineStyle(2, 0xffffff);
        background.fillRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
        background.strokeRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
        const buttonText = this.scene.add.text(0, 0, text, {
            fontSize: '24px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        container.add([background, buttonText]);

        const hitArea = new Phaser.Geom.Rectangle(-width / 2, -height / 2, width, height);
        container.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains);

        container.on('pointerover', () => {
            background.clear();
            background.fillStyle(0x444444, 0.8);
            background.lineStyle(2, 0xffffff);
            background.fillRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
            background.strokeRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
        });
        container.on('pointerout', () => {
            background.clear();
            background.fillStyle(0x000000, 0.5);
            background.lineStyle(2, 0xffffff);
            background.fillRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
            background.strokeRoundedRect(-width / 2, -height / 2, width, height, cornerRadius);
        });

        return container;
    }

    chooseLanguage() {
        this.menuGroup = this.scene.add.group();
        const background = this.scene.add.image(400, 300, 'menu_bg');
        background.setDisplaySize(800, 600);
        const text = this.scene.add.text(400, 100, 'Choose language\nEscolha o idioma:', {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4,
            align: 'center',
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);
        text.setLineSpacing(10);
        const buttonWidth = 300;
        const buttonHeight = 60;
        const englishButton = this.createButtonContainer(400, 250, 'English', buttonWidth, buttonHeight);
        const portugueseButton = this.createButtonContainer(400, 350, 'Português (BR)', buttonWidth, buttonHeight);
        this.menuGroup.add(background);
        this.menuGroup.add(text);
        this.menuGroup.add(englishButton);
        this.menuGroup.add(portugueseButton);
        englishButton.on('pointerdown', () => this.setLanguage('en'));
        portugueseButton.on('pointerdown', () => this.setLanguage('pt-br'));

        [englishButton, portugueseButton].forEach(button => {
            const buttonText = button.list[1];
            buttonText.setStyle({
                fontSize: '32px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 3,
                fontStyle: 'bold'
            });
        });
    }

    setLanguage(lang) {
        this.language = lang;
        this.menuGroup.clear(true, true);
        if (lang === 'en') {
            this.chooseNameStyle();
        } else if (lang === 'pt-br') {
            this.nameStyle = 'undub';
            this.chooseTeam('undub');
        } else {
            this.language = 'en';
            this.nameStyle = 'undub';
            this.chooseTeam('undub');
        }
    }

    chooseNameStyle() {
        this.menuGroup = this.scene.add.group();
        const background = this.scene.add.image(400, 300, 'menu_bg');
        background.setDisplaySize(800, 600);
        const text = this.scene.add.text(400, 100, this.localization[this.language || 'en']['MenuOption_ChooseNameStyle'], {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4,
            align: 'center',
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);
        text.setLineSpacing(10);
        const buttonWidth = 300;
        const buttonHeight = 60;
        const dubButton = this.createButtonContainer(400, 250, this.localization[this.language || 'en']['MenuOption_DubNames'], buttonWidth, buttonHeight);
        const undubButton = this.createButtonContainer(400, 350, this.localization[this.language || 'en']['MenuOption_UndubNames'], buttonWidth, buttonHeight);
        this.menuGroup.add(background);
        this.menuGroup.add(text);
        this.menuGroup.add(dubButton);
        this.menuGroup.add(undubButton);
        dubButton.on('pointerdown', () => this.chooseTeam('dub'));
        undubButton.on('pointerdown', () => this.chooseTeam('undub'));
        [dubButton, undubButton].forEach(button => {
            const buttonText = button.list[1];
            buttonText.setStyle({
                fontSize: '32px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 3,
                fontStyle: 'bold'
            });
        });
    }

    chooseTeam(nameStyle) {
        this.menuGroup.clear(true, true);
        const background = this.scene.add.image(400, 300, 'menu_bg');
        background.setDisplaySize(800, 600);
        const text = this.scene.add.text(400, 100, this.scene.localization[this.language || 'en']['MenuOption_ChooseTeam'], {
            fontSize: '32px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 4,
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);
        const createTeamContainer = (x, y, imageKey, teamName) => {
            const container = this.scene.add.container(x, y);
            const image = this.scene.add.image(0, 0, imageKey);
            image.setScale(0.5);
            const borderWidth = 4;
            const border = this.scene.add.rectangle(0, 0, image.width * image.scaleX + borderWidth * 2, image.height * image.scaleY + borderWidth * 2, 0xFFFFFF);
            container.add(border);
            container.add(image);
            const text = this.scene.add.text(0, image.displayHeight / 2 + 30, teamName, {
                fontSize: '24px',
                fill: '#fff',
                stroke: '#000',
                strokeThickness: 3,
                fontStyle: 'bold'
            });
            text.setOrigin(0.5);
            container.add(text);
            container.setInteractive(new Phaser.Geom.Rectangle(-border.width / 2, -border.height / 2, border.width, border.height), Phaser.Geom.Rectangle.Contains);
            return container;
        };

        const team1Container = createTeamContainer(250, 300, 'T1', this.scene.localization[this.language || 'en']['TeamName_Team1']);
        const team2Container = createTeamContainer(550, 300, 'T2', this.scene.localization[this.language || 'en']['TeamName_Team2']);
        this.menuGroup.add(background);
        this.menuGroup.add(text);
        this.menuGroup.add(team1Container);
        this.menuGroup.add(team2Container);
        [team1Container, team2Container].forEach(container => {
            container.on('pointerover', () => {
                container.list[1].setTint(0xdddddd);
            });
            container.on('pointerout', () => {
                container.list[1].clearTint();
            });
        });
        team1Container.on('pointerdown', () => this.scene.startGame('team1', nameStyle));
        team2Container.on('pointerdown', () => this.scene.startGame('team2', nameStyle));
    }
}
