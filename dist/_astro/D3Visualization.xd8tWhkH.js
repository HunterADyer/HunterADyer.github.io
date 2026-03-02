import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as a}from"./index.DiEladB3.js";function n({width:i=600,height:o=400,title:l="Visualization",renderChart:s}){const r=a.useRef(null);return a.useEffect(()=>{if(r.current){for(;r.current.firstChild;)r.current.removeChild(r.current.firstChild);s(r.current,i,o)}},[s,i,o]),e.jsxs("div",{className:"d3-visualization",children:[e.jsx("div",{className:"viz-header",children:e.jsx("span",{className:"viz-title",children:l})}),e.jsx("div",{className:"viz-body",children:e.jsx("svg",{ref:r,width:i,height:o,viewBox:`0 0 ${i} ${o}`,style:{maxWidth:"100%",height:"auto"}})}),e.jsx("style",{children:`
        .d3-visualization {
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          margin: 1.5rem 0;
        }
        .viz-header {
          padding: 0.5rem 1rem;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
        }
        .viz-title {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-heading);
        }
        .viz-body {
          padding: 1rem;
          display: flex;
          justify-content: center;
          background: var(--color-bg);
        }
      `})]})}export{n as default};
