import './LeafletMap.css';
import React, { Component } from 'react';
import { Map, TileLayer, Polyline, Circle } from 'react-leaflet';

export default class LeafletMap extends Component {
    render() {
        let points = this.props.positions.map((position, index) => {
            return <Circle key={`mapPoint${index}`} center={position} radius={20} color={'blue'} />;
        });
        return (
            <Map className={this.props.className} center={this.props.center} zoom={this.props.zoom}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' />
                <Polyline positions={this.props.positions} />
                {points}
                <Circle center={this.props.circleCenter} radius={200} color={'red'} />
            </Map>
        )
    }
}