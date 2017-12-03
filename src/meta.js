const meta = {}

const nodes = document.querySelectorAll('meta[name]')
for (let i = 0; i < nodes.length; i += 1) {
  const node = nodes[i]
  meta[node.name] = node.content
}

export default meta
