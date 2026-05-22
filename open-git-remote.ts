#!/usr/bin/env yavascript
/// <reference path="./yavascript.d.ts"/>

import { resolveRemoteUrl } from "./resolve-remote-url.ts";

const { args, flags, metadata } = parseScriptArgs({
  remote: string,
  repoDir: Path,
});

const remote = flags.remote || "origin";
const repoDir = flags.repoDir || pwd();

const remoteUrl = exec(["git", "config", "--get", `remote.${remote}.url`], {
  captureOutput: true,
  cwd: repoDir,
}).stdout.trim();

const webUrl = resolveRemoteUrl(remoteUrl);
if (webUrl == null) {
  console.error(
    `Couldn't determine what to open for remote: ${yellow(quote(remoteUrl))}`,
  );
} else {
  openUrl(webUrl);
}
