class PTBRLocalization {
    constructor() {
        this.language = 'pt-br';
        this.translations = {
            'MenuOption_ChooseGameplayStyle': 'Estilo de gameplay:',
            'MenuOption_KeyboardMouse': 'Teclado e Mouse',
            'MenuOption_Touchscreen': 'Toque',
            'MenuOption_NewGame': 'Novo Jogo',
            'MenuOption_Continue': 'Continuar',
            'MenuOption_Instructions': 'Instruções',
            'Instruction_PrevPage': 'Pag. Anterior',
            'Instruction_NextPage': 'Prox. Pagina',
            'Instruction_MainMenu': 'Menu Princ.',
            'Instruction_PageIndicator': 'Página {current}/{total}',
            'LobbyButton_Inventory': 'Inventário',
            'LobbyButton_Play': 'Jogar',
            'LobbyButton_Formation': 'Formação'
        };
    }

    getTranslation(key) {
        return this.translations[key] || key;
    }

    addToLocalization(scene) {
        if (!scene.localization) {
            scene.localization = {};
        }
        scene.localization[this.language] = this.translations;
    }
}

// This line ensures the class is available globally when the script is loaded
window.PTBRLocalization = PTBRLocalization;
