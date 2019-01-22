import React, { Component } from 'react';
import moment from 'moment';
import { LineChart, XAxis, YAxis, ReferenceLine } from 'recharts';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import { connect } from 'react-redux';
import SupplementaryLineChart from 'library/SupplementaryLineChart';
import LeafletMap from 'library/LeafletMap';
import { getLocationData } from './Map.redux';
import './Map.css';

const PLAY_STATUS_PAUSED = 'PLAY_STATUS_PAUSED';
const PLAY_STATUS_PLAYING = 'PLAY_STATUS_PLAYING'

// example time: 2019-01-16T13:00
const TEXTFIELD_FORMAT = 'YYYY-MM-DDTHH:mm';

// picking these dates since they have good data...
// if there was data for today it would be better to use the current date
const DEFAULT_START_TIME = '2018-11-06T00:00';
const DEFAULT_END_TIME = '2018-11-07T00:00';

class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            playIndex: 0,
            playSpeed: 1,
            playStatus: PLAY_STATUS_PAUSED,
            startTime: DEFAULT_START_TIME,
            endTime: DEFAULT_END_TIME
        }
        this.getLocationData();
    }

    static propTypes = {
    }

    interval = null;

    createInterval = () => {
        return setInterval(() => {
            if (this.state.playIndex == this.props.locationData.length - 1) {
                clearInterval(this.interval);
                this.setState({
                    playIndex: 0,
                    playSpeed: 1,
                    playStatus: PLAY_STATUS_PAUSED
                });
                return;
            }
            this.setState({ playIndex: this.state.playIndex + 1, playStatus: PLAY_STATUS_PLAYING });
        }, 200 * this.state.playSpeed);
    }

    onPlayClick = () => {
        this.interval = this.createInterval();
    }

    onPauseClick = () => {
        clearInterval(this.interval);
        this.interval = null;
        this.setState({ playStatus: PLAY_STATUS_PAUSED });
    }

    onSlowDown = () => {
        this.setState({ playSpeed: this.state.playSpeed * 2 }, () => {
            clearInterval(this.interval);
            this.interval = this.createInterval();
        });
    }

    onSpeedUp = () => {
        this.setState({ playSpeed: this.state.playSpeed / 2 }, () => {
            clearInterval(this.interval);
            this.interval = this.createInterval();
        });
    }

    onStartTimeChange = (e) => {
        this.setState({ startTime: e.target.value })
    }

    onEndTimeChange = (e) => {
        this.setState({ endTime: e.target.value })
    }

    getLocationData = () => {
        let startString = moment(this.state.startTime, TEXTFIELD_FORMAT).toISOString();
        let endString = moment(this.state.endTime, TEXTFIELD_FORMAT).toISOString();
        this.props.getLocationData(startString, endString);
    }

    onGoClick = () => {
        this.getLocationData();
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.setState({
            playIndex: 0,
            playSpeed: 1,
            playStatus: PLAY_STATUS_PAUSED
        });
    }

    getMap = () => {
        if (!this.props.locationData.length) return <div>No Map Data</div>;
        let playIcon;
        let pauseIcon;
        if (this.state.playStatus === PLAY_STATUS_PLAYING) {
            pauseIcon = <IconButton onClick={this.onPauseClick}><PauseIcon /></IconButton>;
        } else {
            playIcon = <IconButton onClick={this.onPlayClick}><PlayArrowIcon /></IconButton>
        }
        return (
            <div>
                <LeafletMap
                    className='Map-LeafletMap'
                    center={this.props.mapPositions[0]}
                    zoom={15}
                    positions={this.props.mapPositions}
                    circleCenter={this.props.mapPositions[this.state.playIndex]} />
                <LineChart
                    width={760}
                    height={100}
                    data={this.props.locationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 20 }}>
                    <XAxis
                        type='number'
                        label={{ value: 'Time (milliseconds since 1970)', position: 'insideBottomRight', offset: -10 }}
                        dataKey='timestamp' domain={['dataMin', 'dataMax']} />
                    <YAxis width={60} />
                    <ReferenceLine
                        x={this.props.locationData[this.state.playIndex].timestamp}
                        stroke='red' />
                </LineChart>
                <div className='Map-Controls'>
                    <IconButton onClick={this.onSlowDown}><FastRewindIcon /></IconButton>
                    {playIcon}
                    {pauseIcon}
                    <IconButton onClick={this.onSpeedUp}><FastForwardIcon /></IconButton>
                </div>
            </div>
        )
    }

    getSupplementaryGraphs = () => {
        if (!this.props.locationData.length) return <div>No Supplementary Data</div>;
        return (
            <div>
                <SupplementaryLineChart
                    data={this.props.locationData}
                    title='Signal (bars)'
                    dataKey='rssi'
                    referenceLineTimestamp={this.props.locationData[this.state.playIndex].timestamp} />
                <SupplementaryLineChart
                    data={this.props.locationData}
                    title='Speed (miles/hour)'
                    dataKey='speed'
                    referenceLineTimestamp={this.props.locationData[this.state.playIndex].timestamp} />
                <SupplementaryLineChart
                    data={this.props.locationData}
                    title='Acceleration (meters/(second*second))'
                    dataKey='acceleration'
                    referenceLineTimestamp={this.props.locationData[this.state.playIndex].timestamp}
                    domain={[-1, 1]} />
            </div>
        )
    }

    render() {
        let shouldDisableGoButton = true;
        if (this.state.startTime && this.state.endTime) {
            let startMoment = moment(this.state.startTime, TEXTFIELD_FORMAT);
            let endMoment = moment(this.state.endTime, TEXTFIELD_FORMAT);
            if (startMoment.valueOf() < endMoment.valueOf()) {
                shouldDisableGoButton = false;
            }
        }
        let goButton = <Button onClick={this.onGoClick} variant='outlined' disabled={shouldDisableGoButton} >GO</Button>;
        return (
            <div className='Map-Container'>
                <div className='Map-Column'>
                    <Typography variant='h4' gutterBottom>Vehicle Statistics</Typography>
                    {this.getMap()}
                </div>
                <div className='Map-Column'>
                    <TextField
                        style={{ width: '250px', marginRight: '20px' }}
                        label='From'
                        type='datetime-local'
                        onChange={this.onStartTimeChange}
                        value={this.state.startTime}
                        InputLabelProps={{ shrink: true }} />
                    <TextField
                        style={{ width: '250px', marginRight: '20px' }}
                        label='To'
                        type='datetime-local'
                        onChange={this.onEndTimeChange}
                        value={this.state.endTime}
                        InputLabelProps={{ shrink: true }} />
                    {goButton}
                    {this.getSupplementaryGraphs()}
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        locationData: state.map.locationData,
        mapPositions: state.map.mapPositions
    }
}

function mapDispatchToProps() {
    return {
        getLocationData
    }
}

export default connect(mapStateToProps, mapDispatchToProps())(Map);