class PlayerAnimationManager {
    constructor(scene) {
        this.scene = scene;
    }

    createAnimations() {
        this.createRunAnimations('home');
        this.createRunAnimations('away');
    }

    createRunAnimations(team) {
        const teamSuffix = team === 'home' ? '' : '_R_goal';
        const directions = ['down', 'up', 'left'];

        directions.forEach(direction => {
            this.scene.anims.create({
                key: `run_${direction}_${team}`,
                frames: this.scene.anims.generateFrameNumbers(`${direction === 'left' ? 'run_left' : direction === 'up' ? 'back_run' : 'frontal_run'}${teamSuffix}`, { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
        });

        // Special case for right direction
        if (team === 'away') {
            this.scene.anims.create({
                key: 'run_right_away',
                frames: this.scene.anims.generateFrameNumbers('run_left_R_goal', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
            this.scene.anims.get('run_right_away').frames.forEach(frame => {
                frame.flipX = true;
            });
        }

        // Diagonal animations
        ['up_left', 'down_left'].forEach(direction => {
            this.scene.anims.create({
                key: `run_${direction}_${team}`,
                frames: this.scene.anims.generateFrameNumbers(`${direction}_run${teamSuffix}`, { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        });

        if (team === 'away') {
            this.scene.anims.create({
                key: 'run_up_right_away',
                frames: this.scene.anims.generateFrameNumbers('up_left_run_R_goal', { start: 0, end: 7 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }

    updatePlayerAnimation(player) {
        if (!player || !player.body || !player.container || !player.container.body) {
            console.error('Player, player body, or container is undefined in updatePlayerAnimation');
            return;
        }
        const direction = this.getPlayerDirection(player);
        const isMoving = this.isPlayerMoving(player) && !this.collideMenuActive;

        if (player.isKicking) {
            // If the player is kicking, maintain the kick frame
            return;
        }
        if (isMoving) {
            const teamSuffix = player.team === 'home' ? 'home' : 'away';
            let animationKey;
            let flipX = false;

            switch(direction) {
                case 0: animationKey = `run_down_${teamSuffix}`; break;
                case 1: animationKey = `run_left_${teamSuffix}`; break;
                case 2: anim ationKey = `run_up_${teamSuffix}`; break;
                case 3: animationKey = `run_right_${teamSuffix}`; flipX = true; break;
                case 4: animationKey = `run_up_right_${teamSuffix}`; flipX = true; break;
                case 5: animationKey = `run_down_right_${teamSuffix}`; flipX = true; break;
                case 6: animationKey = `run_down_left_${teamSuffix}`; break;
                case 7: animationKey = `run_up_left_${teamSuffix}`; break;
                default: animationKey = `run_down_${teamSuffix}`; // Default to down animation
            }

            player.body.play(animationKey, true);
            player.body.setFlipX(flipX);
        } else {
            // Use static frames when not moving
            this.setStaticTexture(player, direction);
        }
        
        player.face.setFrame(direction);
        this.updateFacePosition(player, direction);
        player.lastDirection = direction;
        
        // Adjust depth when player is facing or moving upwards
        if (direction === 2 || direction === 4 || direction === 7) {
            player.container.setDepth(this.ballContainer.depth + 1);
        } else {
            player.container.setDepth(1); // Reset to default depth
        }
    }
    playRunningAnimation(player, direction) {
        const teamSuffix = player.team === 'home' ? 'home' : 'away';
        const animKey = this.getRunningAnimationKey(direction, teamSuffix);
        
        player.body.play(animKey, true);
        player.body.setFlipX(this.shouldFlipAnimation(direction, teamSuffix));
    }

    getRunningAnimationKey(direction, teamSuffix) {
        const directionMap = {
            0: 'down', 1: 'left', 2: 'up', 3: 'right',
            4: 'up_right', 5: 'down_right', 6: 'down_left', 7: 'up_left'
        };
        return `run_${directionMap[direction]}_${teamSuffix}`;
    }

    shouldFlipAnimation(direction, teamSuffix) {
        return (direction === 3 && teamSuffix === 'home') || 
               (direction === 4 && teamSuffix === 'home') ||
               (direction === 5);
    }

    setStaticTexture(player, direction) {
        if (player && player.body) {
            const frameMap = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7 };
            const bodySprite = player.team === 'home' ? 'raimon_body' : 'raimon_body_goal';
            player.body.setTexture(bodySprite, frameMap[direction]);
            player.face.setFrame(frameMap[direction]);
            player.body.setFlipX(false);
            player.face.setFlipX(false);
        } else {
            console.error('Unable to set static texture: player or player body is undefined');
        }
    }

    updateFacePosition(player, direction) {
        if (!this.scene.playerSpritePositioner) {
            console.error('PlayerSpritePositioner is not initialized.');
            return;
        }
        const isMoving = this.isPlayerMoving(player);
        const { x: faceOffsetX, y: faceOffsetY } = this.scene.playerSpritePositioner.updateFacePosition(player, direction, isMoving);
        player.face.setPosition(faceOffsetX, faceOffsetY);
    }

    isPlayerMoving(player) {
        if (!player || !player.container || !player.container.body) {
            console.error('Invalid player object in isPlayerMoving');
            return false;
        }
        return Math.abs(player.container.body.velocity.x) > 1 || Math.abs(player.container.body.velocity.y) > 1;
    }

    getPlayerDirection(player) {
        if (!player || !player.container || !player.container.body) {
            console.error('Invalid player object in getPlayerDirection');
            return player.lastDirection || 0;
        }
        const vx = player.container.body.velocity.x;
        const vy = player.container.body.velocity.y;
        if (vx < 0 && vy < 0) return 7;      // Up-Left
        else if (vx < 0 && vy === 0) return 1; // Left
        else if (vx < 0 && vy > 0) return 6;   // Down-Left
        else if (vx === 0 && vy < 0) return 2; // Up
        else if (vx === 0 && vy > 0) return 0; // Down
        else if (vx > 0 && vy < 0) return 4;   // Up-Right
        else if (vx > 0 && vy === 0) return 3; // Right
        else if (vx > 0 && vy > 0) return 5;   // Down-Right
        return player.lastDirection || 0;
    }

    stopPlayerAnimation(player) {
        if (player && player.body) {
            player.body.anims.stop();
            this.setStaticTexture(player, player.lastDirection);
        }
    }
}
