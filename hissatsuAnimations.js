    hissatsuAnimations = {
        HAnimSDash: (player, onComplete) => {
            const animationDuration = 2000; // 2 seconds
            const text = this.add.text(player.container.x, player.container.y, 'WIND DASH', {
                fontFamily: 'Arial',
                fontSize: '24px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            this.tweens.add({
                targets: text,
                alpha: {
                    from: 1,
                    to: 0.5,
                    yoyo: true,
                    duration: 500,
                    repeat: 3
                },
                y: {
                    from: player.container.y,
                    to: player.container.y - 50,
                    yoyo: true,
                    duration: 1000,
                    repeat: 1
                },
                ease: 'Sine.easeInOut',
                onUpdate: (tween) => {
                    const progress = tween.progress;
                    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                        Phaser.Display.Color.ValueToColor(0xffffff),
                        Phaser.Display.Color.ValueToColor(0x00ff00),
                        100,
                        progress * 100
                    );
                    text.setFill(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
                },
                onComplete: () => {
                    text.destroy();
                    console.log(`Wind Dash animation for ${player.name} completed`);
                    onComplete();
                }
            });
        },
        HAnimFTornado: (player, onComplete) => {
            const animationDuration = 2000; // 2 seconds
            const text = this.add.text(player.container.x, player.container.y, 'FIRE TORNADO', {
                fontFamily: 'Arial',
                fontSize: '24px',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            this.tweens.add({
                targets: text,
                alpha: {
                    from: 1,
                    to: 0.5,
                    yoyo: true,
                    duration: 500,
                    repeat: 3
                },
                y: {
                    from: player.container.y,
                    to: player.container.y - 50,
                    yoyo: true,
                    duration: 1000,
                    repeat: 1
                },
                ease: 'Sine.easeInOut',
                onUpdate: (tween) => {
                    const progress = tween.progress;
                    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                        Phaser.Display.Color.ValueToColor(0xffffff),
                        Phaser.Display.Color.ValueToColor(0xff0000),
                        100,
                        progress * 100
                    );
                    text.setFill(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
                },
                onComplete: () => {
                    text.destroy();
                    console.log(`Fire Tornado animation for ${player.name} completed`);
                    onComplete();
                }
            });
        }
        // Adicione mais animações de Hissatsu aqui conforme necessário
    }
