import * as d3 from 'd3';

export function addTooltip({
  svg,
  hue,
  name,
}: {
  svg: any;
  hue: number;
  name: string;
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
      tooltip
        .style(
          'left',
          event.offsetX - (tooltip.node()?.clientWidth || 0) - 20 + 'px',
        )
        .style('top', event.offsetY + 20 + 'px')
        .style('visibility', 'visible');
      const target = d3.select(event.target as Element);
      const country = target.attr('data-country');
      if (country) {
        tooltip
          .html(
            `<b>${country}</b>: <b>${target.attr('data-count')}</b> ${name}`,
          )
          .style('visibility', 'visible');
      } else {
        tooltip.html('').style('visibility', 'hidden');
      }
    })
    .on('mouseout', () => {
      tooltip.html('').style('visibility', 'hidden');
    });
}
