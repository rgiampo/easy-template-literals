import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Leggi le impostazioni iniziali
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

  // Ascolta le modifiche alla configurazione
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

  // Listener per le modifiche al documento
  vscode.workspace.onDidChangeTextDocument((event) => {
    if (!isEnabled) {
      return;
    }

    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document !== event.document) {
      return;
    }

    // Verifica se il linguaggio è supportato
    const languageId = editor.document.languageId;
    if (!languages.includes(languageId)) {
      return;
    }

    // Ottieni le modifiche recenti
    const changes = event.contentChanges;
    if (changes.length === 0) {
      return;
    }

    const lastChange = changes[changes.length - 1];

    // Controlla se l'utente ha digitato "$"
    if (lastChange.text === "$") {
      const document = editor.document;

      // Calcola la posizione dopo il testo inserito
      const cursorPosition = lastChange.range.start.translate(
        0,
        lastChange.text.length
      );

      // Verifica se dobbiamo inserire il pattern
      let shouldInsert = true;

      if (requireTemplateLiteral) {
        // Controlla se siamo in un template literal
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
            // Sostituisci '|' con la posizione del cursore
            const cursorIndex = insertPattern.indexOf("|");
            let textToInsert = insertPattern.replace("|", "");
            editBuilder.insert(cursorPosition, textToInsert);
          })
          .then(() => {
            // Posiziona il cursore nel punto specificato
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
