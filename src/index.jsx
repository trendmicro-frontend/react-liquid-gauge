import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { color } from 'd3-color';
import * as ease from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { arc, area } from 'd3-shape';
import { timer } from 'd3-timer';
import 'd3-transition';
import Gradient from './Gradient';

/**
 * PropType for fill and stroke..
 */
const fillStroke = PropTypes.shape({
    fill: PropTypes.string,
    stroke: PropTypes.string
});

class LiquidFillGauge extends Component {
    static propTypes = {
        // The width of the component.
        width: PropTypes.number,
        // The height of the component.
        height: PropTypes.number,

        // The percentage value (0-100).
        value: PropTypes.number,
        // The percentage symbol (%).
        percentageSymbol: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool
        ]),

        // The relative height of the text to display in the wave circle. 1 = 50%
        textSize: PropTypes.number,
        textOffsetX: PropTypes.number,
        textOffsetY: PropTypes.number,

        // Whether to animate the chart
        animation: PropTypes.bool,
        // The amount of time in milliseconds to animate the chart.
        animationDuration: PropTypes.number,
        // The d3 easing function name.
        animationEasing: PropTypes.string,
        // Will fire on animation progression.
        onAnimationProgress: PropTypes.func,
        // Will fire on animation completion.
        onAnimationComplete: PropTypes.func,

        // Controls if the wave scrolls or is static.
        waveAnimation: PropTypes.bool,
        // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveAnimationDuration: PropTypes.number,
        // The d3 easing function name.
        waveAnimationEasing: PropTypes.string,
        // The wave height as a percentage of the radius of the wave circle.
        waveHeight: PropTypes.number,
        // The number of full waves per width of the wave circle.
        waveCount: PropTypes.number,
        // The amount to initially offset the wave.
        // 0 = no offset
        // 1 = offset of one full wave
        waveOffset: PropTypes.number,

        // Whether to apply linear gradients to fill the liquid element
        gradient: PropTypes.bool,
        // An array of the <stop> SVG element defines the ramp of colors to use on a gradient, which is a child element to either the <linearGradient> or the <radialGradient> element
        gradientStops: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.object),
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),

        // The click handler callback function.
        onClick: PropTypes.func,

        // The radius of the inner circle.
        innerRadius: PropTypes.number,
        // The radius of the outer circle.
        outerRadius: PropTypes.number,
        // The margin between inner liquid and inner radius.
        margin: PropTypes.number,

        // The wave amplitude.
        amplitude: PropTypes.number,
        // The wave frequency inverse, the higer the number the fewer the waves.
        frequency: PropTypes.number,

        // The fill and stroke for the outer arc.
        outerArcStyle: fillStroke,
        // The fill and stroke for the liquid.
        liquidStyle: fillStroke,
        // The fill and stroke for the number part that is drenched in liquid.
        liquidNumberStyle: fillStroke,
        // The fill and stroke of the number that is not drenched in liquid.
        numberStyle: fillStroke
    };

    static defaultProps = {
        width: 400,
        height: 400,
        value: 0,
        percentageSymbol: '%',
        textSize: 1,
        textOffsetX: 0,
        textOffsetY: 0,
        animation: false,
        animationDuration: 2000,
        animationEasing: 'easeCubicInOut',
        onAnimationProgress: () => {},
        onAnimationComplete: () => {},
        waveAnimation: true,
        waveAnimationDuration: 2000,
        waveAnimationEasing: 'easeLinear',
        gradient: false,
        gradientStops: null,
        onClick: () => {},
        innerRadius: 0.9,
        outerRadius: 1.0,
        margin: 0.025,
        amplitude: 1,
        frequency: 4,
        outerArcStyle: {
            fill: 'rgb(23, 139, 202)'
        },
        liquidStyle: {
            fill: 'rgb(23, 139, 202)'
        },
        liquidNumberStyle: {
            fill: 'rgb(164, 219, 248)'
        },
        numberStyle: {
            fill: 'rgb(4, 86, 129)'
        }
    };

    componentDidMount() {
        if (this.props.animation) {
            this.animate();
            return;
        }
        this.draw();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.animation) {
            this.animate();
            return;
        }
        this.draw();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    setRes() {
        const width = (this.props.width * (this.props.innerRadius - this.props.margin)) / 2;
        const height = (this.props.height * (this.props.innerRadius - this.props.margin)) / 2;

        this.arr = new Array(100);
        this.wave = select(this.clipPath)
            .datum([this.props.value]);
        this.text = select(this.container)
            .selectAll('text')
            .selectAll('tspan.value');
        this.x = scaleLinear()
            .range([-width * 2, width * 2])
            .domain([0, 100]);
        this.y = scaleLinear()
            .range([height, -height])
            .domain([0, 100]);
    }
    draw() {
        this.setRes();

        const { amplitude, frequency, value, height } = this.props;
        const clipArea = area()
            .x((d, i) => this.x(i))
            .y0((d, i) => this.y((amplitude * Math.sin(i / frequency)) + value))
            .y1(d => (height / 2));
        this.wave.attr('d', clipArea(this.arr));
        this.text.text(Math.round(value));
    }
    animate() {
        this.setRes();

        const clipArea = area()
            .x((d, i) => this.x(i))
            .y1(d => (this.props.height / 2));

        const waveScale = scaleLinear()
            .range([0, this.props.amplitude, 0])
            .domain([0, 50, 100]);

        if (this.props.waveAnimation) {
            this.animateWave();
        }

        const time = scaleLinear()
            .range([0, 1])
            .domain([0, this.props.animationDuration]);
        // If the wave does not have an old value, then interpolate from 0 to value, else old to value.
        const interpolateValue = interpolate(this.wave.node().old || 0, this.props.value);
        const animationEasing = ease[this.props.animationEasing] ? ease[this.props.animationEasing] : ease[this.defaultProps.animationEasing];
        const animationTimer = timer((t) => {
            const { frequency } = this.props;
            const value = interpolateValue(animationEasing(time(t)));

            clipArea.y0((d, i) => this.y((waveScale(value) * Math.sin(i / frequency)) + value));

            this.text.text(Math.round(value));
            this.wave.attr('d', clipArea(this.arr));
            this.props.onAnimationProgress({
                value,
                container: select(this.container)
            });

            if (t >= this.props.animationDuration) {
                animationTimer.stop();

                const value = interpolateValue(1);

                clipArea.y0((d, i) => this.y((waveScale(value) * Math.sin(i / frequency)) + value));

                this.text.text(Math.round(value));
                this.wave.attr('d', clipArea(this.arr));

                this.props.onAnimationComplete({
                    value,
                    container: select(this.container)
                });
            }
        });

        // Store the old node value so that we can animate from that point again
        this.wave.node().old = this.props.value;
    }
    animateWave() {
        const width = (this.props.width * (this.props.innerRadius - this.props.margin)) / 2;
        const waveAnimationScale = scaleLinear()
            .range([-width / 2, width / 2])
            .domain([0, 1]);
        const waveAnimationEasing = ease[this.props.waveAnimationEasing] ? ease[this.props.waveAnimationEasing] : ease[this.defaultProps.waveAnimationEasing];

        this.wave
            .attr('transform', 'translate(' + waveAnimationScale(this.wave.attr('T')) + ', 0)')
            .transition()
            .duration(this.props.waveAnimationDuration * (1 - this.wave.attr('T')))
            .ease(waveAnimationEasing)
            .attr('transform', 'translate(' + waveAnimationScale(1) + ', 0)')
            .attr('T', 1)
            .on('end', () => {
                this.wave.attr('T', 0);
                if (this.props.waveAnimation) {
                    this.animateWave();
                }
            });
    }
    render() {
        const { style } = this.props;
        const radius = Math.min(this.props.height / 2, this.props.width / 2);
        const liquidRadius = radius * (this.props.innerRadius - this.props.margin);
        const outerArc = arc()
            .outerRadius(this.props.outerRadius * radius)
            .innerRadius(this.props.innerRadius * radius)
            .startAngle(0)
            .endAngle(Math.PI * 2);
        const cX = (this.props.width / 2);
        const cY = (this.props.height / 2);
        const textPixels = (this.props.textSize * radius / 2);
        const fillColor = this.props.liquidStyle.fill;
        const gradientStops = this.props.gradientStops || [
            {
                key: '0%',
                stopColor: color(fillColor).darker(0.5).toString(),
                stopOpacity: 1,
                offset: '0%'
            },
            {
                key: '50%',
                stopColor: fillColor,
                stopOpacity: 0.75,
                offset: '50%'
            },
            {
                key: '100%',
                stopColor: color(fillColor).brighter(0.5).toString(),
                stopOpacity: 0.5,
                offset: '100%'
            }
        ];

        return (
            <div
                style={{
                    width: this.props.width,
                    height: this.props.height,
                    ...style
                }}
            >
                <svg width="100%" height="100%">
                    <g
                        ref={(c) => {
                            this.container = c;
                        }}
                        transform={`translate(${cX},${cY})`}
                    >
                        <defs>
                            <clipPath id="clip">
                                <path
                                    ref={(c) => {
                                        this.clipPath = c;
                                    }}
                                />
                            </clipPath>
                        </defs>
                        <text
                            className="number"
                            style={{
                                textAnchor: 'middle',
                                fontSize: textPixels + 'px'
                            }}
                            fill={this.props.numberStyle.fill}
                            stroke={this.props.numberStyle.stroke}
                            transform={`translate(${this.props.textOffsetX},${this.props.textOffsetY})`}
                        >
                            <tspan className="value">{this.props.value}</tspan>
                            <tspan>{this.props.percentageSymbol}</tspan>
                        </text>
                        <g clipPath="url(#clip)">
                            <circle
                                className="liquid"
                                r={liquidRadius}
                                fill={this.props.gradient ? 'url(#gradient)' : this.props.liquidStyle.fill}
                            />
                            <text
                                className="liquidNumber"
                                style={{
                                    textAnchor: 'middle',
                                    fontSize: textPixels + 'px'
                                }}
                                fill={this.props.liquidNumberStyle.fill}
                                stroke={this.props.liquidNumberStyle.stroke}
                                transform={`translate(${this.props.textOffsetX},${this.props.textOffsetY})`}
                            >
                                <tspan className="value">{this.props.value}</tspan>
                                <tspan>{this.props.percentageSymbol}</tspan>
                            </text>
                        </g>
                        <path
                            className="outerArc"
                            d={outerArc()}
                            fill={this.props.outerArcStyle.fill}
                            stroke={this.props.outerArcStyle.stroke}
                        />
                        <circle
                            r={radius}
                            fill="rgba(0, 0, 0, 0)"
                            stroke="rgba(0, 0, 0, 0)"
                            style={{ pointerEvents: 'all' }}
                            onClick={() => {
                                this.props.onClick();
                            }}
                        />
                    </g>
                    <Gradient id="gradient">
                        {gradientStops.map((stop, index) => {
                            if (!React.isValidElement(stop)) {
                                const key = stop.key || index;
                                return (
                                    <stop key={key} {...stop} />
                                );
                            }
                            return stop;
                        })}
                    </Gradient>
                </svg>
            </div>
        );
    }
}

module.exports = LiquidFillGauge;
