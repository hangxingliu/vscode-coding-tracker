interface VSCodeCommand {
	executeCommand<T>(command: string, ...rest: any[]): Thenable<T>

	getCommands(filterInternal?: boolean): Thenable<string[]>

	registerCommand(command: string, callback: (args: any[]) => any, thisArg?: any): Disposable

	registerTextEditorCommand(command: string, callback: (textEditor: TextEditor, edit: TextEditorEdit, args: any[]) => void, thisArg?: any): Disposable
}

interface VSCodeEnv {
	appName: string
	language: string
	machineId: string
	sessionId: string
}

interface VSCodeExtensions {
	all: Extension<any>[]
	getExtension(extensionId: string): Extension<any>
	getExtension<T>(extensionId: string): Extension<T>
}

interface VSCodeLanguages{
	createDiagnosticCollection(name?: string): DiagnosticCollection

	getLanguages(): Thenable<string[]>

	match(selector: DocumentSelector, document: TextDocument): number

	registerCodeActionsProvider(selector: DocumentSelector, provider: CodeActionProvider): Disposable

	registerCodeLensProvider(selector: DocumentSelector, provider: CodeLensProvider): Disposable

	registerCompletionItemProvider(selector: DocumentSelector, provider: CompletionItemProvider, ...triggerCharacters: string[]): Disposable

	registerDefinitionProvider(selector: DocumentSelector, provider: DefinitionProvider): Disposable

	registerDocumentFormattingEditProvider(selector: DocumentSelector, provider: DocumentFormattingEditProvider): Disposable

	registerDocumentHighlightProvider(selector: DocumentSelector, provider: DocumentHighlightProvider): Disposable

	registerDocumentLinkProvider(selector: DocumentSelector, provider: DocumentLinkProvider): Disposable

	registerDocumentRangeFormattingEditProvider(selector: DocumentSelector, provider: DocumentRangeFormattingEditProvider): Disposable

	registerDocumentSymbolProvider(selector: DocumentSelector, provider: DocumentSymbolProvider): Disposable

	registerHoverProvider(selector: DocumentSelector, provider: HoverProvider): Disposable

	registerOnTypeFormattingEditProvider(selector: DocumentSelector, provider: OnTypeFormattingEditProvider, firstTriggerCharacter: string, ...moreTriggerCharacter: string[]): Disposable

	registerReferenceProvider(selector: DocumentSelector, provider: ReferenceProvider): Disposable

	registerRenameProvider(selector: DocumentSelector, provider: RenameProvider): Disposable

	registerSignatureHelpProvider(selector: DocumentSelector, provider: SignatureHelpProvider, ...triggerCharacters: string[]): Disposable

	registerWorkspaceSymbolProvider(provider: WorkspaceSymbolProvider): Disposable

	setLanguageConfiguration(language: string, configuration: LanguageConfiguration): Disposable
}

interface VSCodeWindow {

	activeTextEditor: TextEditor

	visibleTextEditors: TextEditor[]

	onDidChangeActiveTextEditor: VSCode_Event<TextEditor>

	onDidChangeTextEditorOptions: VSCode_Event<TextEditorOptionsChangeEvent>

	onDidChangeTextEditorSelection: VSCode_Event<TextEditorSelectionChangeEvent>

	onDidChangeTextEditorViewColumn: VSCode_Event<TextEditorViewColumnChangeEvent>

	createOutputChannel(name: string): OutputChannel

	createStatusBarItem(alignment?: StatusBarAlignment, priority?: number): StatusBarItem

	createTextEditorDecorationType(options: DecorationRenderOptions): TextEditorDecorationType

	setStatusBarMessage(text: string): Disposable

	setStatusBarMessage(text: string, hideAfterTimeout: number): Disposable

	setStatusBarMessage(text: string, hideWhenDone: Thenable<any>): Disposable

	showErrorMessage(message: string, ...items: string[]): Thenable<string>

	showErrorMessage<T extends MessageItem>(message: string, ...items: T[]): Thenable<T>

	showInformationMessage(message: string, ...items: string[]): Thenable<string>

	showInformationMessage<T extends MessageItem>(message: string, ...items: T[]): Thenable<T>

	showInputBox(options?: InputBoxOptions): Thenable<string>

	showQuickPick(items: string[] | Thenable<string[]>, options?: QuickPickOptions): Thenable<string>

	showQuickPick<T extends QuickPickItem>(items: T[] | Thenable<T[]>, options?: QuickPickOptions): Thenable<T>

	showTextDocument(document: TextDocument, column?: ViewColumn, preserveFocus?: boolean): Thenable<TextEditor>

	showWarningMessage(message: string, ...items: string[]): Thenable<string>

	showWarningMessage<T extends MessageItem>(message: string, ...items: T[]): Thenable<T>
}

interface VSCodeWorkspace{
	rootPath: string

	textDocuments: TextDocument[]

	onDidChangeConfiguration: VSCode_Event<void>

	onDidChangeTextDocument: VSCode_Event<TextDocumentChangeEvent>

	onDidCloseTextDocument: VSCode_Event<TextDocument>

	onDidOpenTextDocument: VSCode_Event<TextDocument>

	onDidSaveTextDocument: VSCode_Event<TextDocument>

	applyEdit(edit: WorkspaceEdit): Thenable<boolean>

	asRelativePath(pathOrUri: string | Uri): string

	createFileSystemWatcher(globPattern: string, ignoreCreateEvents?: boolean, ignoreChangeEvents?: boolean, ignoreDeleteEvents?: boolean): FileSystemWatcher

	findFiles(include: string, exclude: string, maxResults?: number, token?: CancellationToken): Thenable<Uri[]>

	getConfiguration(section?: string): WorkspaceConfiguration

	openTextDocument(uri: Uri): Thenable<TextDocument>

	openTextDocument(fileName: string): Thenable<TextDocument>

	registerTextDocumentContentProvider(scheme: string, provider: TextDocumentContentProvider): Disposable

	saveAll(includeUntitled?: boolean): Thenable<boolean>
}

declare class CancellationToken {
	isCancellationRequested: boolean
	onCancellationRequested: VSCode_Event<any>
}
declare class CancellationTokenSource{
	token: CancellationToken
	cancel(): void
	dispose(): void
}

declare class CharacterPair {

CharacterPair: [string, string]
}
declare class CodeActionContext {

diagnostics: Diagnostic[]
}
declare class CodeActionProvider {
	provideCodeActions(document: TextDocument, range: VSCode_Range, context: CodeActionContext, token: CancellationToken): Command[] | Thenable<Command[]>
}

declare class  CodeLens {
	constructor(range: VSCode_Range, command?: Command);
	command: Command
	isResolved: boolean
	range: VSCode_Range
}
declare class CodeLensProvider {

	provideCodeLenses(document: TextDocument, token: CancellationToken): CodeLens[] | Thenable<CodeLens[]>

	resolveCodeLens(codeLens: CodeLens, token: CancellationToken): CodeLens | Thenable<CodeLens>

}	
declare class Command {

	arguments: any[]

	command: string

	title: string
}
declare class CommentRule {
	blockComment: CharacterPair
	lineComment: string
}
declare class CompletionItem {

	constructor(label: string, kind?: CompletionItemKind);

	detail: string

	documentation: string

	filterText: string

	insertText: string

	kind: CompletionItemKind

	label: string

	sortText: string

	textEdit: TextEdit
}

declare enum CompletionItemKind {
	Class,
	Color,
	Constructor,
	Enum,
	Field,
	File,
	Function,
	Interface,
	Keyword,
	Method,
	Module,
	Property,
	Reference,
	Snippet,
	Text,
	Unit,
	Value,
	Variable
}
declare class CompletionItemProvider {

	provideCompletionItems(document: TextDocument, position: VSCode_Position, token: CancellationToken): CompletionItem[] | Thenable<CompletionItem[]> | CompletionList | Thenable < CompletionList >

	resolveCompletionItem(item: CompletionItem, token: CancellationToken): CompletionItem | Thenable<CompletionItem>
}

declare class CompletionList {

	constructor(items?: CompletionItem[], isIncomplete?: boolean);

	isIncomplete: boolean

	items: CompletionItem[]
}
declare class DecorationInstanceRenderOptions {

	after: ThemableDecorationAttachmentRenderOptions

	before: ThemableDecorationAttachmentRenderOptions

	dark: ThemableDecorationInstanceRenderOptions

	light: ThemableDecorationInstanceRenderOptions
}
declare class DecorationOptions {
	hoverMessage: MarkedString | MarkedString[]
	range: VSCode_Range
	renderOptions: DecorationInstanceRenderOptions
}
declare class DecorationRenderOptions {

	after: ThemableDecorationAttachmentRenderOptions

	backgroundColor: string

	before: ThemableDecorationAttachmentRenderOptions

	border: string

	borderColor: string

	borderRadius: string

	borderSpacing: string

	borderStyle: string

	borderWidth: string

	color: string

	cursor: string

	dark: ThemableDecorationRenderOptions

	gutterIconPath: string

	gutterIconSize: string

	isWholeLine: boolean

	letterSpacing: string

	light: ThemableDecorationRenderOptions

	outline: string

	outlineColor: string

	outlineStyle: string

	outlineWidth: string

	overviewRulerColor: string

	overviewRulerLane: OverviewRulerLane

	textDecoration: string
}
declare class Definition {

	Definition: VSCode_Location | VSCode_Location[]
}
declare class DefinitionProvider {

	provideDefinition(document: TextDocument, position: VSCode_Position, token: CancellationToken): Definition | Thenable<Definition>
}
declare class Diagnostic {
	constructor(range: VSCode_Range, message: string, severity?: DiagnosticSeverity);
	code: string | number
	message: string
	range: VSCode_Range
	severity: DiagnosticSeverity
	source: string
}
declare class DiagnosticCollection {

	name: string


	clear(): void

	delete(uri: Uri): void

	dispose(): void

	forEach(callback: (uri: Uri, diagnostics: Diagnostic[], collection: DiagnosticCollection) => any, thisArg?: any): void

	get(uri: Uri): Diagnostic[]

	has(uri: Uri): boolean

	set(uri: Uri, diagnostics: Diagnostic[]): void

	set(entries: [Uri, Diagnostic[]][]): void
}

declare enum DiagnosticSeverity {
	Error,
	Hint,
	Information,
	Warning
}

declare class Disposable {
	static from(...disposableLikes: {dispose: () => any}[]): Disposable
	constructor(callOnDispose: Function)
	dispose(): any
}

declare class DocumentFilter {
	language: string

	pattern: string

	scheme: string

}	
declare class DocumentFormattingEditProvider{
	provideDocumentFormattingEdits(document: TextDocument, options: FormattingOptions, token: CancellationToken): TextEdit[] | Thenable<TextEdit[]>
}
declare class DocumentHighlight {
	constructor(range: VSCode_Range, kind?: DocumentHighlightKind);
	kind: DocumentHighlightKind
	range: VSCode_Range

}
declare enum DocumentHighlightKind {
	Read,
	Text,
	Write	
}

declare class DocumentHighlightProvider {

	provideDocumentHighlights(document: TextDocument, position: VSCode_Position, token: CancellationToken): DocumentHighlight[] | Thenable<DocumentHighlight[]>
}
declare class DocumentLink {

	constructor(range: VSCode_Range, target: Uri);

	range: VSCode_Range

	target: Uri
}
declare class DocumentLinkProvider {

	provideDocumentLinks(document: TextDocument, token: CancellationToken): DocumentLink[] | Thenable<DocumentLink[]>
}
declare class DocumentRangeFormattingEditProvider {

	provideDocumentRangeFormattingEdits(document: TextDocument, range: VSCode_Range, options: FormattingOptions, token: CancellationToken): TextEdit[] | Thenable<TextEdit[]>
}
declare class DocumentSelector {
	DocumentSelector: string | DocumentFilter | string | DocumentFilter[]
}
declare class DocumentSymbolProvider {

	provideDocumentSymbols(document: TextDocument, token: CancellationToken): SymbolInformation[] | Thenable<SymbolInformation[]>
}
declare enum EndOfLine {
	CRLF,
	LF
}
declare class EnterAction {

	appendText: string

	indentAction: VSCode_IndentAction

	removeText: number

}	
interface VSCode_Event<T> {
	(listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]): Disposable
}
declare class EventEmitter<T>{
	event: VSCode_Event<T>

	dispose(): void

	fire(data?: T): void
}
declare class Extension<T> {

	exports: T

	extensionPath: string

	id: string

	isActive: boolean

	packageJSON: any

	activate(): Thenable<T>
}
declare class ExtensionContext {

	extensionPath: string

	globalState: Memento

	storagePath: string

	subscriptions: { dispose }[]

	workspaceState: Memento

	asAbsolutePath(relativePath: string): string
}
declare class FileSystemWatcher {

	onDidChange: VSCode_Event<Uri>

	onDidCreate: VSCode_Event<Uri>

	onDidDelete: VSCode_Event<Uri>

	static from(...disposableLikes: { dispose: () => any }[]): Disposable

	constructor(callOnDispose: Function);

	ignoreChangeEvents: boolean

	ignoreCreateEvents: boolean

	ignoreDeleteEvents: boolean

	dispose(): any
}

declare class FormattingOptions {

	insertSpaces: boolean

	tabSize: number
}
declare class Hover {

	constructor(contents: MarkedString | MarkedString[], range?: VSCode_Range);

	contents: MarkedString[]

	range: VSCode_Range
}
declare class HoverProvider {

	provideHover(document: TextDocument, position: VSCode_Position, token: CancellationToken): Hover | Thenable<Hover>
}
declare enum VSCode_IndentAction {
	Indent,
	IndentOutdent,
	None,
	Outdent
}
declare class IndentationRule {

	decreaseIndentPattern: RegExp

	increaseIndentPattern: RegExp

	indentNextLinePattern: RegExp

	unIndentedLinePattern: RegExp
}
declare class InputBoxOptions {
	password: boolean
	placeHolder: string
	prompt: string
	validateInput: (value: string) => string
	value: string

}
declare class LanguageConfiguration {

	___characterPairSupport: { autoClosingPairs: { close: string, notIn: string[], open: string }[] }

	___electricCharacterSupport: { brackets: any, docComment: { close: string, lineStart: string, open: string, scope: string } }

	brackets: CharacterPair[]

	comments: CommentRule

	indentationRules: IndentationRule

	onEnterRules: OnEnterRule[]

	wordPattern: RegExp
}
declare class VSCode_Location {

	constructor(uri: Uri, rangeOrPosition: VSCode_Range | VSCode_Position);

	range: VSCode_Range

	uri: Uri
}

declare class MarkedString {

	MarkedString: string | { language: string, value: string }
}

declare class Memento {

	get<T>(key: string, defaultValue?: T): T

	update(key: string, value: any): Thenable<void>
}

declare class MessageItem {
	isCloseAffordance: boolean

	title: string
}

declare class OnEnterRule {

	action: EnterAction

	afterText: RegExp

	beforeText: RegExp
}
declare class OnTypeFormattingEditProvider {

	provideOnTypeFormattingEdits(document: TextDocument, position: VSCode_Position, ch: string, options: FormattingOptions, token: CancellationToken): TextEdit[] | Thenable<TextEdit[]>
}
declare class OutputChannel {

	name: string

	append(value: string): void

	appendLine(value: string): void

	clear(): void

	dispose(): void

	hide(): void

	show(column?: ViewColumn, preserveFocus?: boolean): void

	show(preservceFocus?: boolean): void
}
declare enum OverviewRulerLane {
	Center,
	Full,
	Left,
	Right
}
declare class ParameterInformation {

	constructor(label: string, documentation?: string);

	documentation: string

	label: string
}
declare class VSCode_Position {

	constructor(line: number, character: number);

	character: number

	line: number

	compareTo(other: VSCode_Position): number

	isAfter(other: VSCode_Position): boolean

	isAfterOrEqual(other: VSCode_Position): boolean

	isBefore(other: VSCode_Position): boolean

	isBeforeOrEqual(other: VSCode_Position): boolean

	isEqual(other: VSCode_Position): boolean

	translate(lineDelta?: number, characterDelta?: number): VSCode_Position

	translate(change: { characterDelta: number, lineDelta: number }): VSCode_Position

	with(line?: number, character?: number): VSCode_Position

	with(change: { character: number, line: number }): VSCode_Position
}

declare class QuickPickItem {
	description: string

	detail: string

	label: string
}

declare class QuickPickOptions {

	onDidSelectItem: (item: any | string) => any

	matchOnDescription: boolean

	matchOnDetail: boolean

	placeHolder: string
}
declare class VSCode_Range {

	constructor(start: VSCode_Position, end: VSCode_Position);

	constructor(startLine: number, startCharacter: number, endLine: number, endCharacter: number);

	end: VSCode_Position

	isEmpty: boolean

	isSingleLine: boolean

	start: VSCode_Position

	contains(positionOrRange: VSCode_Position | VSCode_Range): boolean

	intersection(range: VSCode_Range): VSCode_Range

	isEqual(other: VSCode_Range): boolean

	union(other: VSCode_Range): VSCode_Range

	with(start?: VSCode_Position, end?: VSCode_Position): VSCode_Range

	with(change: { end: VSCode_Position, start: VSCode_Position }): VSCode_Range
}

declare class ReferenceContext {

	includeDeclaration: boolean
}
declare class ReferenceProvider {

	provideReferences(document: TextDocument, position: VSCode_Position, context: ReferenceContext, token: CancellationToken): VSCode_Location[] | Thenable<VSCode_Location[]>
}

declare class RenameProvider {

	provideRenameEdits(document: TextDocument, position: VSCode_Position, newName: string, token: CancellationToken): WorkspaceEdit | Thenable<WorkspaceEdit>
}


declare class VSCode_Selection {

	constructor(anchor: VSCode_Position, active: VSCode_Position);

	constructor(anchorLine: number, anchorCharacter: number, activeLine: number, activeCharacter: number);

	active: VSCode_Position

	anchor: VSCode_Position

	end: VSCode_Position

	isEmpty: boolean

	isReversed: boolean

	isSingleLine: boolean

	start: VSCode_Position

	contains(positionOrRange: VSCode_Position | VSCode_Range): boolean

	intersection(range: VSCode_Range): VSCode_Range

	isEqual(other: VSCode_Range): boolean

	union(other: VSCode_Range): VSCode_Range

	with(start?: VSCode_Position, end?: VSCode_Position): VSCode_Range

	with(change: { end: VSCode_Position, start: VSCode_Position }): VSCode_Range
}
declare class SignatureHelp {

	activeParameter: number

	activeSignature: number

	signatures: SignatureInformation[]
}

declare class SignatureHelpProvider {

	provideSignatureHelp(document: TextDocument, position: VSCode_Position, token: CancellationToken): SignatureHelp | Thenable<SignatureHelp>
}
declare class SignatureInformation {

	constructor(label: string, documentation?: string);

	documentation: string

	label: string

	parameters: ParameterInformation[]

}	
declare enum StatusBarAlignment {
Left,
Right	
}
declare class StatusBarItem {

	alignment: StatusBarAlignment

	color: string

	command: string

	priority: number

	text: string

	tooltip: string

	METHODS

	dispose(): void

	hide(): void

	show(): void
}
declare class SymbolInformation {

	constructor(name: string, kind: SymbolKind, range: VSCode_Range, uri?: Uri, containerName?: string);

	containerName: string

	kind: SymbolKind

	location: VSCode_Location

	name: string
}
declare enum SymbolKind {
	Array
	,Boolean
	,Class
	,Constant
	,Constructor
	,Enum
	,Field
	,File
	,Function
	,Interface
	,Key
	,Method
	,Module
	,Namespace
	,Null
	,Number
	,Object
	,Package
	,Property
	,String
	,Variable
}
declare class TextDocument {
	fileName: string

	isDirty: boolean

	isUntitled: boolean

	languageId: string

	lineCount: number

	uri: Uri

	version: number

	getText(range?: VSCode_Range): string

	getWordRangeAtPosition(position: VSCode_Position): VSCode_Range

	lineAt(line: number): TextLine

	lineAt(position: VSCode_Position): TextLine

	offsetAt(position: VSCode_Position): number

	positionAt(offset: number): VSCode_Position

	save(): Thenable<boolean>

	validatePosition(position: VSCode_Position): VSCode_Position

	validateRange(range: VSCode_Range): VSCode_Range
}
declare class TextDocumentChangeEvent {

	contentChanges: TextDocumentContentChangeEvent[]

	document: TextDocument
}
declare class TextDocumentContentChangeEvent {

	range: VSCode_Range

	rangeLength: number

	text: string
}
declare class TextDocumentContentProvider {

	onDidChange: VSCode_Event<Uri>

	provideTextDocumentContent(uri: Uri, token: CancellationToken): string | Thenable<string>
}
declare class TextEdit {

	static delete(range: VSCode_Range): TextEdit;

	static insert(position: VSCode_Position, newText: string): TextEdit;
	
	static replace(range: VSCode_Range, newText: string): TextEdit;

	constructor(range: VSCode_Range, newText: string);

	newText: string;

	range: VSCode_Range;
}
declare class TextEditor {

	document: TextDocument

	options: TextEditorOptions

	selection: VSCode_Selection

	selections: VSCode_Selection[]

	viewColumn: ViewColumn


	edit(callback: (editBuilder: TextEditorEdit) => void): Thenable<boolean>

	hide(): void

	revealRange(range: VSCode_Range, revealType?: TextEditorRevealType): void

	setDecorations(decorationType: TextEditorDecorationType, rangesOrOptions: VSCode_Range[] | DecorationOptions[]): void

	show(column?: ViewColumn): void
}
declare enum TextEditorCursorStyle {

	Block
	,Line
	,Underline
}
declare class TextEditorDecorationType {

	key: string

	METHODS

	dispose(): void
}
declare class TextEditorEdit {

	delete(location: VSCode_Range | VSCode_Selection): void

	insert(location: VSCode_Position, value: string): void

	replace(location: VSCode_Position | VSCode_Range | VSCode_Selection, value: string): void

	setEndOfLine(endOfLine: EndOfLine): void
}

declare class TextEditorOptions {

	cursorStyle: TextEditorCursorStyle

	insertSpaces: boolean | string

	tabSize: number | string
}
declare class TextEditorOptionsChangeEvent {

	options: TextEditorOptions

	textEditor: TextEditor
}
declare enum TextEditorRevealType {

	Default
	,InCenter
	,InCenterIfOutsideViewport
}

declare class TextEditorSelectionChangeEvent {

	selections: VSCode_Selection[]

	textEditor: TextEditor
}

declare class TextEditorViewColumnChangeEvent {

	textEditor: TextEditor

	viewColumn: ViewColumn
}
declare class TextLine{
	firstNonWhitespaceCharacterIndex: number
	isEmptyOrWhitespace: boolean
	lineNumber: number
	range: VSCode_Range
	rangeIncludingLineBreak: VSCode_Range
	text: string
}
declare class ThemableDecorationAttachmentRenderOptions {

	backgroundColor: string

	border: string

	color: string

	contentIconPath: string

	contentText: string

	height: string

	margin: string

	textDecoration: string

	width: string
}
declare class ThemableDecorationInstanceRenderOptions{
	after: ThemableDecorationAttachmentRenderOptions
	before: ThemableDecorationAttachmentRenderOptions
}
declare class ThemableDecorationRenderOptions {
	after: ThemableDecorationAttachmentRenderOptions
	backgroundColor: string
	before: ThemableDecorationAttachmentRenderOptions
	border: string
	borderColor: string
	borderRadius: string
	borderSpacing: string
	borderStyle: string
	borderWidth: string
	color: string
	cursor: string
	gutterIconPath: string
	gutterIconSize: string
	letterSpacing: string
	outline: string
	outlineColor: string
	outlineStyle: string
	outlineWidth: string
	overviewRulerColor: string
	textDecoration : string
}
declare class Uri {
	static file(path: string): Uri
	static parse(value: string): Uri
	authority: string
	fragment: string
	fsPath: string
	path: string
	query: string
	scheme: string
	toJSON(): any
	toString(skipEncoding?: boolean): string
	with(change: {authority: string, fragment: string, path: string, query: string, scheme: string}): Uri
}
declare enum ViewColumn {
	One,
	Three,
	Two
}	

declare class WorkspaceConfiguration {

	get<T>(section: string, defaultValue?: T): T

	has(section: string): boolean
}
declare class WorkspaceEdit {
	size: number
	delete (uri: Uri, range: VSCode_Range): void
	entries(): [Uri, TextEdit[]][]
	get(uri: Uri): TextEdit[]
	has(uri: Uri): boolean
	insert(uri: Uri, position: VSCode_Position, newText: string): void
	replace(uri: Uri, range: VSCode_Range, newText: string): void
	set(uri: Uri, edits: TextEdit[]): void
}
declare class WorkspaceSymbolProvider {
	provideWorkspaceSymbols(query: string, token: CancellationToken): SymbolInformation[] | Thenable<SymbolInformation[]>
}

// ### VSCode Change Start: We want PromiseLike to be Thenable
interface Thenable<T> extends PromiseLike<T> { }

declare module 'vscode' {
	export var commands: VSCodeCommand;
	export var env: VSCodeEnv;
	export var extensions: VSCodeExtensions;
	export var languages: VSCodeLanguages;
	export var window: VSCodeWindow;
	export var workspace: VSCodeWorkspace;
}