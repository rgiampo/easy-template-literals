import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Read initial settings
  let config = vscode.workspace.getConfiguration("easyTemplateLiterals");
  let isEnabled = config.get<boolean>("enable", true);
  let languages = config.get<string[]>("languages", [
    "javascript",
    "typescript",
  ]);
  let insertPattern = config.get<string>("insertPattern", "{}");
  let requireTemplateLiteral = config.get<boolean>(
    "requireTemplateLiteral",
    true
  );

  // Watch for configuration changes
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("easyTemplateLiterals")) {
      config = vscode.workspace.getConfiguration("easyTemplateLiterals");
      isEnabled = config.get<boolean>("enable", true);
      languages = config.get<string[]>("languages", [
        "javascript",
        "typescript",
      ]);
      insertPattern = config.get<string>("insertPattern", "{}");
      requireTemplateLiteral = config.get<boolean>(
        "requireTemplateLiteral",
        true
      );
    }
  });

  // Document change listener
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (!isEnabled) {
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document !== event.document) {
      return;
    }

    // Check if the language is supported
    const languageId = editor.document.languageId;
    if (!languages.includes(languageId)) {
      return;
    }

    // Retrieve recent changes
    const changes = event.contentChanges;
    if (changes.length === 0) {
      return;
    }

    const lastChange = changes[changes.length - 1];

    // Check if the user typed "$"
    if (lastChange.text === "$") {
      const document = editor.document;

      // Calculate the position after the inserted text
      const cursorPosition = lastChange.range.start.translate(
        0,
        lastChange.text.length
      );

      // Determine if we should insert the pattern
      let shouldInsert = true;

      if (requireTemplateLiteral) {
        // Check if we are in a template literal
        const lineText = document.lineAt(cursorPosition.line).text;
        const textBeforeCursor = lineText.substring(
          0,
          cursorPosition.character
        );
        const textAfterCursor = lineText.substring(cursorPosition.character);

        const isInsideTemplateLiteral =
          textBeforeCursor.lastIndexOf("`") >
            textBeforeCursor.lastIndexOf('"') &&
          textBeforeCursor.lastIndexOf("`") >
            textBeforeCursor.lastIndexOf("'") &&
          (textAfterCursor.indexOf("`") !== -1 ||
            document
              .getText(
                new vscode.Range(
                  cursorPosition,
                  new vscode.Position(
                    document.lineCount - 1,
                    Number.MAX_SAFE_INTEGER
                  )
                )
              )
              .includes("`"));

        shouldInsert = isInsideTemplateLiteral;
      }

      if (shouldInsert) {
        editor
          .edit((editBuilder) => {
            // Replace '|' with the cursor position
            const cursorIndex = insertPattern.indexOf("|");
            let textToInsert = insertPattern.replace("|", "");
            editBuilder.insert(cursorPosition, textToInsert);
          })
          .then(() => {
            // Move the cursor to the specified position
            const cursorIndex = insertPattern.indexOf("|");
            const offset =
              cursorIndex >= 0
                ? cursorIndex
                : Math.floor(insertPattern.length / 2);
            const newPosition = cursorPosition.translate(0, offset);
            editor.selection = new vscode.Selection(newPosition, newPosition);
          });
      }
    }
  });
}

export function deactivate() {}
