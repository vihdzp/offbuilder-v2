import Decimal from "../decimal/decimal.js";

const decimal = Decimal.set({
    precision: 25
});

const pi = decimal.acos(-1);
const epsilon = 1e-17;

// Returns cos(2pi * d / n).
export const cos = function(d, n) {
    const res = decimal.cos(pi.times(2 * d).div(n)).toNumber();
    return Math.abs(res) < epsilon ? 0 : res;
}

// Returns sin(2pi * d / n).
export const sin = function(d, n) {
    const res = decimal.sin(pi.times(2 * d).div(n)).toNumber();
    return Math.abs(res) < epsilon ? 0 : res;
}