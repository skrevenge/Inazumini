class MovementManager {
    constructor(scene) {
        this.scene = scene;
    }

    movePlayer(player, keys) {
        if (player.isPassingBall || this.scene.collideMenuActive || player.isStunned) {
            player.container.body.setVelocity(0, 0);
            this.stopPlayerAnimation(player);
            return {
                direction: player.lastDirection,
                velocityX: 0,
                velocityY: 0
            };
        }

        let velocityX = 0;
        let velocityY = 0;
        const speed = this.scene.playerStats[player.id]?.Speed || 75;

        if (keys.left.isDown) {
            velocityX = -speed;
        } else if (keys.right.isDown) {
            velocityX = speed;
        }

        if (keys.up.isDown) {
            velocityY = -speed;
        } else if (keys.down.isDown) {
            velocityY = speed;
        }

        // Normalize diagonal movement
        if (velocityX !== 0 && velocityY !== 0) {
            const normalizedVector = new Phaser.Math.Vector2(velocityX, velocityY).normalize();
            velocityX = normalizedVector.x * speed;
            velocityY = normalizedVector.y * speed;
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
            return;
        }

        const direction = this.getPlayerDirection(player);
        const isMoving = this.isPlayerMoving(player) && !this.scene.collideMenuActive;

        if (isMoving) {
            const teamSuffix = player.team === 'home' ? 'home' : 'away';
            if (direction === 0) {
                player.body.play(`run_down_${teamSuffix}`, true);
                player.body.setFlipX(false);
            } else if (direction === 2) {
                player.body.play(`run_up_${teamSuffix}`, true);
                player.body.setFlipX(false);
            } else if (direction === 1) {
                player.body.play(`run_left_${teamSuffix}`, true);
                player.body.setFlipX(false);
            } else if (direction === 3) {
                if (teamSuffix === 'away') {
                    player.body.play('run_right_away', true);
                    player.body.setFlipX(true);
                } else {
                    player.body.play('run_left_home', true);
                    player.body.setFlipX(true);
                }
            } else if (direction === 7) {
                player.body.play(`run_up_left_${teamSuffix}`, true);
                player.body.setFlipX(false);
            } else if (direction === 4) {
                if (teamSuffix === 'away') {
                    player.body.play('run_up_left_away', true);
                    player.body.setFlipX(true);
                } else {
                    player.body.play('run_up_left_home', true);
                    player.body.setFlipX(true);
                }
            } else if (direction === 6) {
                player.body.play(teamSuffix === 'away' ? 'run_down_left_away' : 'run_down_left', true);
                player.body.setFlipX(false);
            } else if (direction === 5) {
                if (teamSuffix === 'away') {
                    player.body.play('run_down_left_away', true);
                    player.body.setFlipX(true);
                } else {
                    player.body.play('run_down_left', true);
                    player.body.setFlipX(true);
                }
            } else {
                this.setStaticTexture(player, direction);
            }
        } else {
            this.setStaticTexture(player, direction);
        }

        player.face.setFrame(direction);
        this.updateFacePosition(player, direction);
        player.lastDirection = direction;

        // Adjust depth when player is facing or moving upwards
        if (direction === 2 || direction === 4 || direction === 7) {
            player.container.setDepth(this.scene.ballContainer.depth + 1);
        } else {
            player.container.setDepth(1); // Reset to default depth
        }
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

    stopPlayerAnimation(player) {
        if (player && player.body) {
            if (player.body.anims) {
                player.body.anims.stop();
            }
            this.setStaticTexture(player, player.lastDirection);
        }
    }

    setStaticTexture(player, direction) {
        if (player && player.body) {
            try {
                const frameMap = {
                    0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7
                };
                const frame = frameMap[direction];
                const bodySprite = player.team === 'home' ? 'raimon_body' : 'raimon_body_goal';
                player.body.setTexture(bodySprite, frame);
                player.face.setFrame(frame);
                player.body.setFlipX(false);
                player.face.setFlipX(false);
            } catch (error) {
                // Error handling without logging
            }
        }
    }

    updateFacePosition(player, direction) {
        let faceOffsetX = 0;
        let faceOffsetY = -7;
        const isMoving = this.isPlayerMoving(player);

        switch (direction) {
            case 0: // Down
                faceOffsetX = isMoving ? 1 : 0;
                break;
            case 1: // Left
            case 6: // Down-Left
            case 7: // Up-Left
                faceOffsetX = -1;
                break;
            case 2: // Up
                faceOffsetX = 1;
                break;
            case 3: // Right
            case 4: // Up-Right
            case 5: // Down-Right
                faceOffsetX = 1;
                break;
        }

        if (direction === 2 || direction === 4 || direction === 7) {
            faceOffsetY = -8;
        }

        // Player-specific adjustments
        if (player.id === 'KidouY') {
            if (direction === 1) faceOffsetX += 3;
            else if (direction === 3) faceOffsetX -= 3;
        } else if (player.id === 'KazemaruI') {
            if (direction === 1) faceOffsetX += 2;
            else if (direction === 3) faceOffsetX -= 2;
        } else if (player.id === 'Aphrodi') {
            faceOffsetY += 2;
            if (direction === 4) faceOffsetX -= 2;
            else if (direction === 7) faceOffsetX += 2;
        } else if (player.id === 'GouenjiS') {
            if (direction === 3) faceOffsetX -= 2;
        } else if (player.id === 'GendaK') {
            if (direction === 0) faceOffsetX -= 2;
            else if (direction === 2) faceOffsetX += 2;
        }

        player.face.setPosition(faceOffsetX, faceOffsetY);
    }

    updatePlayerShadow(player) {
        player.shadowContainer.setPosition(player.container.x, player.container.y);
    }

    updatePlayerNamePosition(player) {
        if (player.nameText) {
            player.nameText.setPosition(0, -40);
        }
    }

    updateBallPosition(playerWithBall, ballContainer) {
        if (!playerWithBall || !playerWithBall.container || !ballContainer || !ballContainer.body) {
            console.error('Invalid player or ball container in updateBallPosition');
            return;
        }

        let offsetX = 0;
        let offsetY = 0;
        const baseOffset = 20;
        const sideYOffset = 10;
        const upwardOffset = -15;
        const isUpwardDirection = [2, 4, 7].includes(playerWithBall.lastDirection);

        switch (playerWithBall.lastDirection) {
            case 0: offsetY = baseOffset; break;
            case 1: offsetX = -baseOffset + 5; offsetY = sideYOffset; break;
            case 2: offsetY = baseOffset + upwardOffset; break;
            case 3: offsetX = baseOffset - 5; offsetY = sideYOffset; break;
            case 4: offsetX = baseOffset * 0.7 - 1.5; offsetY = baseOffset * 0.7 + upwardOffset; break;
            case 5: offsetX = baseOffset * 0.7 - 1.5; offsetY = baseOffset * 0.7; break;
            case 6: offsetX = -baseOffset * 0.7 + 1.5; offsetY = baseOffset * 0.7; break;
            case 7: offsetX = -baseOffset * 0.7 + 1.5; offsetY = baseOffset * 0.7 + upwardOffset; break;
        }

        // Apply bounce effect when player is running
        if (this.isPlayerRunning(playerWithBall)) {
            this.scene.ballBounceTime += this.scene.sys.game.loop.delta;
            let bounceOffset = Math.sin(this.scene.ballBounceTime * 0.01) * 1;
            if (isUpwardDirection) {
                bounceOffset *= -1;
            }
            offsetY += bounceOffset;
        } else {
            this.scene.ballBounceTime = 0;
        }

        const ballX = playerWithBall.container.x + offsetX;
        const ballY = playerWithBall.container.y + offsetY;
        ballContainer.setPosition(ballX, ballY);
        ballContainer.body.setVelocity(0, 0);
    }

    isPlayerRunning(player) {
        const velocityX = player.container.body.velocity.x;
        const velocityY = player.container.body.velocity.y;
        return Math.abs(velocityX) > 10 || Math.abs(velocityY) > 10;
    }

    updateBallPhysics(ballContainer) {
        if (ballContainer && ballContainer.body) {
            const currentVelocity = ballContainer.body.velocity;
            const deceleration = 0.99;
            ballContainer.body.setVelocity(
                currentVelocity.x * deceleration,
                currentVelocity.y * deceleration
            );

            // Apply a small bounce effect
            if (Math.abs(currentVelocity.y) < 1 && ballContainer.y < this.scene.physics.world.bounds.height - 10) {
                ballContainer.body.setVelocityY(-currentVelocity.y * 0.5);
            }
        }
    }
}
