const fs = require('fs');
const path = require('path');

const globalMcpPath = path.join(process.env.USERPROFILE, '.cursor', 'mcp.json');

try {
    const data = fs.readFileSync(globalMcpPath, 'utf8');
    const outputContent = `Global MCP config content:\n${data}`;
    fs.writeFileSync('mcp-config-result.txt', outputContent);
    console.log('MCP config written to mcp-config-result.txt');
} catch (err) {
    console.error(`Error reading MCP config: ${err.message}`);
} 