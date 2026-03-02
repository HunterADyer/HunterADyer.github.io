import{j as o}from"./jsx-runtime.D_zvdyIk.js";import{r as s}from"./index.DiEladB3.js";function v({initialCode:u=`// Write your code here
console.log("Hello, world!");`,language:t="javascript",title:p="Code Playground"}){const[a,c]=s.useState(u),[d,l]=s.useState(""),m=s.useRef(null),g=s.useCallback(()=>{if(t!=="javascript"){l(`// Execution not supported for ${t}
// This is a display-only editor.`);return}try{const r=[],n={log:(...e)=>r.push(e.map(String).join(" ")),error:(...e)=>r.push(`Error: ${e.map(String).join(" ")}`),warn:(...e)=>r.push(`Warning: ${e.map(String).join(" ")}`)};new Function("console",a)(n),l(r.join(`
`)||"// No output")}catch(r){l(`Error: ${r.message}`)}},[a,t]),b=r=>{if(r.key==="Tab"){r.preventDefault();const n=r.target,i=n.selectionStart,e=n.selectionEnd,f=a.substring(0,i)+"  "+a.substring(e);c(f),requestAnimationFrame(()=>{n.selectionStart=n.selectionEnd=i+2})}};return o.jsxs("div",{className:"code-playground",children:[o.jsxs("div",{className:"playground-header",children:[o.jsx("span",{className:"playground-title",children:p}),o.jsxs("div",{className:"playground-actions",children:[o.jsx("span",{className:"playground-lang",children:t}),t==="javascript"&&o.jsx("button",{onClick:g,className:"run-btn",children:"Run ▶"})]})]}),o.jsxs("div",{className:"playground-body",children:[o.jsx("textarea",{ref:m,value:a,onChange:r=>c(r.target.value),onKeyDown:b,className:"playground-editor",spellCheck:!1}),d&&o.jsxs("div",{className:"playground-output",children:[o.jsx("div",{className:"output-label",children:"Output"}),o.jsx("pre",{children:d})]})]}),o.jsx("style",{children:`
        .code-playground {
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          margin: 1.5rem 0;
          font-family: 'JetBrains Mono', monospace;
        }
        .playground-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          font-size: 0.8rem;
        }
        .playground-title {
          color: var(--color-heading);
          font-weight: 500;
        }
        .playground-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .playground-lang {
          color: var(--color-muted);
          font-size: 0.75rem;
        }
        .run-btn {
          padding: 0.25rem 0.75rem;
          border: 1px solid var(--color-accent);
          border-radius: 4px;
          background: transparent;
          color: var(--color-accent);
          cursor: pointer;
          font-family: inherit;
          font-size: 0.8rem;
          transition: all 0.15s ease;
        }
        .run-btn:hover {
          background: var(--color-accent);
          color: var(--color-bg);
        }
        .playground-editor {
          width: 100%;
          min-height: 150px;
          padding: 1rem;
          border: none;
          background: var(--color-bg);
          color: var(--color-text);
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.6;
          resize: vertical;
          outline: none;
          tab-size: 2;
        }
        .playground-output {
          border-top: 1px solid var(--color-border);
          background: var(--color-surface);
        }
        .output-label {
          padding: 0.35rem 1rem;
          font-size: 0.7rem;
          color: var(--color-muted);
          border-bottom: 1px solid var(--color-border);
        }
        .playground-output pre {
          padding: 1rem;
          margin: 0;
          font-size: 0.85rem;
          color: var(--color-accent);
          white-space: pre-wrap;
          background: transparent;
          border: none;
          border-radius: 0;
        }
      `})]})}export{v as default};
