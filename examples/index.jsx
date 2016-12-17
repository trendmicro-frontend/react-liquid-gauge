import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LiquidFillGauge from '../src';

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
                    gradient
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
                    width={400}
                    height={400}
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
