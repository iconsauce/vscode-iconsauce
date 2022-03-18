import path = require("path");

import { ExtensionContext, RelativePattern, workspace } from "vscode";
import { Extension } from "./lib/extension";
import { Log } from "./utils/console";

const CONFIG_FILE_GLOB = "iconsauce.config.{js,cjs,mjs,ts}";

export function activate(context: ExtensionContext) {
  const configPattern = new RelativePattern(
    workspace.workspaceFolders?.[0].uri.fsPath as string,
    `**/${CONFIG_FILE_GLOB}`
  );

  Log.info("Init extension...");
  const extenstion = new Extension(context, configPattern);

  extenstion.init();
  extenstion.watch();

  Log.info("Activate iconsause intellisense");
}

export function deactivate() {}
