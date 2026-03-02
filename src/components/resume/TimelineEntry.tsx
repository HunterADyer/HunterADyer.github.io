import { useState } from 'react';

interface TimelineItem {
  title: string;
  subtitle: string;
  date: string;
  description: string;
  highlights?: string[];
  type: 'experience' | 'education' | 'publication';
}

interface Props {
  item: TimelineItem;
}

const typeColors: Record<string, string> = {
  experience: '#00ff88',
  education: '#2563eb',
  publication: '#f59e0b',
};

export default function TimelineEntry({ item }: Props) {
  const [expanded, setExpanded] = useState(false);
  const color = typeColors[item.type] || '#00ff88';

  return (
    <div className="timeline-entry">
      <div className="timeline-dot" style={{ borderColor: color }} />
      <div
        className={`timeline-card ${expanded ? 'expanded' : ''}`}
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded(!expanded)}
      >
        <div className="timeline-header">
          <div>
            <span className="timeline-date">{item.date}</span>
            <h3 className="timeline-title">{item.title}</h3>
            <p className="timeline-subtitle">{item.subtitle}</p>
          </div>
          <span className={`timeline-toggle ${expanded ? 'open' : ''}`}>
            &#9662;
          </span>
        </div>

        {expanded && (
          <div className="timeline-details">
            <p>{item.description}</p>
            {item.highlights && item.highlights.length > 0 && (
              <ul>
                {item.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
}
