# OFFBuilder
Generates OFF files for convex polytopes from their coordinates. Runs (mostly) in the browser.

## How to use?
Once you've used the program to generate and export the coordinates of a polytope, run `qconvex` with the following parameters:
```
qconvex C0.00001 -o TI polytope_input.txt TO polytope_output.txt
```
Load the output into OFFBuilder to get the final OFF file.