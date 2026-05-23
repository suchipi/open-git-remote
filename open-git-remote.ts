#!/usr/bin/env yavascript
/// <reference path="./yavascript.d.ts"/>

// Hosts known to serve their repository web UI at the same path as the
// repository path on the SSH/HTTPS remote URL. Most "GitHub-like" forges
// fall in this category.
const knownWebForges = new Set([
  "github.com",
  "gitlab.com",
  "bitbucket.org",
  "codeberg.org",
  "gitea.com",
  "git.sr.ht",
  "git.launchpad.net",
]);

function stripGitSuffix(path: string): string {
  return path.replace(/\.git$/, "");
}

/**
 * Given a git remote URL, return the web URL that should be opened in a
 * browser, or `null` if the URL doesn't match any recognized form.
 */
export function resolveRemoteUrl(remoteUrl: string): string | null {
  let matches: RegExpMatchArray | null = null;

  // scp-like SSH syntax: [user@]host:path/to/repo(.git)
  if (
    !remoteUrl.match(/^[a-z]+:\/\//i) &&
    (matches = remoteUrl.match(/^(?:([^@]+)@)?([^:]+):(.+?)(?:\.git)?\/?$/))
  ) {
    const host = matches[2];
    const path = stripGitSuffix(matches[3]);
    if (knownWebForges.has(host)) {
      return `https://${host}/${path}`;
    }
    if (host.startsWith("git.")) {
      // Best-effort: many self-hosted forges use a "git." subdomain for SSH
      // and serve the web UI at the bare domain.
      return `https://${host.replace(/^git\./, "")}/${path}`;
    }
    // Fall back to assuming the same host serves a web UI over HTTPS.
    return `https://${host}/${path}`;
  }

  // ssh://[user@]host[:port]/path/to/repo(.git)
  if (
    (matches = remoteUrl.match(
      /^ssh:\/\/(?:[^@]+@)?([^:/]+)(?::\d+)?\/(.+?)(?:\.git)?\/?$/,
    ))
  ) {
    const host = matches[1];
    const path = stripGitSuffix(matches[2]);
    return `https://${host}/${path}`;
  }

  // git://host/path/to/repo(.git)
  if ((matches = remoteUrl.match(/^git:\/\/([^/]+)\/(.+?)(?:\.git)?\/?$/))) {
    const host = matches[1];
    const path = stripGitSuffix(matches[2]);
    return `https://${host}/${path}`;
  }

  // http(s) URL: open as-is, but strip a trailing .git for prettier URLs.
  if ((matches = remoteUrl.match(/^(https?:\/\/.+?)(?:\.git)?\/?$/))) {
    return matches[1];
  }

  return null;
}

function main() {
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
}

if (import.meta.main) {
  main();
}
