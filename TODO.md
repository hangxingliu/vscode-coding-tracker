# TODO

- [x] replace `spawn` to `fork` for user who have not installed Node.js (`fork` use `Node.js` from VSCode)
- [ ] Tracking terminal by integrated terminal API
	- <https://code.visualstudio.com/updates/v1_23#_integrated-terminal-api>
- [ ] Optimize tracking focus watching time by new API:
	- `onDidChangeTextEditorVisibleRanges`
	- <https://code.visualstudio.com/updates/v1_22#_editor-visible-ranges>
- [ ] Optimize upload flow (remove complex vcs queue logic)
- [ ] Add unit tests and travis-ci
	- [x] travis-ci for validating i18n files. 
	- Reference: <https://code.visualstudio.com/docs/extensions/testing-extensions>
- [x] Update dependency `vscode-coding-tracker-server` to `0.6.0`
