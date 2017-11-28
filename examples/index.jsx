import { color } from 'd3-color';
import { interpolateRgb } from 'd3-interpolate';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LiquidFillGauge from '../src';

const Gauge = ({ radius = 200, value = 0, ...props }) => {
    const startColor = '#6495ed'; // cornflowerblue
    const endColor = '#dc143c'; // crimson
    const interpolate = interpolateRgb(startColor, endColor);
    const fillColor = interpolate(value / 100);
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
        <LiquidFillGauge
            {...props}
            width={radius * 2}
            height={radius * 2}
            value={value}
            percent="%"
            textSize={1}
            textOffsetX={0}
            textOffsetY={0}
            textRenderer={({ value, width, height, textSize, percent }) => {
                value = Math.round(value);
                const radius = Math.min(height / 2, width / 2);
                const textPixels = (textSize * radius / 2);
                const valueStyle = {
                    fontSize: textPixels
                };
                const percentStyle = {
                    fontSize: textPixels * 0.6
                };

                return (
                    <tspan>
                        <tspan className="value" style={valueStyle}>{value}</tspan>
                        <tspan style={percentStyle}>{percent}</tspan>
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
        />
    );
};

class App extends Component {
    state = {
        value1: Math.random() * 100,
        value2: Math.random() * 100
    };

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6 col-sm-12">
                        <Gauge
                            style={{ margin: '0 auto 20px auto' }}
                            radius={200}
                            value={this.state.value1}
                            onClick={() => {
                                this.setState({ value1: Math.random() * 100 });
                            }}
                        />
                    </div>
                    <div className="col-md-6 col-sm-12">
                        <Gauge
                            style={{ margin: '0 auto 20px auto' }}
                            radius={200}
                            value={this.state.value2}
                            onClick={() => {
                                this.setState({ value2: Math.random() * 100 });
                            }}
                        />
                    </div>
                </div>
                <div className="row">
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
                                this.setState({
                                    value1: Math.random() * 100,
                                    value2: Math.random() * 100
                                });
                            }}
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('container')
);
