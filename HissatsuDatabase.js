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
