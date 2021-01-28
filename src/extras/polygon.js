export const polygon = function(n) {
    const res = [];
    const alpha = 2 * Math.PI / n;

    for(let i = 0; i < n; i++)
        res.push([Math.cos(alpha * i), Math.sin(alpha * i)]);

    return res;
}
globalThis.polygon = polygon;