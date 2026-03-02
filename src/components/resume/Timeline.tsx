import { useState } from 'react';
import TimelineEntry from './TimelineEntry';

interface TimelineItem {
  title: string;
  subtitle: string;
  date: string;
  description: string;
  highlights?: string[];
  type: 'experience' | 'education' | 'publication';
}

interface Props {
  items: TimelineItem[];
}

export default function Timeline({ items }: Props) {
  return (
    <div className="timeline">
      <div className="timeline-line" />
      {items.map((item, i) => (
        <TimelineEntry key={i} item={item} />
      ))}
      <style>{`
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
      `}</style>
    </div>
  );
}
