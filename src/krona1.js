// TODO: Use stratify
const csv = `
1100;Bacteria;Proteobacteria;Gammaproteobacteria Enterobacteriales Enterobacteriaceae;Escherichia Escherichia coli
250;Bacteria;Proteobacteria;Gammaproteobacteria Pseudomonadales Pseudomonadaceae;Pseudomonas
180;Bacteria;Proteobacteria;Gammaproteobacteria Enterobacteriales Enterobacteriaceae;Yersinia
160;Bacteria;Firmicutes;Bacilli Bacillales;Staphylococcaceae Staphylococcus
150;Bacteria;Firmicutes;Bacilli Lactobacillales Lactobacillaceae
20;Viruses ssRNA viruses ssRNA negative-strand viruses
`;

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how
// often that sequence occurred.
function buildHierarchy(csv, separator = '\t') {
  let id = 0
  const root = { name: '', children: [], key: '__root__' };
  const rows = csv.split('\n');
  rows.forEach(row => {
    const [size, ...parts] = row.split(separator);
    if (!size) return;
    let currentNode = root;

    for (let j = 0; j < parts.length; j++) {
      const children = currentNode.children;
      const nodeName = parts[j];
      let childNode;
      if (j + 1 < parts.length) {
         // Not yet at the end of the sequence; move down the tree.
        let foundChild = false;
        for (let k = 0; k < children.length; k++) {
          if (children[k].name === nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [], key: parts.slice(0, j + 1).join('-') };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = { name: nodeName, size, key: parts.join('-') };
        children.push(childNode);
      }
    }
  });
  return root;
}

export default buildHierarchy(csv, ";");
