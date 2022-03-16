import path = require("path");

import {
  ExtensionContext,
  RelativePattern,
  workspace,
} from "vscode";
import { Extension } from "./lib/extension";
import { Log } from "./utils/console";

const CONFIG_FILE_GLOB = "iconsauce.config.{js,cjs,mjs,ts}";

export function activate(context: ExtensionContext) {
  const configPattern = new RelativePattern(
    workspace.workspaceFolders?.[0].uri.fsPath as string,
    `**/${CONFIG_FILE_GLOB}`);

  Log.info("Init extension...");
  const extenstion = new Extension(context, configPattern);
  
  extenstion.init();

  Log.info("Activate iconsause intellisense");
  

  // const provider1 = languages.registerCompletionItemProvider('plaintext', {

  // 	provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext) {

  // 		// a simple completion item which inserts `Hello World!`
  // 		const simpleCompletion = new CompletionItem('Hello World!');

  // 		// a completion item that inserts its text as snippet,
  // 		// the `insertText`-property is a `SnippetString` which will be
  // 		// honored by the editor.
  // 		const snippetCompletion = new CompletionItem('Good part of the day');
  // 		snippetCompletion.insertText = new SnippetString('Good ${1|morning,afternoon,evening|}. It is ${1}, right?');
  // 		const docs : any = new MarkdownString("Inserts a snippet that lets you select [link](x.ts).");
  // 		snippetCompletion.documentation = docs;
  // 		docs.baseUri = Uri.parse('http://example.com/a/b/c/');

  // 		// a completion item that can be accepted by a commit character,
  // 		// the `commitCharacters`-property is set which means that the completion will
  // 		// be inserted and then the character will be typed.
  // 		const commitCharacterCompletion = new CompletionItem('console');
  // 		commitCharacterCompletion.commitCharacters = ['.'];
  // 		commitCharacterCompletion.documentation = new MarkdownString('Press `.` to get `console.`');

  // 		// a completion item that retriggers IntelliSense when being accepted,
  // 		// the `command`-property is set which the editor will execute after
  // 		// completion has been inserted. Also, the `insertText` is set so that
  // 		// a space is inserted after `new`
  // 		const commandCompletion = new CompletionItem('new');
  // 		commandCompletion.kind = CompletionItemKind.Keyword;
  // 		commandCompletion.insertText = 'new ';
  // 		commandCompletion.command = { command: 'editor.action.triggerSuggest', title: 'Re-trigger completions...' };

  // 		// return all completion items as array
  // 		return [
  // 			simpleCompletion,
  // 			snippetCompletion,
  // 			commitCharacterCompletion,
  // 			commandCompletion
  // 		];
  // 	}
  // });

  // const provider2 = languages.registerCompletionItemProvider(
  // 	'',
  // 	{
  // 		provideCompletionItems(document: TextDocument, position: Position) {

  // 			// get all text until the `position` and check if it reads `console.`
  // 			// and if so then complete if `log`, `warn`, and `error`
  // 			const linePrefix = document.lineAt(position).text.slice(0, position.character);
  // 			if (!linePrefix.endsWith('console.')) {
  // 				return undefined;
  // 			}

  // 			return [
  // 				new CompletionItem('log', CompletionItemKind.Method),
  // 				new CompletionItem('warn', CompletionItemKind.Method),
  // 				new CompletionItem('error', CompletionItemKind.Method),
  // 			];
  // 		}
  // 	},
  // 	'.' // triggered whenever a '.' is being typed
  // );
}

export function deactivate() {}
