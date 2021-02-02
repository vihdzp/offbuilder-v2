import * as math from "../classes/math.js";

const neg = x => -x;

export const tetswirl = function(n) {
    const coords = [];

    for(let k = 0; k < n; k++) {
        const cos1 = math.cos(k, 2 * n),
            sin1 = math.sin(k, 2 * n);

        const c = [0, 0, sin1, cos1];
        coords.push(c, c.map(neg));
        
        const k1 = Math.sqrt(6) / 3, k2 = Math.sqrt(3) / 3;
        for(let i = 0; i < 3; i++) {
            const cos2 = math.cos(3 * k + i * 2 * n, 6 * n),
                sin2 = math.sin(3 * k + i * 2 * n, 6 * n);

            const c = [k1 * cos2, k1 * sin2, k2 * cos1, k2 * sin1];
            coords.push(c, c.map(neg));
        }
    }

    return coords;
}
globalThis.tetswirl = tetswirl;

/*export const cubeswirl = function(n) {
    const coords = [];

    for(let k = 0; k < 2 * n; k++) {
        
    }
}*/