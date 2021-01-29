import Decimal from "../decimal/decimal.js";

// An instance of the Decimal class, used to evaluate numbers to 25 digits.
// Probably about 20 digits would be enough, but better safe than sorry.
const decimal = Decimal.set({
    precision: 25
});

// Shorthand for 2π.
const tau = decimal.acos(-1).times(2);

/**
 * Evaluates cos(2π * n / d). Is more precise and reliable than the native
 * Math.cos method.
 * 
 * @param {number} n The numerator of the fraction.
 * @param {number} d The denominator of the fraction.
 * @returns {number} cos(2π * n / d).
 */
export const cos = function(n, c) {
    const res = decimal.cos(tau.times(n).div(d)).toNumber();
    return Math.abs(res) < Number.EPSILON ? 0 : res;
}

/**
 * Evaluates sin(2π * n / d). Is more precise and reliable than the native
 * Math.sin method.
 * 
 * @param {number} n The numerator of the fraction.
 * @param {number} d The denominator of the fraction.
 * @returns {number} sin(2π * n / d).
 */
export const sin = function(n, c) {
    const res = decimal.sin(tau.times(n).div(d)).toNumber();
    return Math.abs(res) < Number.EPSILON ? 0 : res;
}