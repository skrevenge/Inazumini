class PlayerSpritePositioner {
    constructor() {
        this.positionHandlers = {
            'KidouY': this.positionKidouY,
            'KazemaruI': this.positionKazemaruI,
            'Aphrodi': this.positionAphrodi,
            'GouenjiS': this.positionGouenjiS,
            'GendaK': this.positionGendaK,
            'SakumaJ': this.positionSakumaJ,
            'FubukiS': this.positionFubukiS,
            'Gran': this.positionGran
        };
    }

    updateFacePosition(player, direction, isMoving) {
        let faceOffsetX = 0;
        let faceOffsetY = -7; // Face is always slightly above the body

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
            faceOffsetY = -8; // Slightly higher for upward directions
        }

        // Apply character-specific adjustments
        if (this.positionHandlers[player.id]) {
            const specificAdjustments = this.positionHandlers[player.id](direction);
            faceOffsetX += specificAdjustments.x || 0;
            faceOffsetY += specificAdjustments.y || 0;
        }

        return { x: faceOffsetX, y: faceOffsetY };
    }

    // Character-specific positioning methods
    positionKidouY(direction) {
        if (direction === 1) return { x: 3 };
        if (direction === 3) return { x: -3 };
        return {};
    }

    positionKazemaruI(direction) {
        if (direction === 1) return { x: 2 };
        if (direction === 3) return { x: -2 };
        return {};
    }

    positionAphrodi(direction) {
        let adjustment = { y: 2 };
        if (direction === 4) adjustment.x = -2;
        if (direction === 7) adjustment.x = 2;
        return adjustment;
    }

    positionGouenjiS(direction) {
        if (direction === 3) return { x: -2 };
        return {};
    }

    positionGendaK(direction) {
        if (direction === 0) return { x: -2 };
        if (direction === 2) return { x: 2 };
        return {};
    }

    positionSakumaJ() {
        return { y: 2 };
    }

    positionFubukiS(direction) {
        switch (direction) {
            case 1: return { x: 2 };
            case 3: return { x: -2 };
            case 5: return { x: -2 };
            case 6: return { x: 2 };
            case 7: return { x: 1 };
            case 4: return { x: -1 };
            default: return {};
        }
    }

    positionGran(direction) {
        if (direction === 1) return { x: 2 };
        if (direction === 3) return { x: -2 };
        return {};
    }
}
