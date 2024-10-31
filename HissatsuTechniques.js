class HissatsuTechniques {
    constructor() {
        this.techniques = {
            SDash: {
                ID: 'SDash',
                Name: 'Wind Dash',
                Undub_Name: 'Shippu Dash',
                Local_Name: 'Deslize Veloz',
                TP_Cost: 30,
                Power: 150,
                Type: 'Dribble',
                Animation: 'HAnimSDash',
                HelpersRequired: 2,
                VictimsRequired: 2
            },
            FTornado: {
                ID: 'FTornado',
                Name: 'Fire Tornado',
                Undub_Name: 'Fire Tornado',
                Local_Name: 'Furacão de Fogo',
                TP_Cost: 30,
                Power: 150,
                Type: 'Shoot',
                Animation: 'HAnimFTornado',
                HelpersRequired: 0,
                VictimsRequired: 0
            }
            // Add more Hissatsu techniques here as needed
        };
    }

    getTechnique(id) {
        return this.techniques[id];
    }

    getAllTechniques() {
        return this.techniques;
    }

    addTechnique(technique) {
        if (technique.ID) {
            this.techniques[technique.ID] = technique;
        }
    }
}

// Export the class for use in other modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = HissatsuTechniques;
} else {
    window.HissatsuTechniques = HissatsuTechniques;
}
