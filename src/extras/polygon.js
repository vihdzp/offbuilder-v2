import * as math from "../classes/math.js";

export const polygon = function(n) {
    const res = [];

    for(let i = 0; i < n; i++)
        res.push([math.cos(i, n), math.sin(i, n)]);

    return res;
}
globalThis.polygon = polygon;