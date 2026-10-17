// Contract between the picker UI (webview) and any host that renders it: the VS Code extension (desktop / web),
// the browser demo, or another VS Code-compatible environment (VSCodium, Code-OSS builds, a dream-os VSC ...).
// Bump PROTOCOL_VERSION on a breaking change; hosts and UI compare the major number during the handshake.
export const PROTOCOL_VERSION = 1;

/** webview -> host */
export type ToHost =
  | { type: 'init'; protocol: number }
  | { type: 'preview'; selection: unknown }
  | { type: 'generate'; selection: unknown; base: Record<string, string>; request: string }
  | { type: 'save'; files: Record<string, string> }
  | { type: 'openFile'; path: string; content: string }
  | { type: 'copy'; text: string }
  | { type: 'setKey' }
  | { type: 'loadKey' };

/** host -> webview */
export type ToWebview =
  | { type: 'hello'; protocol: number; host: string }
  | { type: 'files'; files: Record<string, string> }
  | { type: 'merge'; files: Record<string, string> }
  | { type: 'status'; text: string }
  | { type: 'keyState'; has: boolean };

export function protocolCompatible(theirs: number): boolean {
  return Math.floor(theirs) === Math.floor(PROTOCOL_VERSION);
}
