# What is OFFBuilder?
[OFFBuilder](https://vihdzp.github.io/offbuilder-v2/) generates OFF files for convex polytopes from their coordinates. It\'s meant for use with [Stella](https://www.software3d.com/Stella.php) and [Miratope](https://github.com/vihdzp/miratope-rs). Runs (mostly) in the browser.

OFFBuilder v.2 is a rework of the original [OFFBuilder v.1](https://github.com/vihdzp/OFFBuilder). It\'s meant to be compatible with all platforms and to be more extensible than the original software.

## How to use?
To generate an OFF file, you'll have to follow a simple step-by-step process. Steps 1–2 only need to be ran once.

1. Open OFFBuilder from its [website](https://vihdzp.github.io/offbuilder-v2/).
2. Download [Qhull](http://www.qhull.org/), extract the ZIP file, and copy `qconvex` into its own separate folder. Let\'s call it `offbuilder`.
3. Write the coordinates of the polytope into the **Coordinates** field. You can either add a single point, or add the point along with sign changes and permutations of some of its coordinates. Alternatively, you can use the API to add coordinates programmatically: see below.
4. When you\'re done adding the coordinates, click on the Export button. Save the file as `polytope_input.txt` on the same folder you placed `qconvex`. 
5. Run `qconvex` with the following parameters:
    ```batch
    qconvex.exe C0.00001 -o TI polytope_input.txt TO polytope_output.txt
	```
    This will generate the `polytope_output.txt` file on the `offbuilder` folder.
6. Import `polytope_output.txt` into OFFBuilder. The resulting file is the OFF file corresponding to the input vertices.

## OFFBuilder API

If you want to add a more complicated set of coordinates, OFFBuilder provides a **Code** textbox where you can run code and input coordinates manually. You can enter any JavaScript code and run it by pressing Ctrl + Enter. For instance, you can declare auxiliary variables for the coordinates by writing
```js
this.variable_name = value;
```
on the code field. These can then be called simply by their variable name.

The coordinate field is encapsulated by the `coordinates` object. It provides two methods to append coordinates: `push`, which adds them directly, and `add`, which also applies any sign changes and permutations to them. Both methods take either points (that is, numerical arrays), or arrays of points.

```js
// Adds the point (1, 2).
coordinates.push([1, 2]);

// Adds the points (3, 4) and (5, 6), applies permutations and sign changes.
coordinates.add([[3, 4], [5, 6]]);
```

There\'s also a few helper methods like `polygon` and `prism` to generate point sets. For their specific documentations, check the source code in the `extras` folder.

## Extend OFFBuilder

If the existing methods aren\'t enough for you, you can always extend OFFBuilder\'s functionality. To do this, add a file with your code on the `extras` folder. You should write it as a module so that other parts of the code can access it if necessary, but add the functions to the global namespace so that the end user can access it too. Here\'s a simple example:

```js
// extras/square.js

/**
 * Builds a square with a given side.
 *
 * @param {number} side The side length of the square.
 * @returns {Point[]} The array of the square's vertices.
 */
export const square = function(side) {
	const x = side / 2;
	return [[x, x], [x, -x], [-x, x], [-x, -x]];
}
globalThis.square = square;
```

To have your code actually plugged into the main application, add the corresponding import to `main.js`. In this example, this would be:

```js
import "./extras/square.js";
```

If your extension has the potential to be useful to other users, be sure to add it to the repository.

## Credits
The core application was coded by @vihdzp. As dependencies, it uses [ace.js](https://github.com/ajaxorg/ace), [decimal.js](https://github.com/MikeMcl/decimal.js/), and [svd.js](https://github.com/danilosalvati/svd-js), all under the MIT license.
