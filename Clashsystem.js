class ClashSystem {
    constructor(scene) {
        this.scene = scene;
        this.clashActive = false;
        this.clashPlayers = {
            attacker: null,
            defender: null
        };
        this.attackerSelectedOption = null;
        this.defenderSelectedOption = null;
        this.attackerHissatsuOptions = null;
        this.defenderHissatsuOptions = null;
        this.attackerHissatsuOpen = false;
        this.defenderHissatsuOpen = false;
        this.clashPlayerInfoTexts = null;
        this.hissatsuNameText = null;
        this.uiDepth = 1000;
    }

    startClash(attacker, defender) {
        if (!this.clashActive) {
            this.clashActive = true;
            this.clashPlayers = { attacker, defender };
            console.log(`Clash started - Attacker: ${attacker.name}, Defender: ${defender.name}`);
            console.log(`Attacker team: ${attacker.team}, Defender team: ${defender.team}`);
            
            attacker.container.body.setVelocity(0, 0);
            defender.container.body.setVelocity(0, 0);
            
            this.scene.controlledPlayer = null;
            this.scene.hidePlayerDisplay();
            this.createClashOptions();
            this.setClashUIDepth(this.uiDepth);
        }
    }

    createClashOptions() {
        if (!this.clashPlayers || !this.clashPlayers.attacker || !this.clashPlayers.defender) {
            console.error('Clash players not properly set in createClashOptions');
            return;
        }

        const cameraWidth = this.scene.cameras.main.width;
        const cameraHeight = this.scene.cameras.main.height;
        const optionWidth = cameraWidth / 3;
        const optionHeight = 50;
        const homeYPosition = cameraHeight - optionHeight - 10;
        const awayYPosition = 70;

        const attackerOptions = ['Clash_DRB', 'Clash_HST', 'Clash_FNT'];
        const defenderOptions = ['Clash_ST', 'Clash_HST', 'Clash_INT'];

        const homeTeam = this.clashPlayers.attacker.team === 'home' ? 'attacker' : 'defender';
        console.log(`Home team in clash: ${homeTeam}`);
        const awayTeam = homeTeam === 'attacker' ? 'defender' : 'attacker';

        this[`${homeTeam}ClashOptions`] = this.createPlayerOptions(
            homeTeam === 'attacker' ? attackerOptions : defenderOptions,
            optionWidth, optionHeight, homeYPosition, homeTeam, 'home'
        );

        this[`${awayTeam}ClashOptions`] = this.createPlayerOptions(
            awayTeam === 'attacker' ? attackerOptions : defenderOptions,
            optionWidth, optionHeight, awayYPosition, awayTeam, 'away'
        );

        this.displayClashPlayerInfo(this.clashPlayers[homeTeam], this.clashPlayers[awayTeam]);
        this.setClashUIDepth(this.uiDepth);
    }

    createPlayerOptions(options, optionWidth, optionHeight, yPosition, playerRole, team) {
        return options.map((optionId, index) => {
            let buttonWidth = optionWidth - 10;
            let buttonHeight = optionHeight;
            let xPosition = (index * optionWidth) + (optionWidth / 2);

            if (index === 0) {
                xPosition += 50;
            } else if (index === 2) {
                xPosition -= 50;
            }

            let shape;
            if (optionId === 'Clash_HST') {
                const radius = Math.min(buttonHeight, buttonWidth) / 1;
                shape = this.scene.add.circle(xPosition, yPosition, radius, 0x000000, 0.7)
                    .setScrollFactor(0)
                    .setInteractive();
            } else {
                shape = this.scene.add.rectangle(xPosition, yPosition, buttonWidth, buttonHeight, 0x000000, 0.7)
                    .setScrollFactor(0)
                    .setInteractive();
            }

            const localizedText = this.scene.localization[this.scene.language][optionId];
            const text = this.scene.add.text(xPosition, yPosition, localizedText, {
                fontSize: optionId === 'Clash_HST' ? '16px' : '24px',
                fill: '#ffffff'
            }).setOrigin(0.5).setScrollFactor(0);

            shape.on('pointerdown', () => this.handleClashOptionSelection(optionId, playerRole, team));
            shape.on('pointerover', () => shape.setFillStyle(0x444444, 0.7));
            shape.on('pointerout', () => shape.setFillStyle(0x000000, 0.7));

            return { box: shape, text, optionId };
        });
    }

    handleClashOptionSelection(optionId, playerRole, team) {
        const localizedOption = this.scene.localization[this.scene.language][optionId];
        console.log(`${playerRole} (${team} team) selected option: ${localizedOption}`);

        if ((playerRole === 'attacker' && this.attackerSelectedOption) ||
            (playerRole === 'defender' && this.defenderSelectedOption)) {
            console.log(`${playerRole} has already made a selection. Cannot change.`);
            return;
        }

        if (optionId === 'Clash_HST') {
            this.toggleHissatsuOptions(playerRole, team);
        } else {
            if (playerRole === 'attacker') {
                this.attackerSelectedOption = optionId;
                this.scene.showConfirmationIcon(this.clashPlayers.attacker);
                this.disableClashOptions('attacker');
            } else {
                this.defenderSelectedOption = optionId;
                this.scene.showConfirmationIcon(this.clashPlayers.defender);
                this.disableClashOptions('defender');
            }

            this.closeHissatsuOptions(playerRole);

            if (this.attackerSelectedOption && this.defenderSelectedOption) {
                console.log('Both players have selected. Resolving clash...');
                this.scene.time.delayedCall(1000, () => {
                    this.resolveClash(this.attackerSelectedOption, this.defenderSelectedOption);
                });
            }
        }
    }

    toggleHissatsuOptions(playerRole, team) {
        const isHissatsuOpen = playerRole === 'attacker' ? this.attackerHissatsuOpen : this.defenderHissatsuOpen;
        if (isHissatsuOpen) {
            this.closeHissatsuOptions(playerRole);
        } else {
            this.openHissatsuOptions(playerRole, team);
        }
    }

    openHissatsuOptions(playerRole, team) {
        const cameraWidth = this.cameras.main.width;
        const cameraHeight = this.cameras.main.height;
        const optionWidth = 250;
        const optionHeight = 40;
        const spacing = 10;
        const player = playerRole === 'attacker' ? this.clashPlayers.attacker : this.clashPlayers.defender;
        const hissatsuOptions = this.playerStats[player.id].Hissatsu;
        let startY;
        let direction;
        if (team === 'home') {
            startY = cameraHeight - 140;
            direction = -1;
        } else {
            startY = this.uiContainer.height + 140;
            direction = 1;
        }
        const newHissatsuOptions = hissatsuOptions.map((hissatsuId, index) => {
            const hissatsu = hissatsuTechniques[hissatsuId];
            if (!hissatsu) {
                console.warn(`Hissatsu technique ${hissatsuId} not found for player ${player.id}`);
                return null; // Skip if hissatsu is not defined
            }
            const optionX = cameraWidth / 2;
            const optionY = startY + (direction * index * (optionHeight + spacing));
            const box = this.add.rectangle(optionX, optionY, optionWidth, optionHeight, 0x000000, 0.7)
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setInteractive();

            const displayName = this.language === 'pt-br' ? hissatsu.Local_Name : (this.nameStyle === 'undub' ? hissatsu.Undub_Name : hissatsu.Name);

            // Create a mask for the text
            const textMask = this.add.graphics().setScrollFactor(0);
            textMask.fillStyle(0x120120);
            textMask.fillRect(optionX - 120, optionY - optionHeight / 2, 200, optionHeight);
            const text = this.add.text(optionX - 120, optionY, displayName, {
                fontSize: '18px',
                fill: '#ffffff',
            }).setOrigin(0, 0.5).setScrollFactor(0);
            text.setMask(textMask.createGeometryMask());

            // Add TP cost text
            const tpCost = this.add.text(optionX + 100, optionY, `${hissatsu.TP_Cost}`, {
                fontSize: '16px',
                fill: '#ffff00'
            }).setOrigin(0.5, 0.5).setScrollFactor(0);

            // Add scrolling animation if text width is greater than 200px
            if (text.width > 200) {
                text.scrollTween = this.tweens.add({
                    targets: text,
                    x: {
                        from: optionX - 120,
                        to: optionX - 120 - (text.width - 200)
                    },
                    duration: 3000,
                    repeat: -1,
                    repeatDelay: 1000, // Add a 1-second delay before repeating
                    ease: 'Linear',
                    onRepeat: () => {
                        text.x = optionX - 120;
                    }
                });
            }
            box.on('pointerdown', () => this.handleHissatsuSelection(hissatsuId, playerRole, team));
            box.on('pointerover', () => box.setFillStyle(0x444444, 0.7));
            box.on('pointerout', () => box.setFillStyle(0x000000, 0.7));
            return {
                box,
                text,
                tpCost,
                textMask
            };
        }).filter(option => option !== null); // Remove any null options
        if (playerRole === 'attacker') {
            this.attackerHissatsuOptions = newHissatsuOptions;
            this.attackerHissatsuOpen = true;
        } else {
            this.defenderHissatsuOptions = newHissatsuOptions;
            this.defenderHissatsuOpen = true;
        }
    }

    closeHissatsuOptions(playerRole) {
        const options = playerRole === 'attacker' ? this.attackerHissatsuOptions : this.defenderHissatsuOptions;
        if (options) {
            options.forEach(option => {
                option.box.destroy();
                option.text.destroy();
                option.tpCost.destroy();
                option.textMask.destroy();
                if (option.text.scrollTween) {
                    option.text.scrollTween.stop();
                    option.text.scrollTween.remove();
                }
            });
            if (playerRole === 'attacker') {
                this.attackerHissatsuOptions = null;
                this.attackerHissatsuOpen = false;
            } else {
                this.defenderHissatsuOptions = null;
                this.defenderHissatsuOpen = false;
            }
        }
    }

    resolveClash(attackerOption, defenderOption) {
        console.log(`Resolving clash: Attacker chose ${attackerOption}, Defender chose ${defenderOption}`);
        
        const attacker = this.clashPlayers.attacker;
        const defender = this.clashPlayers.defender;
        
        if (!attacker || !defender) {
            console.error('Attacker or defender is undefined in resolveClash');
            return;
        }

        const attackerStats = this.scene.playerStats[attacker.id];
        const defenderStats = this.scene.playerStats[defender.id];
        
        if (!attackerStats || !defenderStats) {
            console.error('Player stats not found');
            return;
        }

        let attackerAttribute = attackerStats.Dribble;
        let defenderAttribute = defenderStats.Strength;
        let attackerHissatsuPower = 0, defenderHissatsuPower = 0;

        const isAttackerHissatsu = attackerOption.startsWith('Hissatsu_');
        const isDefenderHissatsu = defenderOption.startsWith('Hissatsu_');

        if (isAttackerHissatsu) {
            const hissatsuId = attackerOption.split('_')[1];
            const hissatsu = this.scene.hissatsuTechniques[hissatsuId];
            if (hissatsu) {
                attackerHissatsuPower = hissatsu.Power;
                console.log(`Attacker used Hissatsu: ${hissatsu.Name}, Power: ${hissatsu.Power}`);
            }
        }

        if (isDefenderHissatsu) {
            const hissatsuId = defenderOption.split('_')[1];
            const hissatsu = this.scene.hissatsuTechniques[hissatsuId];
            if (hissatsu) {
                defenderHissatsuPower = hissatsu.Power;
                console.log(`Defender used Hissatsu: ${hissatsu.Name}, Power: ${hissatsu.Power}`);
            }
        }

        let attackerBonus = 1;
        let defenderBonus = 1;

        if (!isAttackerHissatsu && !isDefenderHissatsu) {
            const leftSide = ['Clash_ST', 'Clash_DRB'];
            const rightSide = ['Clash_INT', 'Clash_FNT'];
            const attackerSide = leftSide.includes(attackerOption) ? 'left' : 'right';
            const defenderSide = leftSide.includes(defenderOption) ? 'left' : 'right';

            if (attackerSide !== defenderSide) {
                attackerBonus *= 1.15;
                console.log(`Attacker chose ${attackerSide}, Defender chose ${defenderSide}. Attacker gets 15% bonus.`);
            } else {
                defenderBonus *= 1.15;
                console.log(`Attacker chose ${attackerSide}, Defender chose ${defenderSide}. Defender gets 15% bonus.`);
            }
        }

        const finalAttackerAttribute = (attackerAttribute + attackerHissatsuPower) * attackerBonus;
        const finalDefenderAttribute = (defenderAttribute + defenderHissatsuPower) * defenderBonus;

        console.log(`Attacker final Dribble: ${finalAttackerAttribute.toFixed(2)}`);
        console.log(`Defender final Strength: ${finalDefenderAttribute.toFixed(2)}`);

        let outcome;
        if (finalAttackerAttribute > finalDefenderAttribute) {
            outcome = 'attacker';
        } else if (finalDefenderAttribute > finalAttackerAttribute) {
            outcome = 'defender';
        } else {
            outcome = Math.random() < 0.5 ? 'attacker' : 'defender';
        }

        console.log(`Clash outcome: ${outcome} wins`);

        this.playHissatsuAnimations(isAttackerHissatsu ? attackerOption : null, isDefenderHissatsu ? defenderOption : null)
            .then(() => {
                this.handleClashOutcome(outcome);
            });
    }

    playHissatsuAnimations(attackerHissatsu, defenderHissatsu) {
        return new Promise((resolve) => {
            let animationsCompleted = 0;
            const totalAnimations = (attackerHissatsu ? 1 : 0) + (defenderHissatsu ? 1 : 0);
            const checkCompletion = () => {
                animationsCompleted++;
                if (animationsCompleted === totalAnimations) {
                    resolve();
                }
            };

            if (attackerHissatsu) {
                const hissatsuId = attackerHissatsu.split('_')[1];
                this.scene.playHissatsuAnimation(this.clashPlayers.attacker, hissatsuId, checkCompletion);
            }
            if (defenderHissatsu) {
                const hissatsuId = defenderHissatsu.split('_')[1];
                this.scene.playHissatsuAnimation(this.clashPlayers.defender, hissatsuId, checkCompletion);
            }

            if (totalAnimations === 0) {
                resolve();
            }
        });
    }

    handleClashOutcome(outcome) {
        if (!this.clashPlayers || !this.clashPlayers.attacker || !this.clashPlayers.defender) {
            console.error('Clash players not properly set');
            this.endClash();
            return;
        }

        const { attacker, defender } = this.clashPlayers;

        if (outcome === 'attacker') {
            console.log('Attacker successfully keeps the ball');
            if (attacker) {
                this.scene.playerWithBall = attacker;
                this.scene.positionBallAtPlayerFeet(this.scene.playerWithBall);
                this.scene.setControlledPlayer(attacker);
                if (defender) {
                    this.scene.applyStun(defender);
                }
            } else {
                console.error('Attacker is null in handleClashOutcome');
            }
        } else if (outcome === 'defender') {
            console.log('Defender successfully steals the ball');
            if (defender) {
                this.scene.playerWithBall = defender;
                this.scene.positionBallAtPlayerFeet(this.scene.playerWithBall);
                this.scene.setControlledPlayer(defender);
                if (attacker) {
                    this.scene.applyStun(attacker);
                }
            } else {
                console.error('Defender is null in handleClashOutcome');
            }
        }

        this.scene.time.delayedCall(100, () => {
            this.endClash();
        });
    }

    endClash() {
        if (!this.clashActive) {
            console.log('Clash is already inactive');
            return;
        }

        console.log('Ending clash...');
        this.clashActive = false;

        this.scene.hideConfirmationIcons();

        if (this.clashPlayers) {
            if (this.clashPlayers.attacker && this.clashPlayers.attacker.confirmIcon) {
                this.clashPlayers.attacker.confirmIcon.destroy();
                this.clashPlayers.attacker.confirmIcon = null;
            }
            if (this.clashPlayers.defender && this.clashPlayers.defender.confirmIcon) {
                this.clashPlayers.defender.confirmIcon.destroy();
                this.clashPlayers.defender.confirmIcon = null;
            }
        }

        this.clashPlayers = null;
        this.attackerSelectedOption = null;
        this.defenderSelectedOption = null;

        if (this.attackerClashOptions) {
            this.attackerClashOptions.forEach(option => {
                option.box.destroy();
                option.text.destroy();
            });
            this.attackerClashOptions = null;
        }

        if (this.defenderClashOptions) {
            this.defenderClashOptions.forEach(option => {
                option.box.destroy();
                option.text.destroy();
            });
            this.defenderClashOptions = null;
        }

        this.closeHissatsuOptions('attacker');
        this.closeHissatsuOptions('defender');

        this.attackerHissatsuOpen = false;
        this.defenderHissatsuOpen = false;

        if (this.clashPlayerInfoTexts) {
            this.clashPlayerInfoTexts.forEach(text => text.destroy());
            this.clashPlayerInfoTexts = null;
        }

        this.scene.controlledPlayer = this.scene.controlledHomePlayer || this.scene.controlledAwayPlayer;
        this.scene.createPlayerDisplay();

        console.log('Clash ended');
    }

    setClashUIDepth(depth) {
        if (this.attackerClashOptions) {
            this.attackerClashOptions.forEach(option => {
                option.box.setDepth(depth);
                option.text.setDepth(depth + 1);
            });
        }

        if (this.defenderClashOptions) {
            this.defenderClashOptions.forEach(option => {
                option.box.setDepth(depth);
                option.text.setDepth(depth + 1);
            });
        }

        if (this.clashPlayerInfoTexts) {
            this.clashPlayerInfoTexts.forEach(text => text.setDepth(depth + 1));
        }

        if (this.attackerHissatsuOptions) {
            this.attackerHissatsuOptions.forEach(option => {
                option.box.setDepth(depth + 2);
                option.text.setDepth(depth + 3);
                option.tpCost.setDepth(depth + 3);
            });
        }

        if (this.defenderHissatsuOptions) {
            this.defenderHissatsuOptions.forEach(option => {
                option.box.setDepth(depth + 2);
                option.text.setDepth(depth + 3);
                option.tpCost.setDepth(depth + 3);
            });
        }
    }

    displayClashPlayerInfo(homePlayer, awayPlayer) {
        const cameraWidth = this.scene.cameras.main.width;
        const cameraHeight = this.scene.cameras.main.height;

        const homePlayerName = this.scene.add.text(20, cameraHeight / 2, homePlayer.name, {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0.5).setScrollFactor(0);

        const homePlayerAttribute = this.getRelevantAttribute(homePlayer);
        const homeAttributeText = this.scene.add.text(20, cameraHeight / 2 + 30, `${homePlayerAttribute.name}: ${homePlayerAttribute.value}`, {
            fontSize: '20px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0, 0.5).setScrollFactor(0);

        const awayPlayerName = this.scene.add.text(cameraWidth - 20, cameraHeight / 2, awayPlayer.name, {
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0.5).setScrollFactor(0);

        const awayPlayerAttribute = this.getRelevantAttribute(awayPlayer);
        const awayAttributeText = this.scene.add.text(cameraWidth - 20, cameraHeight / 2 + 30, `${awayPlayerAttribute.name}: ${awayPlayerAttribute.value}`, {
            fontSize: '20px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0.5).setScrollFactor(0);

        this.scene.uiContainer.add([homePlayerName, homeAttributeText, awayPlayerName, awayAttributeText]);
        this.clashPlayerInfoTexts = [homePlayerName, homeAttributeText, awayPlayerName, awayAttributeText];
    }

    getRelevantAttribute(player) {
        const stats = this.scene.playerStats[player.id];
        if (player === this.clashPlayers.attacker) {
            return { name: 'Dribble', value: stats.Dribble };
        } else {
            return { name: 'Strength', value: stats.Strength };
        }
    }

    disableClashOptions(playerRole) {
        const options = playerRole === 'attacker' ? this.attackerClashOptions : this.defenderClashOptions;
        options.forEach(option => {
            option.box.disableInteractive();
            option.box.setFillStyle(0x666666);
        });
    }
}
