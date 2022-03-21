import {
  CompletionItem,
  CompletionItemKind,
  DocumentSelector,
  languages,
  Position,
  TextDocument,
} from "vscode";
import { Log } from "../utils/console";
import { Extension } from "./extension";

export class Completition {
  private extension: Extension;
  private documentSelector: DocumentSelector;

  constructor(extension: Extension, documentSelector: DocumentSelector) {
    this.extension = extension;
    this.documentSelector = documentSelector;
  }

  registerSelector() {
    return languages.registerCompletionItemProvider(this.documentSelector, {
      provideCompletionItems: (_document: TextDocument, _position: Position) => {
        Log.info('build completition');
        const completitions: CompletionItem[] = [];
        for (const selector of this.extension.getDictionary().keys()) {
          completitions.push(
            new CompletionItem(selector, CompletionItemKind.Unit)
          );
        }
        Log.info('finish');
        return completitions;
      },
    });
  }
}
