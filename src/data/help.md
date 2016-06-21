# data format

The format is `NUM_READS\tTAXONOMY_ID\tTAXONOMY_LINEAGE`

`NUM_READS` represent the specifc number of read that has that taxonomy as the most specific identification. This means that a spacific taxonomy overall contains `NUM_READS` reads plus the sum of all the `NUM_READS` of its descendants.

example:

```
0 1 A
2 2 A;B
7 3 A;B;C
```

means that there are 9 reads in taxum A, all of them in taxum B, 7 of which are in taxum C and the remaining not further specified.
