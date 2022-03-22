import {
  CompletionItem,
  CompletionItemKind,
  DocumentSelector,
  languages,
  MarkdownString,
  Position,
  Range,
  TextDocument,
  TextEdit,
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
      provideCompletionItems: (
        _document: TextDocument,
        _position: Position
      ) => {
        const completitions: CompletionItem[] = [];
        for (const selector of this.extension.getDictionary().keys()) {
          completitions.push(
            new CompletionItem(selector, CompletionItemKind.Unit)
          );
        }
        return completitions;
      },
      resolveCompletionItem: (item) => {
        switch (item.kind) {
          case CompletionItemKind.Unit:
            item.detail = "iconsauce";
            const makdownContent = new MarkdownString(`<h1><span style="color:#fff;background-color:#fff;">-<img src="${this.extension.getDictionary().get(item.label.toString())}" width="24px" height="24px"/>-</span></h1>`);
            makdownContent.supportHtml = true;
            makdownContent.isTrusted = true;
            item.documentation = makdownContent;
            break;
        }
        return item;
      },
    });
  }
}
