export default function transform(t) {
  return Object.keys(t).map(k => `${k}(${t[k].join(',')})`).join(' ')
}
