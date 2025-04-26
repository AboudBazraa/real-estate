const fs = require('fs');
const path = require('path');

const globalMcpPath = path.join(process.env.USERPROFILE, '.cursor', 'mcp.json');

const config = {
    databaseUrl: "postgresql://postgres.gscbuqtjqh leygrworlc:hr3YmyN.9gKtqiK@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
    mcpServers: {}
};

fs.writeFileSync(globalMcpPath, JSON.stringify(config, null, 2));
console.log(`Updated MCP config at ${globalMcpPath}`); 