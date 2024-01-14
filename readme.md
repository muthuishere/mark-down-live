# MarkDownLive

Effortlessly stream and present your Markdown slides live in-browser with MarkDownLive. Ideal for educators, presenters, and anyone needing to create dynamic, real-time presentations. Simply write in Markdown, and let MarkDownLive handle the live streaming magic!

## Features

- **Live Streaming**: Instantly stream your Markdown slides live in your browser.
- **Typewriter Effect**: New changes appear with a captivating typewriter effect.
- **Marp CLI Compatibility**: Create slides with simple Markdown or Marp CLI format.
- **Easy Access**: View the latest slide at `http://localhost:9500`.
- **Full Presentation Download**: Download your entire presentation anytime.

## Installation

Install MarkDownLive using npm:

```bash
npm install markdown-live
```

Or run it directly with npx:

```bash
npx https://github.com/muthuishere/slide-presenter-livestream.git
npx markdown-live
```

## Usage

Navigate to a folder containing your markdown file and run:

```bash
markdown-live
```

If the folder contains one markdown file, it will automatically be served. To specify a file:

```bash
markdown-live path/to/your/file.md
```

## Example

Create a Markdown file (e.g., `presentation.md`) and run:

```bash
markdown-live presentation.md
```

Open your browser and go to `http://localhost:9500` to see your live presentation.

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/muthuishere/markdown-live/issues).

## License

[MIT](LICENSE)
[Third Party Licenses](THIRD-PARTY-LICENSES.txt)