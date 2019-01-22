import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine } from 'recharts';

export default class SupplementaryLineChart extends Component {
    render() {
        return (
            <LineChart
                width={600}
                height={250}
                data={this.props.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                <XAxis
                    type='number'
                    label={{ value: 'Time (milliseconds since 1970)', position: 'insideBottomRight', offset: -10 }}
                    dataKey='timestamp' 
                    domain={['dataMin', 'dataMax']} />
                <YAxis
                    label={{ value: this.props.title, angle: -90, position: 'insideLeft' }} />
                <Line
                    isAnimationActive={false}
                    type='monotone'
                    dot={false}
                    dataKey={this.props.dataKey}
                    stroke='#82ca9d' />
                <ReferenceLine
                    x={this.props.referenceLineTimestamp}
                    stroke='red' />
            </LineChart>
        )
    }
}