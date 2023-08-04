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
import { Completition } from "./completition";

export class Extension {
  private context: ExtensionContext;
  private disposal: Disposable[];
  private configFilePattern: GlobPattern;
  private dictionary: Map<string, PathLike>;
  private configPath: string | undefined;
  private documentSelector: DocumentSelector;

  constructor(context: ExtensionContext, configFilePattern: GlobPattern) {
    this.context = context;
    this.disposal = [];
    this.configFilePattern = configFilePattern;
    this.dictionary = new Map();
    this.documentSelector = '';
  }

  init() {
    workspace.findFiles(this.configFilePattern, "**/node_modules/**/*").then(
      (files) => {
        if (files.length === 0) return;
        this.configPath = files[0] ? files[0].fsPath : undefined;

        this.update();
      },
      (error) => {
        Log.error(error);
      }
    );
  }

  update() {
    if (this.configPath) {
      delete require.cache[this.configPath];
      const config = new IconsauceConfig(this.configPath);

      const d: DocumentFilter[] = [];
      config.content.forEach(v => d.push( <DocumentFilter>{ pattern: v.replace('./', '**/') }));
      this.documentSelector = d;

      config.plugin.forEach((p) => {
        if (!isAbsolute(p.path.toString()) && !!this.configPath) {
          p.path = resolve(dirname(this.configPath), p.path.toString());
        }
      });
      build(config).then((data) => {
        this.disposal.forEach(i => i.dispose());
        this.disposal.length = 0; 
        if (!data) return;

        this.dictionary = data.dictionary;
        this.register();
      });
    }
  }

  watch() {
    const watcher = workspace.createFileSystemWatcher(this.configFilePattern);

    // Changes configuration should invalidate above cache
    watcher.onDidChange((e) => {
      Log.info(`Config File: ${e.fsPath} Changed, Reloading...`);
      this.configPath = e.fsPath;
      this.update();
    });

    // This handles the case where the project didn't have config file
    // but was created after VS Code was initialized
    watcher.onDidCreate((e) => {
      Log.info(`Found New Config File: ${e.fsPath}, Reloading...`);
      this.configPath = e.fsPath;
      this.update();
    });

    // If the config is deleted, utilities&variants should be regenerated
    watcher.onDidDelete((e) => {
      Log.info(`Config File ${e.fsPath} Has Been Deleted, Reloading...`);
      this.configPath = undefined;
      this.update();
    });

    // // when change vscode configuration should regenerate disposables
    // workspace.onDidChangeConfiguration(
    //   () => {
    //     Log.info("Global Configuration Changed, Reloading...");
    //     this.update();
    //   },
    //   null,
    //   this.context.subscriptions
    // );
  }

  register() {
    const disposable = [...this.registerCompletition()];
    this.context.subscriptions.push(...disposable);
    this.disposal.push(...disposable);
  }

  registerCompletition(): Disposable[] {
    const disposables: Disposable[] = [];
    const completition = new Completition(this, this.documentSelector);
    disposables.push(completition.registerSelector());
    return disposables;
  }

  getDictionary() {
    return new Map<string, PathLike>(this.dictionary);
  }
}
