import { Chart, Geom, Axis, View} from 'bizcharts'
import React, { Component } from 'react';
import {action} from 'mobx';
import {observer} from 'mobx-react';
import store from '../UIStore'

const getG2Instance = (chart) => {
    window.g2Chart = chart
}

const handlePlotClick = action((ev) => {
    store.showChecked = false
    store.addingDisabled = false
    console.log(ev.x)
    if (!store.selectedTime) {
        store.playerRef.seek(Math.round((ev.x-10) * store.unitLength))
    }
})

@observer
export default class MainChart extends Component {

    userProblem;
    raw;
    scale = {
        index: {
            min: 0,
            max: store.rawData.length,
            nice: false,
            formatter: (value) => (new Date(value * 1000).toISOString().substr(14, 5)),
            tickCount: 12
        },
        problem: {
            min: 0,
            max: 1,
            tickCount: 2
        },
        h: {
            min: 0,
            max: 1,
            tickCount: 2
        },
        u: {
            min: 0,
            max: 1,
            tickCount: 2
        },
    }

    render() {
        const {x, y} = this.props
        return (
            <div style={{width: "100%", display:"flex", justifyContent:"center"}}>
            <Chart
             scale={this.scale} 
             width={store.GRAPH_WIDTH} 
             height={150}
             padding={{left: 10, bottom: 40, top: 5}} 
             data={store.rawData} 
             onPlotClick={handlePlotClick} 
             animate={false} 
             onGetG2Instance={getG2Instance}>
                <Axis name={x} label={{textStyle: {fontSize: 9}}}></Axis>
                <Axis name={y} visible={false}></Axis>
                <Geom color="grey" type="line" position={x + '*' + y} size={1}></Geom>
                <View scale={this.scale} animate={false} data={[{index: store.playerState.currentTime, problem:1}]}>
                    <Geom color="red" size={1} type="interval" position="index*problem"></Geom>
                </View>
                <View scale={this.scale} animate={false} data={[{index: store.selectedStartTime, problem:0.1}]}>
                    <Geom color="red" size={1} type="interval" position="index*problem"></Geom>
                </View>
                <View scale={this.scale} animate={false} data={[{index: store.selectedEndTime, problem:0.1}]}>
                    <Geom color="red" size={1} type="interval" position="index*problem"></Geom>
                </View>
                <View scale={this.scale} data={store.advanceData} animate={false}>
                    <Geom color={[y, ['#d7191c', '#2c7bb6']]} type="interval" position={x + '*h'} opacity={0.2} size={1}></Geom>
                </View>
            </Chart>
        </div>
        )
    }

}
