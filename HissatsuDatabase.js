class HissatsuDatabase {
    constructor() {
        this.techniques = {
            'GodHand': {
                name: "God Hand",
                undub_name: "Gotto Hando", 
                loc_name: "Mão Fantasma",
                tp_cost: 30,
                attribute: "Earth",
                type: "Catch",
                power: 50,
                starRank: 3,
                hPortrait: 0,
                animation: null // Will be implemented later
            },
            'NekketsuPunch': {
                name: "Fireball Knucle",
                undub_name: "Nekketsu Punch",
                loc_name: "Soco Explosivo", 
                tp_cost: 20,
                attribute: "Fire",
                type: "Catch",
                power: 40,
                starRank: 1,
                hPortrait: 1,
                animation: null // Will be implemented later
            },
            'FireTornado': {
                name: "Fire Tornado",
                undub_name: "Fire Tornado",
                loc_name: "Furacão de Fogo", 
                tp_cost: 35,
                attribute: "Fire",
                type: "Shoot",
                power: 70,
                starRank: 1,
                hPortrait: 1,
                animation: null // Will be implemented later
            },
            'TheWall': {
                name: "The Wall",
                undub_name: "The Wall",
                loc_name: "O Muro", 
                tp_cost: 30,
                attribute: "Earth",
                type: "Defense",
                power: 50,
                starRank: 1,
                hPortrait: 1,
                animation: null // Will be implemented later
            },
            'ShippuuDash': {
                name: "Wind Dash",
                undub_name: "Shipuu Dash",
                loc_name: "Deslize Veloz", 
                tp_cost: 30,
                attribute: "Wind",
                type: "Dribble",
                power: 60,
                starRank: 1,
                hPortrait: 1,
                animation: null // Will be implemented later
            },
            'TamanoriPierrot': {
                name: "Rodeo Clown",
                undub_name: "Tamanori Pierrot",
                loc_name: "Palhaço de Rodeio", 
                tp_cost: 20,
                attribute: "Wind",
                type: "Dribble",
                power: 40,
                starRank: 1,
                hPortrait: 1,
                animation: null // Will be implemented later
            }
        };
    }

    getTechniques() {
        return this.techniques;
    }

    getTechnique(id) {
        return this.techniques[id];
    }

    addTechnique(id, technique) {
        this.techniques[id] = technique;
    }
}
