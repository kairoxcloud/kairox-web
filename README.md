<div align="center">
  <img src="src/assets/kairox-logo.png" alt="Kairox" width="280">
  <p><strong>A cloud workspace where an AI agent writes code for you.</strong></p>
</div>

## What Kairox is

Most coding assistants live in a chat box. They can write a patch, but they cannot run it.

Kairox gives the agent a real machine instead. Every session starts a container of its own, with
a real shell, a real file system and git. The agent installs packages, edits files, runs your test
suite and reads what came back, the same way you would.

## How a session works

You pick a project and describe what you want done. Kairox opens a session, which is a working
copy of that project on its own branch with a conversation attached. Inside the session the agent
works one run at a time, and a run goes around the same loop until the change holds.

It reads the code before it changes anything. It writes the steps down. It edits files and runs
commands in the container. It runs your tests, reads the failures and goes again. Every pass
changes the workspace and feeds the result back in before the agent decides what to do next.

## While it runs

You watch the plan, the commands, the file changes and the cost as they happen. You can send a
message at any point and the agent reads it before its next step. You can pause it, edit files
yourself, open your own terminal, then let it carry on, and it is told what you changed. You can
open the app running inside the container and click around.

When the agent needs an answer from you, the run waits. It can wait for days without holding a
container open.

Everything that happens is written to an event log. That is what the page streams while you watch,
and it is how a run that was killed picks up where it stopped rather than starting over.

## When the work is done

On a project linked to GitHub, Kairox opens a pull request, and review comments start a follow-up
run in the same session. On a project hosted by Kairox, you merge into main from the app.

Every run finishes as done, blocked or failed, with a summary of what happened.

## Status

Kairox is not open yet. The first sessions go out to a small group. You can join the waitlist at
[kairox.cloud](https://kairox.cloud).

This repository is the marketing site. The product is built separately.
