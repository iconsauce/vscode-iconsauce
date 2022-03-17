import { CompletionItem, CompletionItemKind, DocumentSelector, languages, Position, TextDocument } from "vscode";
import { Extension } from "./extension";

export class Completition {

    private extension: Extension;
    private documentSelector: DocumentSelector;

    constructor(extension: Extension, documentSelector: DocumentSelector) {
        this.extension = extension;
        this.documentSelector = documentSelector;
    }

    registerSelector() {
        return languages.registerCompletionItemProvider(
            this.documentSelector,
            {
                provideCompletionItems: (document: TextDocument, position: Position) => {
                    const completitions: CompletionItem[] = [];
                    for (const selector of this.extension.getDictionary().keys()) {
                      completitions.push(
                        new CompletionItem(selector, CompletionItemKind.Unit)
                      );
                    }
                    return completitions;
                  
                }
            }
        );
    }
}