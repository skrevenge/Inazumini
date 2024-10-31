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
        return { ...this.techniques };
    }

    addTechnique(technique) {
        if (technique && technique.ID) {
            this.techniques[technique.ID] = technique;
            return true;
        }
        return false;
    }

    removeTechnique(id) {
        if (this.techniques[id]) {
            delete this.techniques[id];
            return true;
        }
        return false;
    }

    updateTechnique(id, updates) {
        if (this.techniques[id]) {
            this.techniques[id] = { ...this.techniques[id], ...updates };
            return true;
        }
        return false;
    }

    getTechniquesByType(type) {
        return Object.values(this.techniques).filter(tech => tech.Type === type);
    }

    getTechniquesByPowerRange(minPower, maxPower) {
        return Object.values(this.techniques).filter(tech => 
            tech.Power >= minPower && tech.Power <= maxPower
        );
    }
}

// Export the class for use in other modules
export default HissatsuTechniques;
