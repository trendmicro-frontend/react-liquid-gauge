# react-liquid-gauge [![build status](https://travis-ci.org/trendmicro-frontend/react-liquid-gauge.svg?branch=master)](https://travis-ci.org/trendmicro-frontend/react-liquid-gauge) [![Coverage Status](https://coveralls.io/repos/github/trendmicro-frontend/react-liquid-gauge/badge.svg?branch=master)](https://coveralls.io/github/trendmicro-frontend/react-liquid-gauge?branch=master)

[![NPM](https://nodei.co/npm/react-liquid-gauge.png?downloads=true&stars=true)](https://www.npmjs.com/package/react-liquid-gauge)

React Liquid Gauge component. It's heavily inspired by [D3 Liquid Fill Gauge](http://bl.ocks.org/brattonc/5e5ce9beee483220e2f6) and [react-liquidchart](https://github.com/arnthor3/react-liquidchart).

![image](https://cloud.githubusercontent.com/assets/447801/20963411/2d180a36-bca8-11e6-8505-315137564a80.png)

Demo: http://trendmicro-frontend.github.io/react-liquid-gauge

The [sample code](https://github.com/trendmicro-frontend/react-liquid-gauge/blob/master/examples/index.jsx) can be found in the [examples](https://github.com/trendmicro-frontend/react-liquid-gauge/tree/master/examples) directory.

## Installation

```
npm install --save react react-dom react-liquid-gauge
```

### Usage

```js
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LiquidFillGauge from 'react-liquid-gauge';

const rgbcolor = (value) => {
    const startColor = {
        red: 0x64,
        green: 0x95,
        blue: 0xed
    };
    const endColor = {
        red: 0xdc,
        green: 0x14,
        blue: 0x3c
    };

    const diffRed = endColor.red - startColor.red;
    const diffGreen = endColor.green - startColor.green;
    const diffBlue = endColor.blue - startColor.blue;
    const percentFade = value / 100;

    return [
        Math.floor(diffRed * percentFade) + startColor.red,
        Math.floor(diffGreen * percentFade) + startColor.green,
        Math.floor(diffBlue * percentFade) + startColor.blue
    ];
};

class App extends Component {
    state = {
        value: Math.round(Math.random() * 100)
    };

    render() {
        const fillColor = `rgb(${rgbcolor(this.state.value).join(',')})`;

        return (
            <div>
                <LiquidFillGauge
                    animate
                    onAnimationProgress={(options) => {
                        const { value, outerArc, liquid } = options;
                        const fillColor = `rgb(${rgbcolor(value).join(',')})`;
                        outerArc.attr('fill', fillColor);
                        liquid.attr('fill', fillColor);
                    }}
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
                    width={240}
                    height={240}
                    style={{ margin: '0 auto' }}
                    value={this.state.value}
                    textOffsetX={0}
                    textOffsetY={0}
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
