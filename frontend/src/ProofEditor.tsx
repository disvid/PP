import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as monaco from 'monaco-editor'
import Editor, { loader } from '@monaco-editor/react'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'

// Serve Monaco from the local bundle instead of the CDN copy @monaco-editor/react would fetch by default.
loader.config({ monaco })
;(self as unknown as { MonacoEnvironment: monaco.Environment }).MonacoEnvironment = {
  getWorker: () => new EditorWorker(),
}

const FONT = "'Fira Code Variable', ui-monospace, Consolas, monospace"

// The hover provider is global to the language, so it calls whichever editor mounted last. A stack, so that an editor
// opened on top of another (the tutorial over the game) hands hovering back when it closes.
type HoverHandler = (line: number) => Promise<string | null>
const hoverHandlers: HoverHandler[] = []
let registered = false

/** Language, theme and hover provider; runs once, before the first editor is created. */
function setup(m: typeof monaco) {
  if (registered) return
  registered = true
  m.languages.register({ id: 'proof' })
  m.languages.setMonarchTokensProvider('proof', {
    tokenizer: {
      root: [
        [/--.*$/, 'comment'],
        [/\bdef\b/, 'keyword'],
        [/\b(swap|paint|rotate)\b/, 'type.identifier'],
        // color names are drawn in their own color
        [/\bblue\b/, 'color-blue'],
        [/\bgreen\b/, 'color-green'],
        [/\bred\b/, 'color-red'],
        [/\byellow\b/, 'color-yellow'],
        [/\bpurple\b/, 'color-purple'],
        [/\d+/, 'number'],
        [/:=/, 'operator'],
      ],
    },
  })
  // stark black editor with neon syntax colors: the one dark block on the paper page
  m.editor.defineTheme('proof-brutal', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '8a8a8a', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'ff2d95', fontStyle: 'bold' },
      { token: 'type.identifier', foreground: '00e5ff', fontStyle: 'bold' },
      { token: 'number', foreground: 'ffe600' },
      { token: 'operator', foreground: 'f5f5f5' },
      { token: 'color-blue', foreground: '6d96ff' },
      { token: 'color-green', foreground: '3dff85' },
      { token: 'color-red', foreground: 'ff6b6b' },
      { token: 'color-yellow', foreground: 'ffe600' },
      { token: 'color-purple', foreground: 'c58bff' },
    ],
    colors: {
      'editor.background': '#0a0a0a',
      'editor.foreground': '#f5f5f5',
      'editorGutter.background': '#0a0a0a',
      'editorLineNumber.foreground': '#5c5c5c',
      'editorLineNumber.activeForeground': '#ffe600',
      'editorCursor.foreground': '#ffe600',
      'editor.selectionBackground': '#ffe60044',
      'editor.inactiveSelectionBackground': '#ffe60022',
      'editorIndentGuide.background1': '#ffffff14',
      'editorWidget.background': '#0a0a0a',
      'editorWidget.border': '#ffe600',
      'editorHoverWidget.background': '#0a0a0a',
      'editorHoverWidget.border': '#ffe600',
      'scrollbarSlider.background': '#ffe60055',
      'scrollbarSlider.hoverBackground': '#ffe600aa',
    },
  })
  // Hovering a line asks the backend what that line would do; the Game turns the answer into a ghost overlay.
  m.languages.registerHoverProvider('proof', {
    provideHover: async (_model, pos) => {
      const text = await hoverHandlers[hoverHandlers.length - 1]?.(pos.lineNumber)
      return text ? { contents: [{ value: text }] } : null
    },
  })
}

interface Props {
  /** the text a level's model starts with; the editor owns the text afterwards (one model per `resetKey`) */
  value: string
  resetKey: string
  /** locks the editor (before the level is started) */
  readOnly: boolean
  onChange: (v: string) => void
  activeLine: number | null
  errorLine: number | null
  errorText: string
  onHover: (line: number) => Promise<string | null>
  onMouseLine: (line: number | null) => void
  /** text to add to the proof: a new `id` inserts it, at the top (helper definitions) or at the end (calls) */
  insert?: { id: number; text: string; where: 'top' | 'end' } | null
}

export default function ProofEditor({ value, resetKey, readOnly, onChange, activeLine, errorLine, errorText, onHover, onMouseLine, insert }: Props) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const decorations = useRef<monaco.editor.IEditorDecorationsCollection | null>(null)
  const [ready, setReady] = useState(false)
  // latest callbacks, so the editor itself never has to be re-created
  const myHover = useRef<HoverHandler | null>(null)
  const cb = useRef({ onChange, onHover, onMouseLine })
  cb.current = { onChange, onHover, onMouseLine }

  const options = useMemo<monaco.editor.IStandaloneEditorConstructionOptions>(
    () => ({
      readOnly,
      minimap: { enabled: false },
      fontFamily: FONT,
      fontSize: 14,
      fontLigatures: true,
      lineHeight: 22,
      padding: { top: 14, bottom: 14 },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      hover: { delay: 150 },
      renderLineHighlight: 'none',
      fixedOverflowWidgets: true, // let the hover tooltip escape the  container
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      glyphMargin: false,
      folding: false,
      lineNumbersMinChars: 3,
      lineDecorationsWidth: 16, // room for the arrow beside the line being executed
      cursorBlinking: 'smooth',
      smoothScrolling: true,
      scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
    }),
    [readOnly],
  )

  const handleChange = useCallback((v: string | undefined) => cb.current.onChange(v ?? ''), [])

  const handleMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
    decorations.current = editor.createDecorationsCollection()
    myHover.current = (line) => cb.current.onHover(line)
    hoverHandlers.push(myHover.current)
    editor.onMouseMove((e) => cb.current.onMouseLine(e.target.position?.lineNumber ?? null))
    editor.onMouseLeave(() => cb.current.onMouseLine(null))
    // the variable font may arrive after Monaco measured its characters
    void document.fonts?.ready.then(() => monaco.editor.remeasureFonts())
    setReady(true)
  }, [])

  // text pushed in from outside (the helper builder)
  const lastInsert = useRef(0)
  useEffect(() => {
    const e = editorRef.current
    const model = e?.getModel()
    if (!ready || !e || !model || !insert || insert.id === lastInsert.current) return
    lastInsert.current = insert.id
    const text = model.getValue()
    const range =
      insert.where === 'top'
        ? new monaco.Range(1, 1, 1, 1)
        : new monaco.Range(model.getLineCount(), model.getLineMaxColumn(model.getLineCount()), model.getLineCount(), model.getLineMaxColumn(model.getLineCount()))
    const lead = insert.where === 'end' && text !== '' && !text.endsWith('\n') ? '\n' : ''
    e.executeEdits('helper-builder', [{ range, text: `${lead}${insert.text}\n`, forceMoveMarkers: true }])
    e.focus()
  }, [ready, insert])

  useEffect(
    () => () => {
      const i = hoverHandlers.indexOf(myHover.current as HoverHandler)
      if (i >= 0) hoverHandlers.splice(i, 1)
    },
    [],
  )

  useEffect(() => {
    const e = editorRef.current
    const model = e?.getModel()
    if (!ready || !e || !model) return
    const whole = (line: number, className: string) => ({
      range: new monaco.Range(line, 1, line, 1),
      options: { isWholeLine: true, className, ...(className === 'ln-active' ? { linesDecorationsClassName: 'ln-active-gutter' } : {}) },
    })
    decorations.current?.set([
      ...(activeLine && activeLine <= model.getLineCount() ? [whole(activeLine, 'ln-active')] : []),
      ...(errorLine && errorLine <= model.getLineCount() ? [whole(errorLine, 'ln-err')] : []),
    ])
    monaco.editor.setModelMarkers(
      model,
      'proof',
      errorLine && errorLine <= model.getLineCount()
        ? [{ severity: monaco.MarkerSeverity.Error, message: errorText, startLineNumber: errorLine, startColumn: 1, endLineNumber: errorLine, endColumn: model.getLineMaxColumn(errorLine) }]
        : [],
    )
  }, [ready, activeLine, errorLine, errorText, resetKey])

  return (
    <div data-testid="editor" className="h-72 overflow-hidden border-4 border-ink bg-abyss">
      <Editor
        height="100%"
        path={resetKey}
        defaultValue={value}
        language="proof"
        theme="proof-brutal"
        options={options}
        beforeMount={setup}
        onMount={handleMount}
        onChange={handleChange}
        loading={<span className="p-4 font-mono text-sm text-neon">sharpening pencils…</span>}
      />
    </div>
  )
}
