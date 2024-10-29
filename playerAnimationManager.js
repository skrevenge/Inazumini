class PlayerAnimationManager {
    constructor(scene) {
        this.scene = scene;
    }

    createAnimations() {
        // Create run down animation for home team
        this.scene.anims.create({
            key: 'run_down_home',
            frames: this.scene.anims.generateFrameNumbers('frontal_run', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create run down animation for away team
        this.scene.anims.create({
            key: 'run_down_away',
            frames: this.scene.anims.generateFrameNumbers('frontal_run_R_goal', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create run up animation for home team
        this.scene.anims.create({
            key: 'run_up_home',
            frames: this.scene.anims.generateFrameNumbers('back_run', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create run up animation for away team
        this.scene.anims.create({
            key: 'run_up_away',
            frames: this.scene.anims.generateFrameNumbers('back_run_R_goal', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create run left animation for home team
        this.scene.anims.create({
            key: 'run_left_home',
            frames: this.scene.anims.generateFrameNumbers('run_left', {
                start: 0,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create run left animation for away team
        this.scene.anims.create({
            key: 'run_left_away',
            frames: this.scene.anims.generateFrameNumbers('run_left_R_goal', {
                start: 0,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create run right animation for away team (flipped version of run left)
        this.scene.anims.create({
            key: 'run_right_away',
            frames: this.scene.anims.generateFrameNumbers('run_left_R_goal', {
                start: 0,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });

        // Set the flipX property for the 'run_right_away' animation
        this.scene.anims.get('run_right_away').frames.forEach(frame => {
            frame.flipX = true;
        });

        // Create run up-left animation for home team
        this.scene.anims.create({
            key: 'run_up_left_home',
            frames: this.scene.anims.generateFrameNumbers('up_left_run', {
                start: 0,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create run up-left animation for away team
        this.scene.anims.create({
            key: 'run_up_left_away',
            frames: this.scene.anims.generateFrameNumbers('up_left_run_R_goal', {
                start: 0,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create run down-left animation
        this.scene.anims.create({
            key: 'run_down_left',
            frames: this.scene.anims.generateFrameNumbers('down_left_run', {
                start: 0,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });

        // Create run down-left animation for away team
        this.scene.anims.create({
            key: 'run_down_left_away',
            frames: this.scene.anims.generateFrameNumbers('down_left_R_goal', {
                start: 0,
                end: 7
            }),
            frameRate: 10,
            repeat: -1
        });
    }

    setStaticTexture(player, direction) {
        if (player && player.body) {
            try {
                // Map direction to correct frame
                const frameMap = {
                    0: 0, // Down
                    1: 1, // Left
                    2: 2, // Up
                    3: 3, // Right
                    4: 4, // Up-Right
                    5: 5, // Down-Right
                    6: 6, // Down-Left
                    7: 7 // Up-Left
                };
                const frame = frameMap[direction];
                const bodySprite = player.team === 'home' ? 'raimon_body' : 'raimon_body_goal';
                player.body.setTexture(bodySprite, frame);
                player.face.setFrame(frame);
                player.body.setFlipX(false);
                player.face.setFlipX(false);
            } catch (error) {
                console.error(`Error setting static texture for player ${player.name}:`, error);
            }
        } else {
            console.error('Unable to set static texture: player or player body is undefined');
        }
    }

    updatePlayerAnimation(player, isMoving, direction) {
        if (!player || !player.body || !player.container || !player.container.body) {
            console.error('Player, player body, or container is undefined in updatePlayerAnimation');
            return;
        }

        if (player.isKicking) {
            // If the player is kicking, maintain the kick frame
            return;
        }

        const teamSuffix = player.team === 'home' ? 'home' : 'away';

        if (isMoving) {
            switch (direction) {
                case 0: // Down
                    player.body.play(`run_down_${teamSuffix}`, true);
                    player.body.setFlipX(false);
                    break;
                case 2: // Up
                    player.body.play(`run_up_${teamSuffix}`, true);
                    player.body.setFlipX(false);
                    break;
                case 1: // Left
                    player.body.play(`run_left_${teamSuffix}`, true);
                    player.body.setFlipX(false);
                    break;
                case 3: // Right
                    if (teamSuffix === 'away') {
                        player.body.play('run_right_away', true);
                        player.body.setFlipX(true);
                    } else {
                        player.body.play('run_left_home', true);
                        player.body.setFlipX(true);
                    }
                    break;
                case 7: // Up-Left
                    player.body.play(`run_up_left_${teamSuffix}`, true);
                    player.body.setFlipX(false);
                    break;
                case 4: // Up-Right
                    if (teamSuffix === 'away') {
                        player.body.play('run_up_left_away', true);
                        player.body.setFlipX(true);
                    } else {
                        player.body.play('run_up_left_home', true);
                        player.body.setFlipX(true);
                    }
                    break;
                case 6: // Down-Left
                    player.body.play(teamSuffix === 'away' ? 'run_down_left_away' : 'run_down_left', true);
                    player.body.setFlipX(false);
                    break;
                case 5: // Down-Right
                    if (teamSuffix === 'away') {
                        player.body.play('run_down_left_away', true);
                        player.body.setFlipX(true);
                    } else {
                        player.body.play('run_down_left', true);
                        player.body.setFlipX(true);
                    }
                    break;
                default:
                    this.setStaticTexture(player, direction);
                    break;
            }
        } else {
            this.setStaticTexture(player, direction);
        }

        player.face.setFrame(direction);
    }

    stopPlayerAnimation(player) {
        if (player && player.body) {
            player.body.anims.stop();
            this.setStaticTexture(player, player.lastDirection);
        }
    }
}
