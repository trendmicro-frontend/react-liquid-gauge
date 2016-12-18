import { color } from 'd3-color';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LiquidFillGauge from '../src';

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
                    waveAnimationEasing="easeLinear"
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
