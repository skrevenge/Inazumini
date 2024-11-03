class PlayerMovementManager {
    constructor(scene) {
        this.scene = scene;
    }

    movePlayer(player, velocityX, velocityY) {
        if (player.isPassingBall || player.isStunned) {
            player.container.body.setVelocity(0, 0);
            this.stopPlayer(player, player.lastDirection);
            return {
                direction: player.lastDirection,
                velocityX: 0,
                velocityY: 0
            };
        }

        const speed = this.scene.playerStats[player.id]?.Speed || 75;

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            const normalizedVector = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
            velocityX = normalizedVector.x * speed;
            velocityY = normalizedVector.y * speed;
        } else {
            velocityX *= speed;
            velocityY *= speed;
        }

        // Calculate new position
        const newX = player.container.x + velocityX * this.scene.sys.game.loop.delta / 1000;
        const newY = player.container.y + velocityY * this.scene.sys.game.loop.delta / 1000;

        // Clamp position within world bounds
        const clampedX = Phaser.Math.Clamp(newX, 0, this.scene.physics.world.bounds.width);
        const clampedY = Phaser.Math.Clamp(newY, 0, this.scene.physics.world.bounds.height);

        // Update player position
        player.container.x = clampedX;
        player.container.y = clampedY;

        // Update player's physics body velocity and position
        player.container.body.setVelocity(velocityX, velocityY);
        player.container.body.updateFromGameObject();

        // Get the new direction based on velocity
        const direction = this.getPlayerDirection(player);

        // Store the last direction
        player.lastDirection = direction;

        return {
            direction: direction !== undefined ? direction : (player.lastDirection || 0),
            velocityX,
            velocityY
        };
    }

    updatePlayerAnimation(player) {
        if (!player || !player.body || !player.container || !player.container.body) {
            console.error('Player, player body, or container is undefined in updatePlayerAnimation');
            return;
        }

        const direction = this.getPlayerDirection(player);
        const isMoving = this.isPlayerMoving(player);
        this.scene.animationManager.updatePlayerAnimation(player, isMoving, direction);
        this.updateFacePosition(player, direction);
        player.lastDirection = direction;

        // Adjust player depth based on Y position
        this.updatePlayerDepth(player);

        // Update the player's shadow after the animation
        this.updatePlayerShadow(player);
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
        let direction = player.lastDirection || 0;

        if (vx < 0 && vy < 0) direction = 7; // Up-Left
        else if (vx < 0 && vy === 0) direction = 1; // Left
        else if (vx < 0 && vy > 0) direction = 6; // Down-Left
        else if (vx === 0 && vy < 0) direction = 2; // Up
        else if (vx === 0 && vy > 0) direction = 0; // Down
        else if (vx > 0 && vy < 0) direction = 4; // Up-Right
        else if (vx > 0 && vy === 0) direction = 3; // Right
        else if (vx > 0 && vy > 0) direction = 5; // Down-Right

        return direction;
    }

    stopPlayer(player, direction) {
        this.scene.animationManager.stopPlayerAnimation(player);
        this.scene.animationManager.setStaticTexture(player, direction);
        console.log(`Player ${player.name} stopped, Direction: ${direction}`);
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

    updatePlayerShadow(player) {
        if (!player || !player.container) {
            console.error('Invalid player or player container in updatePlayerShadow');
            return;
        }

        if (!player.shadowContainer) {
            console.warn(`Shadow container not found for player ${player.name}. Creating new shadow.`);
            this.createPlayerShadow(player);
        }

        if (player.shadowContainer && player.shadow) {
            const shadowOffsetY = 13;
            player.shadow.setPosition(0, shadowOffsetY);
            player.shadowContainer.setPosition(player.container.x, player.container.y);

            // Show shadow if the player is visible and either not in animation or specifically involved in the current animation
            const shouldShowShadow = player.container.visible && (player.isInAnimation || !this.isPlayerInAnimation(player));
            player.shadow.setVisible(shouldShowShadow);
            player.shadowContainer.setVisible(shouldShowShadow);

            // Always set shadow depth to be slightly less than the player's depth
            player.shadowContainer.setDepth(player.container.y - 0.1);
        } else {
            console.error(`Shadow or shadow container is still undefined for player ${player.name}`);
        }
    }

    createPlayerShadow(player) {
        if (!player || !player.container) {
            console.error('Invalid player or player container in createPlayerShadow');
            return;
        }

        player.shadowContainer = this.scene.add.container(player.container.x, player.container.y);
        player.shadow = this.scene.add.ellipse(0, 13, 20, 10, 0x000000, 0.3);
        player.shadowContainer.add(player.shadow);
        player.shadowContainer.setDepth(0);
        console.log(`Created new shadow for player ${player.name}`);
    }

    updateAllPlayerShadows() {
        this.scene.allPlayers.forEach(player => {
            this.updatePlayerShadow(player);
        });
    }

    isPlayerInAnimation(player) {
        return player.isInAnimation || false;
    }

    isPlayerRunning(player) {
        const velocityX = player.container.body.velocity.x;
        const velocityY = player.container.body.velocity.y;
        return Math.abs(velocityX) > 10 || Math.abs(velocityY) > 10;
    }

    updatePlayerDepth(player) {
        if (player && player.container) {
            player.container.setDepth(player.container.y);
        }
    }
}
