# Data format

The format is `NUM_READS\tTAXONOMY_ID\tTAXONOMY_LINEAGE`

`NUM_READS` represent the specific number of reads that have that taxonomy as the most specific identification. This means that a specific taxonomy overall contains `NUM_READS` reads plus the sum of all the `NUM_READS` of its descendants.

Example:

```
0 1 A
2 2 A;B
7 3 A;B;C
```

This means that there are 9 reads in taxon A, all of them in taxon B, 7 of which are in taxon C and the remaining not further specified.
