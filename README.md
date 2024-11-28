# Easy Template Literals

Facilitate typing of template literals in JavaScript and TypeScript by automatically inserting curly braces `{}` after typing the `$` symbol.

![Logo](images/icon.png)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Automatic Insertion of `{}`**: When you type `$` inside a template literal, the extension automatically inserts `{}` and places the cursor inside.
- **Customizable**: Configure the behavior of the extension through VS Code settings.
- **Multi-language Support**: Works with JavaScript, TypeScript, and other languages that use template literals.

## Installation

1. **Open Visual Studio Code**.
2. **Navigate to the Extensions view**:
   - Click on the Extensions icon in the Activity Bar on the side of the window.
   - Or press `Ctrl+Shift+X` (`Cmd+Shift+X` on macOS).
3. **Search for "Easy Template Literals"**.
4. **Click "Install"** to install the extension.
5. **Reload VS Code** if prompted.

Alternatively, install directly from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=rgiampo.easy-template-literals).

## Usage

1. **Open a JavaScript or TypeScript file** in Visual Studio Code.
2. **Begin typing a template literal** using backticks `` ` ``.
3. **Type `$` inside the template literal**.
   - The extension will automatically insert `{}` and position the cursor inside the braces.

**Example:**

Typing:

```javascript
const greeting = `Hello $`;
```

Automatically becomes:

```javascript
const greeting = `Hello ${}`;
```

With the cursor placed between `{}`.

## Configuration

Customize the extension's behavior via VS Code settings.

### Accessing Settings

1. Go to **File** > **Preferences** > **Settings** (or **Code** > **Preferences** > **Settings** on macOS).
2. Search for **"Easy Template Literals"** in the search bar.

### Available Settings

- **Enable Extension** (`easyTemplateLiterals.enable`)

  - **Type**: `boolean`
  - **Default**: `true`
  - **Description**: Enable or disable the extension.

- **Supported Languages** (`easyTemplateLiterals.languages`)

  - **Type**: `string[]`
  - **Default**: `["javascript", "typescript"]`
  - **Description**: Specify the languages in which the extension is active (e.g., `["javascript", "typescript"]`).

- **Insert Pattern** (`easyTemplateLiterals.insertPattern`)

  - **Type**: `string`
  - **Default**: `"{}"`
  - **Description**: The pattern to insert after the `$` symbol. Use `|` to indicate the cursor position (e.g., `"{|}"`).

- **Require Template Literal** (`easyTemplateLiterals.requireTemplateLiteral`)

  - **Type**: `boolean`
  - **Default**: `true`
  - **Description**: If `true`, the extension functions only inside template literals.

### Example Configuration

**Disable the Extension:**

```json
{
  "easyTemplateLiterals.enable": false
}
```

**Activate Extension Only for TypeScript:**

```json
{
  "easyTemplateLiterals.languages": ["typescript"]
}
```

**Customize Insert Pattern:**

```json
{
  "easyTemplateLiterals.insertPattern": "{|}"
}
```

**Use Extension Outside Template Literals:**

```json
{
  "easyTemplateLiterals.requireTemplateLiteral": false
}
```

## Contributing

Contributions are welcome!

- **Report Issues**: If you encounter any bugs or have suggestions, please [open an issue](https://github.com/rgiampo/easy-template-literals/issues).
- **Pull Requests**: Feel free to submit pull requests to improve the extension.

## License

This project is licensed under the [MIT License](LICENSE).

---
