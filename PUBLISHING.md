# Publishing (VS Code Marketplace / Open VSX)

Search in VS Code finds an extension only after it is published to the Marketplace (VS Code) and/or Open VSX (VSCodium, Cursor, etc.).
The publisher account and token belong to the owner; they are never stored in this repo.

## VS Code Marketplace
1. Create an Azure DevOps organisation and a Personal Access Token (scope: **Marketplace → Manage**, organisation: *All accessible organizations*).
2. Create the publisher at https://marketplace.visualstudio.com/manage with ID `aon-co-jp` (must equal `publisher` in `package.json`; change both if the ID is taken).
3. ```
   npx @vscode/vsce login aon-co-jp      # paste the PAT
   npx @vscode/vsce publish              # or: npx @vscode/vsce publish minor
   ```
   (or upload `open-vsc-claude-<version>.vsix` on the manage page).
4. Reflection in search takes a few minutes; installs via `ext install aon-co-jp.open-vsc-claude`.

## Open VSX
```
npx ovsx create-namespace aon-co-jp -p <token>
npx ovsx publish open-vsc-claude-<version>.vsix -p <token>
```

## Before each release
`npm run compile && npm test && npm run test:vscode` (set `VSCODE_EXE`), bump `version`, then `npm run package`.
