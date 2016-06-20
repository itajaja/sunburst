// TODO: Use stratify
const csv = `
1000;Bacteria;Proteobacteria;Gammaproteobacteria Enterobacteriales Enterobacteriaceae;Escherichia Escherichia coli;Escherichia coli K-12 Escherichia coli str. K-12 substr. DH10B
500;Bacteria;Proteobacteria;Gammaproteobacteria Enterobacteriales Enterobacteriaceae;Escherichia Escherichia coli;Escherichia coli O157:H7;Escherichia coli O157:H7 str. EDL933
300;Bacteria;Proteobacteria;Gammaproteobacteria Pseudomonadales Pseudomonadaceae;Pseudomonas Pseudomonas aeruginosa group;Pseudomonas aeruginosa;Pseudomonas aeruginosa 059A
200;Bacteria;Proteobacteria;Gammaproteobacteria Pseudomonadales Pseudomonadaceae;Pseudomonas
400;Bacteria;Proteobacteria;Gammaproteobacteria Enterobacteriales Enterobacteriaceae;Yersinia;Yersinia enterocolitica Yersinia enterocolitica (type O:2.3)
300;Bacteria;Firmicutes;Bacilli;Bacillales;Staphylococcaceae Staphylococcus;Staphylococcus aureus Staphylococcus aureus 04-02981
250;Bacteria;Firmicutes;Bacilli;Lactobacillales Lactobacillaceae;Lactobacillus Lactobacillus acidophilus
50;Viruses ssRNA viruses ssRNA negative-strand viruses;Orthomyxoviridae;Influenzavirus A;Influenza A virus H10N1 subtype Influenza A virus (A/blue-winged teal/TX/AI12-1043/2012(H10N1))
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
