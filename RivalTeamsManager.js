class RivalTeamsManager {
    constructor(scene) {
        this.scene = scene;
        this.rivalTeams = {
            'Raimon': {
                undubName: 'Raimon',
                locName: 'Raimon',
                formation: '2-1-2',
                players: [{
                    key: 'markEvans',
                    level: 3,
                    rarity: 'Normal'
                }, {
                    key: 'todIronside',
                    level: 3,
                    rarity: 'Normal'
                }, {
                    key: 'jackWallside',
                    level: 3,
                    rarity: 'Normal'
                }, {
                    key: 'nathanSwift',
                    level: 3,
                    rarity: 'Normal'
                }, {
                    key: 'axelBlaze',
                    level: 3,
                    rarity: 'Normal'
                }, {
                    key: 'kevinDragonfly',
                    level: 3,
                    rarity: 'Normal'
                }]
            },
            'Royal Academy': {
                undubName: 'Teikoku Gakuen',
                locName: 'Instituto Imperial',
                formation: '3-1-1',
                players: [{
                    key: 'josephKing',
                    level: 5,
                    rarity: 'Rare'
                }, {
                    key: 'todIronside',
                    level: 4,
                    rarity: 'Rare'
                }, {
                    key: 'jackWallside',
                    level: 4,
                    rarity: 'Rare'
                }, {
                    key: 'judeSharp',
                    level: 4,
                    rarity: 'Rare'
                }, {
                    key: 'davidSamford',
                    level: 6,
                    rarity: 'Rare'
                }, {
                    key: 'kevinDragonfly',
                    level: 4,
                    rarity: 'Rare'
                }]
            },
            'Raimon 2nd': {
                undubName: 'Shin Raimon',
                locName: 'Nova Raimon',
                formation: '1-2-2',
                players: [{
                    key: 'markEvans',
                    level: 5,
                    rarity: 'Super Rare'
                }, {
                    key: 'todIronside',
                    level: 4,
                    rarity: 'Ultra Rare'
                }, {
                    key: 'jackWallside',
                    level: 4,
                    rarity: 'Legend'
                }, {
                    key: 'nathanSwift',
                    level: 4,
                    rarity: 'Rare'
                }, {
                    key: 'axelBlaze',
                    level: 6,
                    rarity: 'Normal'
                }, {
                    key: 'kevinDragonfly',
                    level: 4,
                    rarity: 'Rare'
                }]
            }
        };
    }

        // Add a method to access character stats directly
    getCharacterStats(playerKey) {
        return this.scene.playerStats.characterStats[playerKey];
    }

    getPlayerPositionFromFormation(playerIndex, formation) {
        const formationMap = {
            '2-1-2': ['GK', 'DF', 'DF', 'MF', 'FW', 'FW'],
            '3-1-1': ['GK', 'DF', 'DF', 'DF', 'MF', 'FW'],
            '1-2-2': ['GK', 'DF', 'MF', 'MF', 'FW', 'FW'],
            '2-2-1': ['GK', 'DF', 'DF', 'MF', 'MF', 'FW'],
            '1-1-3': ['GK', 'DF', 'MF', 'FW', 'FW', 'FW'],
            '1-3-1': ['GK', 'DF', 'MF', 'MF', 'MF', 'FW']
        };
        return formationMap[formation][playerIndex] || 'FW';
    }

    createPlayerContainer(player, index) {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const playerContainer = this.scene.add.container(-120 + (col * 120), -90 + (row * 120));

        const rarityFrames = {
            'Normal': 0,
            'Rare': 1,
            'Super Rare': 2,
            'Ultra Rare': 3,
            'Legend': 4
        };

        const portrait = this.scene.add.sprite(0, 0, 'raiTeiPortrait', player.portraitFrame);
        const portraitBg = this.scene.add.image(0, 0, 'frameBorder', rarityFrames[player.rarity] || 0);
        
        const nameText = this.scene.add.bitmapText(0, 40, 'customFont', player.name, 16)
            .setOrigin(0.5);
        const levelText = this.scene.add.bitmapText(0, 60, 'customFont', `Lv.${player.level}`, 16)
            .setOrigin(0.5);
        const posText = this.scene.add.bitmapText(0, -30, 'customFont', player.position, 16)
            .setOrigin(0.5);

        playerContainer.add([portrait, portraitBg, nameText, levelText, posText]);
        return playerContainer;
    }

    getAllTeams() {
        return Object.entries(this.rivalTeams).map(([teamName, team]) => {
            if (!team.players || !Array.isArray(team.players) || !team.formation) {
                return null;
            }

            const processedPlayers = team.players.map((player, playerIndex) => {
                const stats = this.getCharacterStats(player.key);
                if (!stats) {
                    console.warn(`No character stats found for ${player.key}`);
                    return null;
                }
                // Create a copy of base stats and apply rival team modifications
                const rivalStats = {
                    ...stats,
                    key: player.key,
                    name: this.scene.selectedNameStyle === 'dub' ? stats.name : stats.undubName,
                    portraitFrame: stats.portraitFrame,
                    level: player.level,
                    rarity: player.rarity,
                    position: this.getPlayerPositionFromFormation(playerIndex, team.formation),
                    headSpriteConfig: stats.headSpriteConfig
                };
                
                return rivalStats;

            }).filter(player => player !== null);

            if (processedPlayers.length > 0 && team.formation) {
                let teamDisplayName = teamName;

                if (this.scene.currentLanguage === 'pt-br') {
                    teamDisplayName = team.locName;
                } else if (this.scene.selectedNameStyle === 'undub') {
                    teamDisplayName = team.undubName;
                }
                return {
                    teamName: teamDisplayName,
                    formation: team.formation,
                    players: processedPlayers
                };
            }
            return null;
        }).filter(player => player !== null);
    }
}
