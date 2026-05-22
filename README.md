# open-git-remote

A small CLI that opens a git repository's remote URL in your default web browser.

It reads the configured URL for a remote (defaulting to `origin`), normalizes common forms (SSH and HTTPS), and opens the resulting page.

## Requirements

- [yavascript](https://github.com/suchipi/yavascript) on your `PATH`

## Installation

Clone or download this repo, then make sure `open-git-remote.ts` is executable and place it (or a symlink to it) somewhere on your `PATH`:

```sh
chmod +x open-git-remote.ts
ln -s "$PWD/open-git-remote.ts" ~/.local/bin/open-git-remote
```

## Usage

From inside a git repository:

```sh
open-git-remote
```

This opens the URL of the `origin` remote.

### Flags

- `--remote <name>`: open a different remote instead of `origin`.
- `--repo-dir <path>`: run against the given directory instead of the current working directory.

### Examples

```sh
# Open the origin remote of the current repo
open-git-remote

# Open the "upstream" remote
open-git-remote --remote upstream

# Open the origin remote of a repo elsewhere on disk
open-git-remote --repo-dir ~/Code/some-other-repo
```

## Supported remote URL formats

- scp-like SSH URLs like `git@github.com:user/repo.git` are rewritten to `https://github.com/user/repo`. Known forges (GitHub, GitLab, Bitbucket, Codeberg, Gitea, sr.ht, Launchpad) are recognized explicitly; other hosts fall back to assuming the same host serves a web UI over HTTPS, with a special case for `git.<domain>` SSH hosts that map to `<domain>` on the web.
- `ssh://[user@]host[:port]/path/to/repo(.git)` URLs are rewritten to `https://host/path/to/repo`.
- `git://host/path/to/repo(.git)` URLs are rewritten to `https://host/path/to/repo`.
- Any other `http(s)://...` URL not matched by the patterns above is opened as-is, with any trailing `.git` stripped.

If the remote URL doesn't match any of these forms, the script prints an error and exits without opening anything.
