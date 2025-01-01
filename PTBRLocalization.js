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
            'LobbyButton_Inventory': 'Jogadores',
            'LobbyButton_Play': 'Jogar',
            'LobbyButton_Formation': 'Formação',
            'Formation_Bench': 'Reservas',
            'saved': 'Salvo',
            'Formation_SwapPlayer': 'Trocar\nJogador',
            'Formation_Cancel': 'Cancelar',
            'Formation_Enhance': 'Aprimorar',
            'Stats_Level': 'Nv',
            'Stats_Exp': 'Exp',
            'Stats_TP': 'TP',
            'Stats_FP': 'FP',
            'Stats_Shoot': 'Chute',
            'Stats_Strength': 'Força',
            'Stats_Dribble': 'Drible',
            'Stats_Catch': 'Captura',
            'Stats_Speed': 'Velocidade',
            'Stats_Element': 'Elemento',
            'Stats_Rarity': 'Raridade',
            'Stats_Stats': 'Estatísticas',
            'Stats_Hissatsu': 'Teq. Especiais',
            'Attribute_Fire': 'Fogo',
            'Attribute_Earth': 'Terra',
            'Attribute_Wood': 'Floresta',
            'Attribute_Wind': 'Vento',
            'HissatsuType_Shoot': 'Chute',
            'HissatsuType_Block': 'Defesa',
            'HissatsuType_Catch': 'Captura',
            'HissatsuType_Dribble': 'Drible'
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
