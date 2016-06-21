import d3 from 'd3'

export default function parseTaxonomy(data) {
  const parsedData = d3.tsv.parseRows(data)
    .map(([numReads, key, id]) => ({
      numReads: Number(numReads),
      key: Number(key),
      id,
    }))

  parsedData.push({ id: '__ROOT__', key: -1, numReads: 0 })

  return parsedData
}
