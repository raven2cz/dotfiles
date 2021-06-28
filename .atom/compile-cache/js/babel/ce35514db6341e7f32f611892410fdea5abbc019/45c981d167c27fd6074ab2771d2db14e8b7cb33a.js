
// Can say that a busy signal will only appear when a given file is open.
// Default = null, meaning the busy signal applies to all files.

// Is user waiting for computer to finish a task? (traditional busy spinner)
// or is the computer waiting for user to finish a task? (action required)
// Default = spinner.

// Debounce it? default = true for busy-signal, and false for action-required.

// If onClick is set, then the tooltip will be clickable. Default = null.

// If set to true, the busy signal tooltip will be immediately revealed
// when it first becomes visible (without explicit mouse interaction).

// You can set/update the title.

// Dispose of the signal when done to make it go away.

// Activates the busy signal with the given title and returns the promise
// from the provided callback.
// The busy signal automatically deactivates when the returned promise
// either resolves or rejects.

// Activates the busy signal. Set the title in the returned BusySignal
// object (you can update the title multiple times) and dispose it when done.

// This is a no-op. When someone consumes the busy service, they get back a
// reference to the single shared instance, so disposing of it would be wrong.
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiIvaG9tZS9ib3gvLmF0b20vcGFja2FnZXMvYnVzeS1zaWduYWwvZGVjbHMvYXRvbS1pZGUuanMiLCJzb3VyY2VzQ29udGVudCI6W119