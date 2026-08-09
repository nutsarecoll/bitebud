# Working From Multiple Computers

Repository: `https://github.com/nutsarecoll/bitebud.git`

The repository is private. Each computer clones it once, then uses GitHub to synchronize later work.

## First setup on another computer

```bash
git clone https://github.com/nutsarecoll/bitebud.git
cd bitebud
npm install
npm test
```

The GitHub account used on that computer must have access to the private repository.

## Everyday sync routine

Before starting work:

```bash
git pull
```

After making and checking changes:

```bash
git add .
git commit -m "Describe the change"
git push
```

Then, on the other computer:

```bash
git pull
```

Avoid editing the same file independently on both computers before either computer pushes its work. If a change has already been pushed from elsewhere, pull first.
