import { useEffect, useRef } from 'react';

interface Props {
  width?: number;
  height?: number;
  title?: string;
  renderChart: (svg: SVGSVGElement, width: number, height: number) => void;
}

export default function D3Visualization({
  width = 600,
  height = 400,
  title = 'Visualization',
  renderChart,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      // Clear previous content
      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }
      renderChart(svgRef.current, width, height);
    }
  }, [renderChart, width, height]);

  return (
    <div className="d3-visualization">
      <div className="viz-header">
        <span className="viz-title">{title}</span>
      </div>
      <div className="viz-body">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
}
