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

## Arduino setup on another Mac

Install the command-line tools and Nano ESP32 platform:

```bash
brew install arduino-cli
arduino-cli core update-index
arduino-cli core install arduino:esp32
```

Create the local firmware configuration and edit it with that computer's Wi-Fi
credentials and current local IP address:

```bash
cp firmware/bitebud_esp32_sensor/secrets.example.h \
  firmware/bitebud_esp32_sensor/secrets.h
```

`secrets.h` is intentionally ignored by Git, so it must be configured separately
on each computer and must never be committed. Find the current Wi-Fi address on
macOS with `ipconfig getifaddr en0`. If the network changes, update
`BITEBUD_SERVER_URL`, double-press the Nano reset button if necessary to enter
upload mode, and upload the firmware again.

Start the local dashboard with:

```bash
npm install
npm run dev
```

## Push policy for BiteBud

When asked to push BiteBud changes, include all relevant completed work in the same commit or set of commits:

- Put code, tests, and configuration in their appropriate existing project folders.
- Put non-code context—such as hardware decisions, future plans, workflows, and project decisions—in `project-notes/`.
- Review the changes, run the relevant tests, commit, and push to `main`.
- Do not add unrelated files, duplicate project copies, secrets, installed dependencies, or build output.
