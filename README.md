# react-liquid-gauge [![build status](https://travis-ci.org/trendmicro-frontend/react-liquid-gauge.svg?branch=master)](https://travis-ci.org/trendmicro-frontend/react-liquid-gauge) [![Coverage Status](https://coveralls.io/repos/github/trendmicro-frontend/react-liquid-gauge/badge.svg?branch=master)](https://coveralls.io/github/trendmicro-frontend/react-liquid-gauge?branch=master)

[![NPM](https://nodei.co/npm/react-liquid-gauge.png?downloads=true&stars=true)](https://www.npmjs.com/package/react-liquid-gauge)

React Liquid Gauge component. It's heavily inspired by [D3 Liquid Fill Gauge](http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6) and [react-liquidchart](https://github.com/arnthor3/react-liquidchart).

[![react-liquid-gauge](https://cloud.githubusercontent.com/assets/447801/21498498/f1ab231e-cc67-11e6-830c-8e5db6b81af0.png)](http://trendmicro-frontend.github.io/react-liquid-gauge)

Demo: http://trendmicro-frontend.github.io/react-liquid-gauge

The [sample code](https://github.com/trendmicro-frontend/react-liquid-gauge/blob/master/examples/index.jsx) can be found in the [examples](https://github.com/trendmicro-frontend/react-liquid-gauge/tree/master/examples) directory.

## Installation

```
npm install --save react react-dom react-liquid-gauge
```

### Usage

```js
import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LiquidFillGauge from 'react-liquid-gauge';

class App extends Component {
    state = {
        value: 50
    };
    startColor = '#6495ed'; // cornflowerblue
    endColor = '#dc143c'; // crimson

    render() {
        const radius = 200;
        const interpolate = interpolateRgb(this.startColor, this.endColor);
        const fillColor = interpolate(this.state.value / 100);
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
                    width={radius * 2}
                    height={radius * 2}
                    value={this.state.value}
                    percent="%"
                    textSize={1}
                    textOffsetX={0}
                    textOffsetY={0}
                    textRenderer={(props) => {
                        const value = Math.round(props.value);
                        const radius = Math.min(props.height / 2, props.width / 2);
                        const textPixels = (props.textSize * radius / 2);
                        const valueStyle = {
                            fontSize: textPixels
                        };
                        const percentStyle = {
                            fontSize: textPixels * 0.6
                        };

                        return (
                            <tspan>
                                <tspan className="value" style={valueStyle}>{value}</tspan>
                                <tspan style={percentStyle}>{props.percent}</tspan>
                            </tspan>
                        );
                    }}
                    riseAnimation
                    waveAnimation
                    waveFrequency={2}
                    waveAmplitude={1}
                    gradient
                    gradientStops={gradientStops}
                    circleStyle={{
                        fill: fillColor
                    }}
                    waveStyle={{
                        fill: fillColor
                    }}
                    textStyle={{
                        fill: color('#444').toString(),
                        fontFamily: 'Arial'
                    }}
                    waveTextStyle={{
                        fill: color('#fff').toString(),
                        fontFamily: 'Arial'
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
      <td>id</td>
      <td>String</td>
      <td></td>
      <td>A unique identifier (ID) to identify the element. Defaults to a unique random string.</td>
    </tr>
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
      <td>The percent value (0-100).</td>
    </tr>
    <tr>
      <td>percent</td>
      <td>String|Node</td>
      <td>'%'</td>
      <td>The percent string (%) or SVG text element.</td>
    </tr>
    <tr>
      <td>textSize</td>
      <td>Number</td>
      <td>1</td>
      <td>The relative height of the text to display in the wave circle. A value of 1 equals 50% of the radius of the outer circle.</td>
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
      <td>textRenderer</td>
      <td>Function(props)</td>
      <td></td>
      <td>Specifies a custom text renderer for rendering a percent value.</td>
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
      <td>'cubicInOut'</td>
      <td><a href="https://github.com/d3/d3-ease">d3-ease</a> options. See the <a href="http://bl.ocks.org/mbostock/248bac3b8e354a9103c4">easing explorer</a> for a visual demostration.</td>
    </tr>
    <tr>
      <td>riseAnimationOnProgress</td>
      <td>Function({ value, container })</td>
      <td></td>
      <td>Progress callback function.</td>
    </tr>
    <tr>
      <td>riseAnimationOnComplete</td>
      <td>Function({ value, container })</td>
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
      <td>'linear'</td>
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
      <td>Function(event)</td>
      <td></td>
      <td>onClick event handler.</td>
    </tr>
    <tr>
      <td>innerRadius</td>
      <td>Number</td>
      <td>0.9</td>
      <td>The radius of the inner circle. A value of 0.9 equals 90% of the radius of the outer circle.</td>
    </tr>
    <tr>
      <td>outerRadius</td>
      <td>Number</td>
      <td>1.0</td>
      <td>The radius of the outer circle. A value of 1 equals 100% of the radius of the outer circle.</td>
    </tr>
    <tr>
      <td>margin</td>
      <td>Number</td>
      <td>0.025</td>
      <td>The size of the gap between the outer circle and wave circle as a percentage of the radius of the outer circle. A value of 0.025 equals 2.5% of the radius of the outer circle.</td>
    </tr>
    <tr>
      <td>circleStyle</td>
      <td>Object</td>
      <td>
<pre>{
  fill: 'rgb(23, 139, 202)'
}</pre>
      </td>
      <td>The style of the outer circle.</td>
    </tr>
    <tr>
      <td>waveStyle</td>
      <td>Object</td>
      <td>
<pre>{
  fill: 'rgb(23, 139, 202)'
}</pre>
      </td>
      <td>The style of the fill wave.</td>
    </tr>
    <tr>
      <td>textStyle</td>
      <td>Object</td>
      <td>
<pre>{
  fill: 'rgb(0, 0, 0)'
}</pre>
      </td>
      <td>The style of the text when the wave does not overlap it.</td>
    </tr>
    <tr>
      <td>waveTextStyle</td>
      <td>Object</td>
      <td>
<pre>{
  fill: 'rgb(255, 255, 255)'
}</pre>
      </td>
      <td>The style of the text when the wave overlaps it.</td>
    </tr>
  </tbody>
</table>

## License

MIT
