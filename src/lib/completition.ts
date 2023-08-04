import {
  CompletionItem,
  CompletionItemKind,
  DocumentSelector,
  languages,
  MarkdownString,
  Position,
  Range,
  TextDocument,
} from "vscode";
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
        provideCompletionItems: (
          document: TextDocument,
          position: Position
        ) => {
          const line = document.getText(
            new Range(new Position(position.line, 0), position)
          );
          // controllo se viene utilizzato il selettore all'interno di apici
          if (Array.from(line.matchAll(/(['"])/g)).length % 2 === 0) return;
          const completitions: CompletionItem[] = [];
          completitions.push(
            ...Array.from(this.extension.getDictionary().keys()).map(
              (selector) => {
                const item = new CompletionItem(
                  selector,
                  CompletionItemKind.Unit
                );
                return item;
              }
            )
          );

          return completitions;
        },
        resolveCompletionItem: (item) => {
          if (item.kind === CompletionItemKind.Unit) {
            item.detail = "iconsauce";
            const makdownContent = new MarkdownString(
              `<h1><span style="color:#fff;background-color:#fff;">-<img src="${this.extension
                .getDictionary()
                .get(
                  item.label.toString()
                )}" width="24px" height="24px"/>-</span></h1>`
            );
            makdownContent.supportHtml = true;
            makdownContent.isTrusted = true;
            item.documentation = makdownContent;
          }
          return item;
        },
      },
      '"',
      " "
    );
  }
}
