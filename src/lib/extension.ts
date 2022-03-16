import { IconsauceConfig } from "@iconsauce/config";
import { build } from "@iconsauce/core";
import { PathLike } from "fs";
import { dirname, isAbsolute, resolve } from "path";
import {
  Disposable,
  DocumentFilter,
  DocumentSelector,
  ExtensionContext,
  GlobPattern,
  workspace,
} from "vscode";
import { Log } from "../utils/console";
import { fileTypes } from "../utils/utils";
import { Completition } from "./completition";

export class Extension {
  private context: ExtensionContext;
  private disposal: Disposable[];
  private configFilePattern: GlobPattern;
  private dictionary: Map<string, PathLike>;

  constructor(context: ExtensionContext, configFilePattern: GlobPattern) {
    this.context = context;
    this.disposal = [];
    this.configFilePattern = configFilePattern;
    this.dictionary = new Map();
  }

  init() {
    workspace
      .findFiles(this.configFilePattern, "**/node_modules/**/*")
      .then((files) => {
        if(files.length === 0) return;
        const configPath = files[0] ? files[0].fsPath : undefined;
        const config = new IconsauceConfig(configPath);

        
        config.plugin.forEach(p => {
          if(!isAbsolute(p.path.toString()) && !!configPath) {
            p.path = resolve(dirname(configPath), p.path.toString());
          }
        });
        
        build(config).then(data => {
          if(!data) return;

          this.dictionary = data.dictionary;
          this.register();

        });
      }, (error) => {
        Log.error(error);
      });
  }

  register() {
    const disposable = [
     ...this.registerCompletition()
    ];

    this.context.subscriptions.push(...disposable);
    this.disposal.push(...disposable);
  }

  registerCompletition(): Disposable[] {
    const disposables: Disposable[] = [];
    const ext: DocumentSelector =  <DocumentFilter>Object.entries(fileTypes).map((d) => d[0]);
    const completition = new Completition(this, ext);
    disposables.push(completition.registerSelector());
    return disposables;
  }

  getDictionary() {
    return new Map<string, PathLike>(this.dictionary);
  }
}
