import { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import './index.scss';
import './userWorker';

type EditorType = {
  theme?: string;
};

const Editor = (props: EditorType) => {
  const { theme } = props;
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        if (editor) return editor;

        return monaco.editor.create(monacoEl.current!, {
          value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
          language: 'typescript',
          theme: theme ? `vs-${theme}` : 'vs-light',
        });
      });
    }

    return () => editor?.dispose();
  }, [monacoEl.current]);

  useEffect(() => {
    if (!editor) return;

    editor.updateOptions({
      theme: theme ? `vs-${theme}` : 'vs-light',
    });
  }, [theme]);

  return <div className="Editor" ref={monacoEl}></div>;
};

export default Editor;