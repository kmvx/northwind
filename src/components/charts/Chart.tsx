import * as d3 from 'd3';
import type { NavigateFunction } from 'react-router-dom';

export function addTooltip({
  svg,
  hue,
  name,
  navigate,
}: {
  svg: any;
  hue: number;
  name: string;
  navigate: NavigateFunction;
}) {
  const svgParent = d3.select(svg.node()?.parentNode as Element);
  svgParent.selectAll('.chart-tooltip').remove();
  const tooltip = svgParent
    .append('div')
    .attr('class', 'chart-tooltip')
    .style('border-color', `hsl(${hue} 100% 50%`)
    .style('visibility', 'hidden');
  svgParent
    .on('mousemove', (event: MouseEvent) => {
      const target = d3.select(event.target as Element);
      const country = target.attr('data-country');
      let cursor = null;
      if (country) {
        const count = target.attr('data-count');
        tooltip
          .html(`<b>${country}</b>: <b>${count}</b> ${name}`)
          .style('visibility', 'visible');
        if (+count) {
          cursor = 'pointer';
        }
      } else {
        tooltip.html('').style('visibility', 'hidden');
      }
      svg.style('cursor', cursor);

      // Set position
      const width = tooltip.node()?.clientWidth || 0;
      let left = event.offsetX - width - 25;
      left = Math.max(0, left);
      tooltip
        .style('left', left + 'px')
        .style('top', event.offsetY + 25 + 'px');
    })
    .on('mouseout', () => {
      tooltip.html('').style('visibility', 'hidden');
    })
    .on('click', (event) => {
      const target = d3.select(event.target as Element);
      if (+target.attr('data-count')) {
        navigate(`/${name}?country=${target.attr('data-country')}`);
      }
    });
}
