# About multi-root workspace released to stable since 1.18

## Compatibility

This extension still can be working on VS Code old version. 

## Project/Workspace

1. The tracking record still relating project information but not workspace information.
2. If you editing/watching a file outside workspace. A record relating **last active project** will be tracked.

For example:

You are coding on `workspace`, and this workspace contained two projects(root-path): `/path/to/a` and `/path/to/b` 

1. Firstly, you watching file `/path/to/a/file`. this watching record will be related to `/path/to/a`.
2. Secondly, you watching file `/path/to/b/file`. this watching record will be related to `/path/to/b`.
3. Then, you watching file `/path/to/c/file` what a file outside workspace.
	- This watching record will be related to `/path/to/b` because `/path/to/b` is last active project.

