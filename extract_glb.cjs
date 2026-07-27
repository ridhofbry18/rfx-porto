const fs = require('fs');

const buffer = fs.readFileSync('public/gabungan.glb');
const chunkLength = buffer.readUInt32LE(12);
const jsonStr = buffer.toString('utf8', 20, 20 + chunkLength);
const data = JSON.parse(jsonStr);

console.log("All nodes:");
data.nodes.forEach((node, i) => {
  if (node.name) {
    console.log(node.name);
  }
});
