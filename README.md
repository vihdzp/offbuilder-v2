
# What is OFFBuilder?
OFFBuilder generates OFF files for convex polytopes from their coordinates. It's meant for use with [Stella](https://www.software3d.com/Stella.php) and [Miratope](https://github.com/OfficialURL/miratope). Runs (mostly) in the browser.

OFFBuilder v.2 is a rework of the original [OFFBuilder v.1](https://github.com/OfficialURL/OFFBuilder). Additions include cross-compatibility and an exposed API for added functionality.

Eventually, OFFBuilder will become a feature of Miratope itself.

## How to use?
To generate an OFF file, you'll have to follow a simple step-by-step process. Steps 1–2 only need to be ran once.

1. Download OFFBuilder and extract the ZIP file.
2. Download [Qhull](http://www.qhull.org/), extract the ZIP file, and copy `qconvex` into its own separate folder. Let's call it `offbuilder`.
3. Run `index.html` to launch the application.
4. Write the coordinates of the polytope into the **Coordinates** field. You can either add a single point, or add the point along with sign changes and permutations of some of its coordinates.
5. When you're done adding the coordinates, click on the Export button. Save the file as `polytope_input.txt` on the same folder you placed `qconvex`. 
6. Run `qconvex` with the following parameters: 
    ```batch
    qconvex C0.00001 -o TI polytope_input.txt TO polytope_output.txt
    ```
    This will generate the `polytope_output.txt` file on the `offbuilder` folder.
7. Import `polytope_output.txt` into OFFBuilder. The resulting file is the OFF file corresponding to the input vertices.
