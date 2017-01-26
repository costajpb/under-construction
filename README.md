# under-construction

Imagine the situation. You need to edit a node.js module you have authored. Before you begin, you'll eventually need to run some scripts (e.g. Grunt or Browserify) and maybe NPM link other modules as well. I know it's boring, but you might be finding yourself doing this again and again, since it's likely that your code will be calling for maintenance afterwards. What about specifying what to do in these situations once and having `under-construction` handle it for you?

## under-construction to the rescue!

`under-construction` is a configuration-based CLI program that will bear part of the burden of tedious preparation tasks for that one who is going on node package development. Running `under-construction` under a directory where lies a `package.json` file will try to execute what is specified on its `scripts.underconstruction` field. If you need to work on local dependencies simultaneously, just have the `config.underconstruction.link` field specified with those names in an array. `under-construction` will NPM link them for you, if you really have them globally installed, and will also put them under construction if they have the `scripts.underconstruction` field specified.

### Example
```
{
  "name": "my-package",
  "version": "0.0.1",
  ...
  "scripts": {
    "underconstruction": "preparation --arg"
  },
  ...
  "config": {
    "underconstruction": {
      "link": [ "my-dependency" ]
    }
  },
  ...
  "dependencies": {
    "my-dependency": "^0.0.1"
  }
}
```
In this very example, `under-construction` would try to run `preparation`, passing the argument `--arg` together, and would also link `my-dependency` if it was globally installed.
