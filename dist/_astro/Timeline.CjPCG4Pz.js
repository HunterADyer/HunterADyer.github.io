import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as s}from"./index.DiEladB3.js";const a={experience:"#00ff88",education:"#2563eb",publication:"#f59e0b"};function d({item:i}){const[t,r]=s.useState(!1),o=a[i.type]||"#00ff88";return e.jsxs("div",{className:"timeline-entry",children:[e.jsx("div",{className:"timeline-dot",style:{borderColor:o}}),e.jsxs("div",{className:`timeline-card ${t?"expanded":""}`,onClick:()=>r(!t),role:"button",tabIndex:0,onKeyDown:l=>l.key==="Enter"&&r(!t),children:[e.jsxs("div",{className:"timeline-header",children:[e.jsxs("div",{children:[e.jsx("span",{className:"timeline-date",children:i.date}),e.jsx("h3",{className:"timeline-title",children:i.title}),e.jsx("p",{className:"timeline-subtitle",children:i.subtitle})]}),e.jsx("span",{className:`timeline-toggle ${t?"open":""}`,children:"▾"})]}),t&&e.jsxs("div",{className:"timeline-details",children:[e.jsx("p",{children:i.description}),i.highlights&&i.highlights.length>0&&e.jsx("ul",{children:i.highlights.map((l,n)=>e.jsx("li",{children:l},n))})]})]}),e.jsx("style",{children:`
        .timeline-entry {
          position: relative;
          padding-left: 48px;
          margin-bottom: 1.5rem;
        }
        .timeline-dot {
          position: absolute;
          left: 13px;
          top: 8px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid;
          background: var(--color-bg);
          z-index: 1;
        }
        .timeline-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 1rem 1.25rem;
          cursor: pointer;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .timeline-card:hover {
          border-color: var(--color-accent);
        }
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .timeline-date {
          font-size: 0.75rem;
          color: var(--color-muted);
        }
        .timeline-title {
          font-size: 1rem;
          margin: 0.25rem 0 0;
          color: var(--color-heading);
        }
        .timeline-subtitle {
          font-size: 0.85rem;
          color: var(--color-muted);
          margin: 0;
        }
        .timeline-toggle {
          font-size: 0.75rem;
          color: var(--color-muted);
          transition: transform 0.2s ease;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }
        .timeline-toggle.open {
          transform: rotate(180deg);
        }
        .timeline-details {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--color-border);
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-text);
        }
        .timeline-details ul {
          margin-top: 0.5rem;
          padding-left: 1.25rem;
          list-style: disc;
        }
        .timeline-details li {
          margin-bottom: 0.25rem;
        }
        @media (max-width: 600px) {
          .timeline-entry {
            padding-left: 36px;
          }
          .timeline-dot {
            left: 5px;
            width: 14px;
            height: 14px;
          }
        }
      `})]})}function p({items:i}){return e.jsxs("div",{className:"timeline",children:[e.jsx("div",{className:"timeline-line"}),i.map((t,r)=>e.jsx(d,{item:t},r)),e.jsx("style",{children:`
        .timeline {
          position: relative;
          padding: 1rem 0;
          max-width: 800px;
          margin: 0 auto;
        }
        .timeline-line {
          position: absolute;
          left: 20px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-border);
        }
        @media (max-width: 600px) {
          .timeline-line {
            left: 12px;
          }
        }
      `})]})}export{p as default};
