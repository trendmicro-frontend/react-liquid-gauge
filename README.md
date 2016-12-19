# react-liquid-gauge [![build status](https://travis-ci.org/trendmicro-frontend/react-liquid-gauge.svg?branch=master)](https://travis-ci.org/trendmicro-frontend/react-liquid-gauge) [![Coverage Status](https://coveralls.io/repos/github/trendmicro-frontend/react-liquid-gauge/badge.svg?branch=master)](https://coveralls.io/github/trendmicro-frontend/react-liquid-gauge?branch=master)

[![NPM](https://nodei.co/npm/react-liquid-gauge.png?downloads=true&stars=true)](https://www.npmjs.com/package/react-liquid-gauge)

React Liquid Gauge component. It's heavily inspired by [D3 Liquid Fill Gauge](http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6) and [react-liquidchart](https://github.com/arnthor3/react-liquidchart).

[![demo](https://cloud.githubusercontent.com/assets/447801/20963411/2d180a36-bca8-11e6-8505-315137564a80.png)](http://trendmicro-frontend.github.io/react-liquid-gauge)

Demo: http://trendmicro-frontend.github.io/react-liquid-gauge

The [sample code](https://github.com/trendmicro-frontend/react-liquid-gauge/blob/master/examples/index.jsx) can be found in the [examples](https://github.com/trendmicro-frontend/react-liquid-gauge/tree/master/examples) directory.

## Installation

```
npm install --save react react-dom react-liquid-gauge
```

### Usage

```js
import { color } from 'd3-color';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LiquidFillGauge from 'react-liquid-gauge';

const pickColor = (value, startColor, endColor) => {
    const diffRed = color(endColor).r - color(startColor).r;
    const diffGreen = color(endColor).g - color(startColor).g;
    const diffBlue = color(endColor).b - color(startColor).b;
    const percentFade = value / 100;

    return 'rgb(' + [
        (Math.floor(diffRed * percentFade) + color(startColor).r) % 256,
        (Math.floor(diffGreen * percentFade) + color(startColor).g) % 256,
        (Math.floor(diffBlue * percentFade) + color(startColor).b) % 256
    ].join(' ,') + ')';
};

class App extends Component {
    state = {
        value: Math.round(Math.random() * 100)
    };
    startColor = '#6495ed'; // cornflowerblue
    endColor = '#dc143c'; // crimson

    render() {
        const fillColor = pickColor(this.state.value, this.startColor, this.endColor);
        const gradientStops = [
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
            <div>
                <LiquidFillGauge
                    style={{ margin: '0 auto' }}
                    width={400}
                    height={400}
                    value={this.state.value}
                    textOffsetX={0}
                    textOffsetY={0}
                    animation
                    waveAnimation
                    gradient
                    gradientStops={gradientStops}
                    amplitude={1}
                    frequency={4}
                    outerArcStyle={{
                        fill: fillColor
                    }}
                    liquidStyle={{
                        fill: fillColor
                    }}
                    liquidNumberStyle={{
                        fill: 'rgb(255, 255, 255)'
                    }}
                    numberStyle={{
                        fill: 'rgb(0, 0, 0)'
                    }}
                    onClick={() => {
                        this.setState({ value: Math.random() * 100 });
                    }}
                />
                <div
                    style={{
                        margin: '20px auto',
                        width: 120
                    }}
                >
                    <button
                        type="button"
                        className="btn btn-default btn-block"
                        onClick={() => {
                            this.setState({ value: Math.random() * 100 });
                        }}
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('container')
);
```

## API

### Properties

<table>
  <thead>
    <tr>
      <th align="left">Name</th>
      <th align="left">Type</th>
      <th align="left">Default</th>
      <th align="left">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>width</td>
      <td>Number</td>
      <td>400</td>
      <td>The width of the component.</td>
    </tr>
    <tr>
      <td>height</td>
      <td>Number</td>
      <td>400</td>
      <td>The height of the component.</td>
    </tr>
    <tr>
      <td>value</td>
      <td>Number</td>
      <td>0</td>
      <td>The percentage value (0-100).</td>
    </tr>
    <tr>
      <td>percentageSymbol</td>
      <td>String</td>
      <td>'%'</td>
      <td>The percentage symbol (%).</td>
    </tr>
    <tr>
      <td>textSize</td>
      <td>Number</td>
      <td>1</td>
      <td>The relative height of the text to display in the wave circle. 1 = 50%.</td>
    </tr>
    <tr>
      <td>textOffsetX</td>
      <td>Number</td>
      <td>0</td>
      <td></td>
    </tr>
    <tr>
      <td>textOffsetY</td>
      <td>Number</td>
      <td>0</td>
      <td></td>
    </tr>
    <tr>
      <td>riseAnimation</td>
      <td>Boolean</td>
      <td>false</td>
      <td>Controls if the wave should rise from 0 to it's full height, or start at it's full height.</td>
    </tr>
    <tr>
      <td>riseAnimationTime</td>
      <td>Number</td>
      <td>2000</td>
      <td>The amount of time in milliseconds for the wave to rise from 0 to it's final height.</td>
    </tr>
    <tr>
      <td>riseAnimationEasing</td>
      <td>String</td>
      <td>'easeCubicInOut'</td>
      <td><a href="https://github.com/d3/d3-ease">d3-ease</a> options. See the <a href="http://bl.ocks.org/mbostock/248bac3b8e354a9103c4">easing explorer</a> for a visual demostration.</td>
    </tr>
    <tr>
      <td>riseAnimationOnProgress</td>
      <td>Function</td>
      <td></td>
      <td>Progress callback function.</td>
    </tr>
    <tr>
      <td>riseAnimationOnComplete</td>
      <td>Function</td>
      <td></td>
      <td>Complete callback function.</td>
    </tr>
    <tr>
      <td>waveAnimation</td>
      <td>Boolean</td>
      <td>false</td>
      <td>Controls if the wave scrolls or is static.</td>
    </tr>
    <tr>
      <td>waveAnimationTime</td>
      <td>Number</td>
      <td>2000</td>
      <td>The amount of time in milliseconds for a full wave to enter the wave circle.</td>
    </tr>
    <tr>
      <td>waveAnimationEasing</td>
      <td>String</td>
      <td>'easeLinear'</td>
      <td><a href="https://github.com/d3/d3-ease">d3-ease</a> options. See the <a href="http://bl.ocks.org/mbostock/248bac3b8e354a9103c4">easing explorer</a> for a visual demostration.</td>
    </tr>
    <tr>
      <td>waveAmplitude</td>
      <td>Number</td>
      <td>1</td>
      <td>The wave height as a percentage of the radius of the wave circle.</td>
    </tr>
    <tr>
      <td>waveFrequency</td>
      <td>Number</td>
      <td>2</td>
      <td>The number of full waves per width of the wave circle.</td>
    </tr>
    <tr>
      <td>gradient</td>
      <td>Boolean</td>
      <td>false</td>
      <td>Whether to apply linear gradients to fill the wave circle.</td>
    </tr>
    <tr>
      <td>gradientStops</td>
      <td>Node|Array</td>
      <td></td>
      <td>An array of the &lt;stop&gt; SVG element defines the ramp of colors to use on a gradient, which is a child element to either the &lt;linearGradient&gt; or the &lt;radialGradient&gt; element.</td>
    </tr>
    <tr>
      <td>onClick</td>
      <td>Function</td>
      <td></td>
      <td>onClick event handler.</td>
    </tr>
    <tr>
      <td>innerRadius</td>
      <td>Number</td>
      <td>0.9</td>
      <td>The radius of the inner circle.</td>
    </tr>
    <tr>
      <td>outerRadius</td>
      <td>Number</td>
      <td>1.0</td>
      <td>The radius of the outer circle.</td>
    </tr>
    <tr>
      <td>margin</td>
      <td>Number</td>
      <td>0.025</td>
      <td>The size of the gap between the outer circle and wave circle as a percentage of the outer circle's radius.</td>
    </tr>
    <tr>
      <td>circleStyle</td>
      <td>Object</td>
      <td>{ fill: 'rgb(23, 139, 202)', stroke: '' }</td>
      <td>The fill and stroke of the outer circle.</td>
    </tr>
    <tr>
      <td>waveStyle</td>
      <td>Object</td>
      <td>{ fill: 'rgb(23, 139, 202)', stroke: '' }</td>
      <td>The fill and stroke of the fill wave.</td>
    </tr>
    <tr>
      <td>textStyle</td>
      <td>Object</td>
      <td>{ fill: 'rgb(0, 0, 0)', stroke: '' }</td>
      <td>The fill and stroke of the value text when the wave does not overlap it.</td>
    </tr>
    <tr>
      <td>waveTextStyle</td>
      <td>Object</td>
      <td>{ fill: 'rgb(255, 255, 255)', stroke: '' }</td>
      <td>The fill and stroke of the value text when the wave overlaps it.</td>
    </tr>
  </tbody>
</table>
