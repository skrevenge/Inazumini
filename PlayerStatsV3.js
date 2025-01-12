class PlayerStats {
constructor() {
        this.players = {};
        this.characterStats = this.initializePlayerStats();
        this.activePlayers = [];
        this.backpack = {}; // Initialize backpack property
        this.rarityRanks = ['Normal', 'Rare', 'Super Rare', 'Ultra Rare', 'Legend'];
        this.expToNextLevel = 500; // Fixed exp required for next level
    }

    addPlayer(key, level, rarity = 'Normal', exp = 0, isBackpack = false) {
        if (this.characterStats[key]) {
            const character = this.characterStats[key];
            const targetStorage = isBackpack ? this.backpack : this.players;

            // Check if player already exists in the target storage
            if (!targetStorage[key]) {
                // Create new player with base stats
                const newPlayer = {
                    ...character,
                    key: key,
                    level: level,
                    rarity: rarity,
                    exp: exp,
                    TP: character.TP || 0,
                    FP: character.FP || 0,
                    shoot: character.shoot || 0,
                    dribble: character.dribble || 0,
                    speed: character.speed || 0,
                    strength: character.strength || 0,
                    keeper: character.keeper || 0,
                    hissatsu: this.getHissatsuForRarity(key)
                };

                // Apply level boosts
                for (let i = 2; i <= level; i++) {
                    this.applyBoosts(key, newPlayer);
                }

                // Apply rarity buffs if needed
                if (rarity !== 'Normal') {
                    this.applyRarityBuffs(key, rarity, newPlayer);
                }

                targetStorage[key] = newPlayer;
                }

                console.log(`Added new player ${key} with level ${level} and rarity ${rarity}`);
                return true;
            } else {
                // Update existing player
                const player = this.players[key];
                player.level = level;
                player.rarity = rarity;
                player.exp = exp;
                player.hissatsu = this.getHissatsuForRarity(key);

                console.log(`Updated existing player ${key} with level ${level} and rarity ${rarity}`);
                return false;
            }
        }
    }

     getHissatsuForRarity(playerKey) {
        // Get character data from characterStats
        const character = this.characterStats[playerKey];
        if (!character) return [];

        // Get player data if it exists (for existing players)
        const player = this.players[playerKey];
        const rarity = player ? player.rarity : 'Normal';

        // Ensure character.hissatsu exists and is an array
        const baseHissatsu = Array.isArray(character.hissatsu) ? character.hissatsu : [];
        let hissatsu = [...baseHissatsu];

        // Add hissatsu based on rarity level
        switch (rarity) {
            case 'Legend':
                if (Array.isArray(character.RankLHst)) hissatsu = [...character.RankLHst];
                break;
            case 'Ultra Rare':
                if (Array.isArray(character.RankURHst)) hissatsu = [...character.RankURHst];
                break;
            case 'Super Rare':
                if (Array.isArray(character.RankSRHst)) hissatsu = [...character.RankSRHst];
                break;
            case 'Rare':
                if (Array.isArray(character.RankRHst)) hissatsu = [...character.RankRHst];
                break;
            default:
                // For Normal rarity, we already have the base hissatsu
                break;
        }

        // Remove duplicates and ensure we return an array
        return Array.from(new Set(hissatsu));
    }    
    addExp(playerKey, amount) {
        const player = this.players[playerKey];
        if (!player) return;

        player.exp += amount;
        while (player.exp >= this.expToNextLevel) {
            player.exp -= this.expToNextLevel;
            this.levelUp(playerKey);
        }
    }

    levelUp(playerKey) {
        const player = this.players[playerKey];
        if (!player) return;

        player.level++;
        this.applyBoosts(playerKey);
    }

applyRarityBuffs(playerKey, targetRarity) {
    const player = this.players[playerKey];
    if (!player) return;

    const rarityOrder = ['Normal', 'Rare', 'Super Rare', 'Ultra Rare', 'Legend'];
    const startIndex = rarityOrder.indexOf('Normal');
    const endIndex = rarityOrder.indexOf(targetRarity);

    for (let i = startIndex + 1; i <= endIndex; i++) {
        const currentRarity = rarityOrder[i];
        const boostKey = `Rank${currentRarity.replace(' ', '')}`;
        const boosts = player.RankUpBoost[boostKey];

        if (boosts) {
            const [TP, FP, shoot, dribble, speed, strength, keeper] = boosts;
            player.TP += TP || 0;
            player.FP += FP || 0;
            player.shoot += shoot || 0;
            player.dribble += dribble || 0;
            player.speed += speed || 0;
            player.strength += strength || 0;
            player.keeper += keeper || 0;
        }
    }

    player.rarity = targetRarity;
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
            this.RankRHst = config.RankRHst || [];
            this.RankSRHst = config.RankSRHst || [];
            this.RankURHst = config.RankURHst || [];
            this.RankLHst = config.RankLHst || [];
            this.RankUpBoost = config.RankUpBoost || {};
        }
    };

    initializeAllPlayers() {
        // Initialize all available players with base stats
        const allPlayersConfig = this.initializePlayerStats();
        Object.keys(allPlayersConfig).forEach(key => {
            this.addPlayer(key, 1, 'Normal', 0);
        });
    }

    initializeDefaultPlayers() {
        // Only set up the starting team players
        const defaultPlayers = [
            { key: 'markEvans', level: 4, rarity: 'Rare', exp: 250 },
            { key: 'todIronside', level: 2, rarity: 'Normal', exp: 50 },
            { key: 'jackWallside', level: 3, rarity: 'Normal', exp: 200 },
            { key: 'nathanSwift', level: 3, rarity: 'Normal', exp: 150 },
            { key: 'axelBlaze', level: 5, rarity: 'Rare', exp: 100 },
            { key: 'kevinDragonfly', level: 3, rarity: 'Normal', exp: 75 }
        ];

        // Clear current players, active players, and backpack
        this.players = {};
        this.activePlayers = [];
        this.backpack = {}; // Ensure backpack is initialized/cleared

        // Initialize default players
        defaultPlayers.forEach(player => {
            this.addPlayer(player.key, player.level, player.rarity, player.exp);
            this.activePlayers.push(player.key);
        });

        console.log('Default players initialized:', this.players);
        console.log('Active players:', this.activePlayers);
        console.log('Backpack initialized:', this.backpack);
    }
        
    applyBoosts(playerName) {
        const player = this.players[playerName];
        if (!player) return;

        const charData = this.initializePlayerStats()[playerName];
        if (!charData || !charData.LvUpBoost) return;

        const boosts = Object.values(charData.LvUpBoost);
        const level = player.level;

        const boostIndex = (level - 1) % boosts.length;
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

        getRarityFrame(rarity) {
        switch (rarity) {
            case 'Normal':
                return 0;
            case 'Rare':
                return 1;
            case 'Super Rare':
                return 2;
            case 'Ultra Rare':
                return 3;
            case 'Legend':
                return 4;
            default:
                return 0;
        }
    }

    getAttributeFrame(attribute) {
        switch (attribute) {
            case 'Fire':
                return 0;
            case 'Earth':
                return 1;
            case 'Wood':
                return 2;
            case 'Wind':
                return 3;
            default:
                return 0; // Default to Fire if attribute is not recognized
        }
    }

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
                hissatsu: ['GodHand'],
                RankRHst: ['GodHand', 'NekketsuPunch'],
                RankSRHst: ['GodHand', 'NekketsuPunch', 'Inazuma1Go'],
                RankURHst: ['GodHand', 'NekketsuPunch', 'Inazuma1Go', 'InazumaBreak'],
                RankLHst: ['GodHand', 'NekketsuPunch', 'Inazuma1Go', 'InazumaBreak', 'MajinTheHand']
            }),
            'nathanSwift': new PlayerStats.Character({
                name: 'Nathan Swift',
                undubName: 'Ichirouta Kazemaru',
                TP: 160,
                FP: 180,
                attribute: 'Wind',
                shoot: 60,
                dribble: 80,
                speed: 90,
                strength: 65,
                keeper: 40,
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
                hissatsu: ['ShippuuDash'],
                RankRHst: ['ShippuuDash', 'BunshinDefense'],
                RankSRHst: ['ShippuuDash', 'BunshinDefense', 'QuickDraw'],
                RankURHst: ['Shippuu Dash', 'BunshinDefense', 'QuickDraw', 'HonooKazamidori'],
                RankLHst: ['Shippuu Dash', 'BunshinDefense', 'QuickDraw', 'HonooNoKazamidori', 'SpinningCut']
            }),
            'axelBlaze': new PlayerStats.Character({
                name: 'Axel Blaze',
                undubName: 'Shuuya Gouenji',
                TP: 180,
                FP: 170,
                attribute: 'Fire',
                shoot: 50,
                dribble: 60,
                speed: 70,
                strength: 75,
                keeper: 90,
                headSpriteConfig: {
                    key: 'raimonHead',
                    frames: [16, 17, 18, 19, 20, 21, 22, 23]
                },
                portraitFrame: 2,
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
                hissatsu: ['FireTornado'],
                RankRHst: ['FireTornado', 'Inazuma1Go'],
                RankSRHst: ['FireTornado', 'Inazuma1Go', 'HeatTackle'],
                RankURHst: ['FireTornado', 'Inazuma1Go', 'HeatTackle', 'InazumaOtoshi'],
                RankLHst: ['FireTornado', 'Inazuma1Go', 'HeatTackle', 'InazumaOtoshi', 'MaximumFire']
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
                headSpriteConfig: {
                    key: 'raimonHead',
                    frames: [24, 25, 26, 27, 28, 29, 30, 31]
                },
                portraitFrame: 3,
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
                hissatsu: ['TheWall'],
                RankRHst: ['TheWall', 'MoguraFeint'],
                RankSRHst: ['TheWall', 'MoguraFeint', 'MegaQuake'],
                RankURHst: ['TheWall', 'MoguraFeint', 'MegaQuake', 'InazumaOtoshi'],
                RankLHst: ['TheWall', 'MoguraFeint', 'MegaQuake',  'InazumaOtoshi', 'SuperArmadillo',]
            }),
          'todIronside': new PlayerStats.Character({
                name: 'Tod Ironside',
                undubName: 'Teppei Kurimatsu',
                TP: 160,
                FP: 180,
                attribute: 'Fire',
                shoot: 60,
                dribble: 80,
                speed: 90,
                strength: 65,
                keeper: 40,
                headSpriteConfig: {
                    key: 'raimonHead',
                    frames: [32, 33, 34, 35, 36, 37, 38, 39]
                },
                portraitFrame: 4,
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
                hissatsu: ['TamanoriPierrot'],
                RankRHst: ['TamanoriPierrot', 'MonkeyTurn'],
                RankSRHst: ['TamanoriPierrot', 'MonkeyTurn', 'SuiseiShot'],
                RankURHst: ['TamanoriPierrot', 'MonkeyTurn', 'SuiseiShot', 'RunBallRun'],
                RankLHst: ['TamanoriPierrot', 'MonkeyTurn', 'SuiseiShot', 'RunBallRun', 'DashAccel']
            }),
          'kevinDragonfly': new PlayerStats.Character({
                name: 'Kevin Dragonfly',
                undubName: 'Ryugo Someoka',
                TP: 160,
                FP: 180,
                attribute: 'Wood',
                shoot: 60,
                dribble: 80,
                speed: 90,
                strength: 65,
                keeper: 40,
                headSpriteConfig: {
                    key: 'raimonHead',
                    frames: [40, 41, 42, 43, 44, 45, 46, 47]
                },
                portraitFrame: 5,
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
                hissatsu: ['DragonCrash'],
                RankRHst: ['DragonCrash', 'ZigZagSpark'],
                RankSRHst: ['DragonCrash', 'ZigZagSpark', 'DragonTornado'],
                RankURHst: ['DragonCrash', 'ZigZagSpark', 'DragonTornado', 'MeganeCrash'],
                RankLHst: ['DragonCrash', 'ZigZagSpark', 'DragonTornado', 'MeganeCrash', 'DragonCannon']
            }),
           'josephKing': new PlayerStats.Character({
                name: 'Joseph King',
                undubName: 'Koujirou Genda',
                TP: 160,
                FP: 180,
                attribute: 'Fire',
                shoot: 60,
                dribble: 80,
                speed: 90,
                strength: 65,
                keeper: 40,
                headSpriteConfig: {
                    key: 'teikokuHead',
                    frames: [0, 1, 2, 3, 4, 5, 6, 7]
                },
                portraitFrame: 6,
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
                hissatsu: ['PowerShield'],
                RankRHst: ['PowerShield', 'FPShield'],
                RankSRHst: ['PowerShield', 'FPShield', 'JudgeThrough'],
                RankURHst: ['PowerShield', 'FPShield', 'JudgeThrough', 'IllusionBall'],
                RankLHst: ['PowerShield', 'FPShield', 'JudgeThrough', 'IllusionBall', 'BeastFang']
            }),
          'judeSharp': new PlayerStats.Character({
                name: 'Jude Sharp',
                undubName: 'Yuuto Kidou',
                TP: 160,
                FP: 180,
                attribute: 'Wind',
                shoot: 60,
                dribble: 80,
                speed: 90,
                strength: 65,
                keeper: 40,
                headSpriteConfig: {
                    key: 'teikokuHead',
                    frames: [8, 9, 10, 11, 12, 13, 14, 15]
                },
                portraitFrame: 8,
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
                hissatsu: ['IllusionBall'],
                RankRHst: ['IllusionBall', 'DeathZone'],
                RankSRHst: ['IllusionBall', 'DeathZone', 'KoteiPenguin2go'],
                RankURHst: ['IllusionBall', 'DeathZone', 'KoteiPenguin2go', 'TwinBoost'],
                RankLHst: ['IllusionBall', 'DeathZone', 'KoteiPenguin2go', 'TwinBoost', 'InazumaBreak']
            }),
          'davidSamford': new PlayerStats.Character({
                name: 'David Samford',
                undubName: 'Jirou Sakuma',
                TP: 160,
                FP: 180,
                attribute: 'Wood',
                shoot: 60,
                dribble: 80,
                speed: 90,
                strength: 65,
                keeper: 40,
                headSpriteConfig: {
                    key: 'teikokuHead',
                    frames: [16, 17, 18, 19, 20, 21, 22, 23]
                },
                portraitFrame: 7,
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
                hissatsu: ['JudgeThrough'],
                RankRHst: ['JudgeThrough', 'KoteiPenguin2go'],
                RankSRHst: ['JudgeThrough', 'KoteiPenguin2go', 'KillerSlide'],
                RankURHst: ['JudgeThrough', 'KoteiPenguin2go', 'KillerSlide', 'DeathZone'],
                RankLHst: ['JudgeThrough', 'KoteiPenguin2go', 'KillerSlide', 'DeathZone', 'KoteiPenguin1go']
            }),
            // Add more players here as needed
        };
    }

}
