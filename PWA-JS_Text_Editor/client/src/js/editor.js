// Import methods to save and get data from the indexedDB database in './database.js'
import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    // Retrieve content stored in local storage under the key 'content'
    const localData = localStorage.getItem('content');

    // Check if the CodeMirror library is loaded in the current environment
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    // Initialize the CodeMirror editor with specified configurations.
    this.editor = CodeMirror(document.querySelector('#main'), {
      value: header,                // Initial value of the editor
      mode: 'javascript',       // Syntax highlighting mode
      theme: 'monokai',         // UI theme for the editor
      lineNumbers: true,        // Display line numbers
      lineWrapping: true,       // Wrap lines to fit within the editor's width
      autofocus: true,          // Autofocus the editor on page load
      indentUnit: 2,            // Number of spaces per indentation level
      tabSize: 2,               // Number of spaces per tab character
      extraKeys: {"Ctrl-Space": "autocomplete"}
    });
    editor.setSize(null, "500px");
    // Once the editor is ready, retrieve content from indexedDB using getDb method.
    // If there's no data in indexedDB, fall back to the content in local storage.
    // If neither indexedDB nor local storage has content, use the default 'header' content.
    getDb().then((data) => {
      console.info('Loaded data from IndexedDB, injecting into editor');
      this.editor.setValue(data || localData || header);
    });
    // Every time the content of the editor changes, save the new content to local storage.
    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });
    // When the editor loses focus (e.g., when user clicks outside of the editor),
    // save the editor's content to indexedDB using the putDb method.
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(localStorage.getItem('content'));
    });
  }
}
