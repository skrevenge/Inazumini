class PlayerStats {
    constructor() {
        this.players = {};
        this.characterStats = this.initializePlayerStats(); // Armazena as definições de personagens
        this.activePlayers = []; // Add this line to store active players
        this.rarityRanks = ['Normal', 'Rare', 'Super Rare', 'Ultra Rare', 'Legend'];
    }

addPlayer(key, level, rarity = 'Normal') {
    if (this.characterStats[key]) {
        const character = this.characterStats[key];
        this.players[key] = {
            ...character,
            level: level,
            rarity: rarity
        };

        // Apply initial boosts based on the provided level
        for (let i = 1; i < level; i++) {
            this.applyBoosts(key);
        }

        // Ensure rarity is set correctly after boosts
        this.players[key].rarity = rarity;
    } else {
        console.warn(`Character with key "${key}" not found.`);
    }
}

    updateActivePlayers(newActivePlayerKeys) {
    this.activePlayers = newActivePlayerKeys.slice(0, 6);  // Limit to 6 players
}

    static Character = class {
        constructor(config) {
            this.name = config.name;
            this.undubName = config.undubName;
            this.TP = config.TP;
            this.FP = config.FP;
            this.attribute = config.attribute;
            this.shoot = config.shoot;
            this.dribble = config.dribble;
            this.speed = config.speed;
            this.strength = config.strength;
            this.keeper = config.keeper;
            this.hissatsu = config.hissatsu;
            this.headSpriteConfig = {
                key: config.headSpriteConfig.key,
                frames: {
                    front: config.headSpriteConfig.frames[0],
                    back: config.headSpriteConfig.frames[1],
                    left: config.headSpriteConfig.frames[2],
                    right: config.headSpriteConfig.frames[3],
                    topRight: config.headSpriteConfig.frames[4],
                    topLeft: config.headSpriteConfig.frames[5],
                    bottomRight: config.headSpriteConfig.frames[6],
                    bottomLeft: config.headSpriteConfig.frames[7]
                }
            };
            this.portraitFrame = config.portraitFrame;
            this.LvUpBoost = config.LvUpBoost || {};
            this.CpuRankRHst = config.CpuRankRHst || [];
            this.CpuRankSRHst = config.CpuRankSRHst || [];
            this.CpuRankURHst = config.CpuRankURHst || [];
            this.CpuRankLHst = config.CpuRankLHst || [];
            this.RankUpBoost = config.RankUpBoost || {};
        }
    };

    initializePlayerStats() {
        return {
            'markEvans': new PlayerStats.Character({
                name: 'Mark Evans',
                undubName: 'Mamoru Endou',
                TP: 180,
                FP: 170,
                attribute: 'Earth',
                shoot: 50,
                dribble: 60,
                speed: 70,
                strength: 75,
                keeper: 90,
                hissatsu: ['God Hand', 'Burning Punch'],
                headSpriteConfig: {
                    key: 'raimonHead',
                    frames: [0, 1, 2, 3, 4, 5, 6, 7]
                },
                portraitFrame: 0,
                LvUpBoost: {
                    1: [5, 4, 1, 2, 2, 2, 3],
                    2: [6, 5, 2, 2, 2, 2, 3],
                    3: [6, 5, 2, 3, 3, 3, 4],
                    4: [7, 6, 2, 3, 3, 3, 4],
                    5: [7, 6, 3, 3, 3, 3, 5]
                },
                RankUpBoost: {
                    RankRare: [10, 8, 3, 4, 4, 4, 6],
                    RankSRare: [15, 12, 5, 6, 6, 6, 9],
                    RankURare: [20, 16, 7, 8, 8, 8, 12],
                    RankLegend: [25, 20, 9, 10, 10, 10, 15]
                },
                CpuRankRHst: ['God Hand'],
                CpuRankSRHst: ['God Hand', 'Majin The Hand'],
                CpuRankURHst: ['God Hand', 'Majin The Hand', 'Fist of Justice'],
                CpuRankLHst: ['God Hand', 'Majin The Hand', 'Fist of Justice', 'Hammer of Wrath']
            }),
            'nathanSwift': new PlayerStats.Character({
                name: 'Nathan Swift',
                undubName: 'Kazemaru Ichirouta',
                TP: 160,
                FP: 180,
                attribute: 'Wind',
                shoot: 60,
                dribble: 80,
                speed: 90,
                strength: 65,
                keeper: 40,
                hissatsu: ['Shippuu Dash', 'Dark Phoenix'],
                headSpriteConfig: {
                    key: 'raimonHead',
                    frames: [8, 9, 10, 11, 12, 13, 14, 15]
                },
                portraitFrame: 1,
                LvUpBoost: {
                    1: [4, 5, 2, 3, 3, 2, 1],
                    2: [5, 6, 2, 3, 3, 2, 1],
                    3: [5, 6, 3, 4, 4, 3, 1],
                    4: [6, 7, 3, 4, 4, 3, 1],
                    5: [6, 7, 3, 4, 5, 3, 2]
                },
                RankUpBoost: {
                    RankRare: [8, 10, 4, 5, 6, 4, 3],
                    RankSRare: [12, 15, 6, 8, 9, 6, 4],
                    RankURare: [16, 20, 8, 10, 12, 8, 6],
                    RankLegend: [20, 25, 10, 12, 15, 10, 8]
                },
                CpuRankRHst: ['Shippuu Dash'],
                CpuRankSRHst: ['Shippuu Dash', 'Dark Phoenix'],
                CpuRankURHst: ['Shippuu Dash', 'Dark Phoenix', 'Bunshin Defense'],
                CpuRankLHst: ['Shippuu Dash', 'Dark Phoenix', 'Bunshin Defense', 'Fuujin no Mai']
            }),
            'axelBlaze': new PlayerStats.Character({
                name: 'Axel Blaze',
                undubName: 'Shuuya Gouenji',
                TP: 180,
                FP: 170,
                attribute: 'Earth',
                shoot: 50,
                dribble: 60,
                speed: 70,
                strength: 75,
                keeper: 90,
                hissatsu: ['God Hand', 'Burning Punch'],
                headSpriteConfig: {
                    key: 'raimonHead',
                    frames: [0, 1, 2, 3, 4, 5, 6, 7]
                },
                portraitFrame: 0,
                LvUpBoost: {
                    1: [5, 4, 1, 2, 2, 2, 3],
                    2: [6, 5, 2, 2, 2, 2, 3],
                    3: [6, 5, 2, 3, 3, 3, 4],
                    4: [7, 6, 2, 3, 3, 3, 4],
                    5: [7, 6, 3, 3, 3, 3, 5]
                },
                RankUpBoost: {
                    RankRare: [10, 8, 3, 4, 4, 4, 6],
                    RankSRare: [15, 12, 5, 6, 6, 6, 9],
                    RankURare: [20, 16, 7, 8, 8, 8, 12],
                    RankLegend: [25, 20, 9, 10, 10, 10, 15]
                },
                CpuRankRHst: ['God Hand'],
                CpuRankSRHst: ['God Hand', 'Majin The Hand'],
                CpuRankURHst: ['God Hand', 'Majin The Hand', 'Fist of Justice'],
                CpuRankLHst: ['God Hand', 'Majin The Hand', 'Fist of Justice', 'Hammer of Wrath']
            }),
           'jackWallside': new PlayerStats.Character({
                name: 'Jack Wallside',
                undubName: 'Heigoro Kabeyama',
                TP: 180,
                FP: 170,
                attribute: 'Earth',
                shoot: 50,
                dribble: 60,
                speed: 70,
                strength: 75,
                keeper: 90,
                hissatsu: ['God Hand', 'Burning Punch'],
                headSpriteConfig: {
                    key: 'raimonHead',
                    frames: [0, 1, 2, 3, 4, 5, 6, 7]
                },
                portraitFrame: 0,
                LvUpBoost: {
                    1: [5, 4, 1, 2, 2, 2, 3],
                    2: [6, 5, 2, 2, 2, 2, 3],
                    3: [6, 5, 2, 3, 3, 3, 4],
                    4: [7, 6, 2, 3, 3, 3, 4],
                    5: [7, 6, 3, 3, 3, 3, 5]
                },
                RankUpBoost: {
                    RankRare: [10, 8, 3, 4, 4, 4, 6],
                    RankSRare: [15, 12, 5, 6, 6, 6, 9],
                    RankURare: [20, 16, 7, 8, 8, 8, 12],
                    RankLegend: [25, 20, 9, 10, 10, 10, 15]
                },
                CpuRankRHst: ['God Hand'],
                CpuRankSRHst: ['God Hand', 'Majin The Hand'],
                CpuRankURHst: ['God Hand', 'Majin The Hand', 'Fist of Justice'],
                CpuRankLHst: ['God Hand', 'Majin The Hand', 'Fist of Justice', 'Hammer of Wrath']
            }),
          'todIronside': new PlayerStats.Character({
                name: 'Tod Ironside',
                undubName: 'Teppei Kurimatsu',
                TP: 160,
                FP: 180,
                attribute: 'Wind',
                shoot: 60,
                dribble: 80,
                speed: 90,
                strength: 65,
                keeper: 40,
                hissatsu: ['Shippuu Dash', 'Dark Phoenix'],
                headSpriteConfig: {
                    key: 'raimonHead',
                    frames: [8, 9, 10, 11, 12, 13, 14, 15]
                },
                portraitFrame: 1,
                LvUpBoost: {
                    1: [4, 5, 2, 3, 3, 2, 1],
                    2: [5, 6, 2, 3, 3, 2, 1],
                    3: [5, 6, 3, 4, 4, 3, 1],
                    4: [6, 7, 3, 4, 4, 3, 1],
                    5: [6, 7, 3, 4, 5, 3, 2]
                },
                RankUpBoost: {
                    RankRare: [8, 10, 4, 5, 6, 4, 3],
                    RankSRare: [12, 15, 6, 8, 9, 6, 4],
                    RankURare: [16, 20, 8, 10, 12, 8, 6],
                    RankLegend: [20, 25, 10, 12, 15, 10, 8]
                },
                CpuRankRHst: ['Shippuu Dash'],
                CpuRankSRHst: ['Shippuu Dash', 'Dark Phoenix'],
                CpuRankURHst: ['Shippuu Dash', 'Dark Phoenix', 'Bunshin Defense'],
                CpuRankLHst: ['Shippuu Dash', 'Dark Phoenix', 'Bunshin Defense', 'Fuujin no Mai']
            }),
          'kevinDragonfly': new PlayerStats.Character({
                name: 'Kevin Dragonfly',
                undubName: 'Ryugo Someoka',
                TP: 160,
                FP: 180,
                attribute: 'Wind',
                shoot: 60,
                dribble: 80,
                speed: 90,
                strength: 65,
                keeper: 40,
                hissatsu: ['Shippuu Dash', 'Dark Phoenix'],
                headSpriteConfig: {
                    key: 'raimonHead',
                    frames: [8, 9, 10, 11, 12, 13, 14, 15]
                },
                portraitFrame: 1,
                LvUpBoost: {
                    1: [4, 5, 2, 3, 3, 2, 1],
                    2: [5, 6, 2, 3, 3, 2, 1],
                    3: [5, 6, 3, 4, 4, 3, 1],
                    4: [6, 7, 3, 4, 4, 3, 1],
                    5: [6, 7, 3, 4, 5, 3, 2]
                },
                RankUpBoost: {
                    RankRare: [8, 10, 4, 5, 6, 4, 3],
                    RankSRare: [12, 15, 6, 8, 9, 6, 4],
                    RankURare: [16, 20, 8, 10, 12, 8, 6],
                    RankLegend: [20, 25, 10, 12, 15, 10, 8]
                },
                CpuRankRHst: ['Shippuu Dash'],
                CpuRankSRHst: ['Shippuu Dash', 'Dark Phoenix'],
                CpuRankURHst: ['Shippuu Dash', 'Dark Phoenix', 'Bunshin Defense'],
                CpuRankLHst: ['Shippuu Dash', 'Dark Phoenix', 'Bunshin Defense', 'Fuujin no Mai']
            }),
            // Add more players here as needed
        };
    }

initializeDefaultPlayers() {
    const defaultPlayers = [
        { key: 'markEvans', level: 4, rarity: 'Rare' },
        { key: 'nathanSwift', level: 3, rarity: 'Rare' },
        { key: 'axelBlaze', level: 3, rarity: 'Normal' },
        { key: 'jackWallside', level: 4, rarity: 'Normal' },
        { key: 'todIronside', level: 2, rarity: 'Normal' },
        { key: 'kevinDragonfly', level: 2, rarity: 'Normal' }
    ];

    defaultPlayers.forEach(player => {
        const stats = this.initializePlayerStats()[player.key];
        if (stats) {
            // Initialize the player with level 1 and specified rarity
            this.addPlayer(player.key, 1, player.rarity);

            // Update player's level and apply boosts
            for (let level = 2; level <= player.level; level++) {
                this.players[player.key].level = level;
                this.applyBoosts(player.key);
            }

            // Ensure the rarity is set correctly after all boosts are applied
            this.players[player.key].rarity = player.rarity;
        } else {
            console.error(`Jogador com a chave '${player.key}' não encontrado!`);
        }
    });

    // Set initial active players
    this.activePlayers = defaultPlayers.map(player => player.key);
}



applyBoosts(playerName) {
    const player = this.players[playerName];
    if (!player) return;

    const charData = this.initializePlayerStats()[playerName];
    if (!charData || !charData.LvUpBoost) return;

    const boosts = Object.values(charData.LvUpBoost);
    const level = player.level;

    if (level > 1) {
        const boostIndex = (level - 2) % boosts.length;
        const currentBoost = boosts[boostIndex];

        const [TP, FP, shoot, dribble, speed, strength, keeper] = currentBoost;

        player.TP += TP;
        player.FP += FP;
        player.shoot += shoot;
        player.dribble += dribble;
        player.speed += speed;
        player.strength += strength;
        player.keeper += keeper;

    }
}

    levelUp(playerName) {
    const player = this.players[playerName];
    if (!player) return;

    player.level++; // Incrementa o nível do jogador

    this.applyBoosts(playerName); // Aplica os boosts correspondentes
}


    getAllPlayers() {
        return Object.keys(this.players);
    }

    getPlayerStats(playerKey) {
        return this.players[playerKey];
    }
}
