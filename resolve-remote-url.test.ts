#!/usr/bin/env yavascript
/// <reference path="./yavascript.d.ts"/>

import { resolveRemoteUrl } from "./resolve-remote-url.ts";

const cases: Array<{ input: string; expected: string | null }> = [
  // GitHub
  {
    input: "git@github.com:user/repo.git",
    expected: "https://github.com/user/repo",
  },
  {
    input: "git@github.com:user/repo",
    expected: "https://github.com/user/repo",
  },
  {
    input: "https://github.com/user/repo.git",
    expected: "https://github.com/user/repo",
  },
  {
    input: "https://github.com/user/repo",
    expected: "https://github.com/user/repo",
  },

  // GitLab (including subgroups)
  {
    input: "git@gitlab.com:group/subgroup/repo.git",
    expected: "https://gitlab.com/group/subgroup/repo",
  },
  {
    input: "https://gitlab.com/group/subgroup/repo.git",
    expected: "https://gitlab.com/group/subgroup/repo",
  },

  // Bitbucket
  {
    input: "git@bitbucket.org:team/repo.git",
    expected: "https://bitbucket.org/team/repo",
  },
  {
    input: "https://user@bitbucket.org/team/repo.git",
    expected: "https://user@bitbucket.org/team/repo",
  },

  // Codeberg / Gitea
  {
    input: "git@codeberg.org:user/repo.git",
    expected: "https://codeberg.org/user/repo",
  },
  {
    input: "git@gitea.com:user/repo.git",
    expected: "https://gitea.com/user/repo",
  },

  // sr.ht
  {
    input: "git@git.sr.ht:~user/repo",
    expected: "https://git.sr.ht/~user/repo",
  },

  // Launchpad
  {
    input: "git@git.launchpad.net:user/repo",
    expected: "https://git.launchpad.net/user/repo",
  },

  // ssh:// protocol with port
  {
    input: "ssh://git@github.com:22/user/repo.git",
    expected: "https://github.com/user/repo",
  },
  {
    input: "ssh://git@gitlab.example.com/group/repo.git",
    expected: "https://gitlab.example.com/group/repo",
  },

  // git:// protocol
  {
    input: "git://github.com/user/repo.git",
    expected: "https://github.com/user/repo",
  },

  // Self-hosted "git." subdomain heuristic
  {
    input: "git@git.example.com:user/repo.git",
    expected: "https://example.com/user/repo",
  },

  // Unknown bare host -> same host
  {
    input: "git@code.example.org:user/repo.git",
    expected: "https://code.example.org/user/repo",
  },

  // Unrecognized form (no colon, no scheme)
  {
    input: "/some/local/path",
    expected: null,
  },
  {
    input: "",
    expected: null,
  },
];

let failures = 0;
for (const { input, expected } of cases) {
  const actual = resolveRemoteUrl(input);
  if (actual === expected) {
    console.log(green("ok"), input, "->", String(actual));
  } else {
    failures++;
    console.log(
      red("FAIL"),
      input,
      "\n  expected:",
      String(expected),
      "\n  actual:  ",
      String(actual),
    );
  }
}

if (failures > 0) {
  console.error(red(`${failures} test(s) failed`));
  exit(1);
} else {
  console.log(green(`all ${cases.length} tests passed`));
}
