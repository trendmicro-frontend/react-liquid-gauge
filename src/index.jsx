import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { color } from 'd3-color';
import { timer } from 'd3-timer';
import { arc, area } from 'd3-shape';
import * as ease from 'd3-ease';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { interpolate } from 'd3-interpolate';
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
        // a percentage from 0 to 100
        value: PropTypes.number,
        // boolean if true then animate
        animate: PropTypes.bool,
        // callback function called when animation is in progress
        onAnimationProgress: PropTypes.func,
        // callback function called when animation is done
        onAnimationEnd: PropTypes.func,
        // on click
        onClick: PropTypes.func,
        // comes from Chart parent
        width: PropTypes.number,
        // comes from Chart parent
        height: PropTypes.number,
        // gradient effect
        gradient: PropTypes.bool,
        gradientStops: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.object),
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node
        ]),
        // inner radius
        innerRadius: PropTypes.number,
        // outer radius
        outerRadius: PropTypes.number,
        // margin between inner liquid and innerRadius
        margin: PropTypes.number,
        // d3 easing functions
        ease: PropTypes.func,
        // animation Time
        animationTime: PropTypes.number,
        // the wave amplitude
        amplitude: PropTypes.number,
        // the wave frequency inverse, the higer the number the fewer the waves
        frequency: PropTypes.number,
        // The fill and stroke for the outer arc
        outerArcStyle: fillStroke,
        // The fill and stroke for the liquid
        liquidStyle: fillStroke,
        // The fill and stroke for the number part that is drenched in liquid
        liquidNumberStyle: fillStroke,
        // the fill and stroke of the number that is not drenched in liquid
        numberStyle: fillStroke,
        // The relative height of the text to display in the wave circle. 1 = 50%
        textSize: PropTypes.number,
        textOffsetX: PropTypes.number,
        textOffsetY: PropTypes.number,
        percentageSymbol: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool
        ])
    };

    static defaultProps = {
        value: 100,
        animate: false,
        onAnimationProgress: () => {},
        onAnimationEnd: () => {},
        onClick: () => {},
        outerRadius: 1.0,
        innerRadius: 0.9,
        margin: 0.025,
        ease: ease.easeCubicInOut,
        animationTime: 2000,
        amplitude: 1,
        frequency: 8,
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
        },
        textSize: 1,
        textOffsetX: 0,
        textOffsetY: 0,
        percentageSymbol: '%'
    };

    componentDidMount() {
        if (this.props.animate) {
            this.animate();
            return;
        }
        this.draw();
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.animate) {
            this.animate();
            return;
        }
        this.draw();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }
    setRes() {
        const width = (this.props.width * this.props.innerRadius) / 2;
        const height = (this.props.height * (this.props.innerRadius - this.props.margin)) / 2;

        this.arr = new Array(100);
        this.wave = select(this.clipPath)
            .datum([this.props.value]);
        this.text = select(this.container)
            .selectAll('text')
            .selectAll('tspan.value');
        this.x = scaleLinear()
            .range([-width, width])
            .domain([0, 100]);
        this.y = scaleLinear()
            .range([height, -height])
            .domain([0, 100]);
    }
    draw() {
        this.setRes();

        const val = area()
            .x((d, i) => {
                return this.x(i);
            })
            .y0((d, i) => {
                return this.y((this.props.amplitude * Math.sin(i / this.props.frequency)) + this.props.value);
            })
            .y1(d => {
                return this.props.height / 2;
            });

        this.wave.attr('d', val(this.arr));
        this.text.text(Math.round(this.props.value));
    }
    animate() {
        this.setRes();

        const val = area()
            .x((d, i) => this.x(i))
            .y0((d, i) => this.y(Math.sin(i / 4)))
            .y1(d => this.props.height / 2);
        const time = scaleLinear().range([0, 1]).domain([0, this.props.animationTime]);
        const interpolateValue = interpolate(this.wave.node().old || 0, this.props.value);
        const { onAnimationProgress, onAnimationEnd } = this.props;
        const animationTimer = timer((t) => {
            const animate = this.props.ease(time(t));

            val.y0((d, i) => {
                return this.y((this.props.amplitude * Math.sin(i / this.props.frequency)) + interpolateValue(animate));
            });

            const value = Math.round(interpolateValue(animate));
            this.text.text(value);
            onAnimationProgress({
                value,
                outerArc: select(this.container).select('.outerArc'),
                liquid: select(this.container).select('.liquid'),
                liquidNumber: select(this.container).select('.liquidNumber'),
                number: select(this.container).select('.number'),
                gradient: select(this.gradient).select('#gradient')
            });

            this.wave.attr('d', val(this.arr));

            if (t > this.props.animationTime) {
                animationTimer.stop();
                const value = Math.round(this.props.value);
                this.text.text(value);
                onAnimationEnd({
                    value,
                    outerArc: select(this.container).select('.outerArc'),
                    liquid: select(this.container).select('.liquid'),
                    liquidNumber: select(this.container).select('.liquidNumber'),
                    number: select(this.container).select('.number'),
                    gradient: select(this.gradient).select('#gradient')
                });
            }
        });

        this.wave.node().old = this.props.value;
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
                stopColor: color(fillColor).darker(0.5).toString(),
                stopOpacity: 1,
                offset: '0%'
            },
            {
                stopColor: fillColor,
                stopOpacity: 0.75,
                offset: '50%'
            },
            {
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
                                return (
                                    <stop key={index} {...stop} />
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
