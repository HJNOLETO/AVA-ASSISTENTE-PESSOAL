const ts = require('typescript');
const fs = require('fs');
const configPath = ts.findConfigFile('./', ts.sys.fileExists, 'tsconfig.json');
if (!configPath) { console.error('Could not find a valid tsconfig.json.'); process.exit(1); }
const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
const parsedConfig = ts.parseJsonConfigFileContent(configFile.config, ts.sys, './');
const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const allDiagnostics = ts.getPreEmitDiagnostics(program);
const lines = allDiagnostics.map(d => {
  if (d.file) {
    const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
    const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    return `${d.file.fileName} (${line + 1},${character + 1}): ${msg}`;
  }
  return ts.flattenDiagnosticMessageText(d.messageText, '\n');
});
fs.writeFileSync('tsc-errors.txt', lines.join('\n'));
console.log('Done writing ' + lines.length + ' errors');
