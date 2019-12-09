/* eslint-disable eqeqeq */
import { Chart, Geom, Axis, View } from 'bizcharts'
import React, { Component } from 'react';
import {observer} from 'mobx-react';
import store from '../UIStore'
import { Tag } from 'antd'
import './FeaturePanel.css'

const categoryColor = {
    "Reading": "#722ed1",
    "Procedure": "#a0d911",
    "Observation": "#f5222d",
    "Explanation": "#1890ff"

}


const repetitionColor = (value) => (
    value == 1 ?  "#fa541c" : "#a0d911"
)

const sentimentColor = (value) => {
    if (value == 0) {
        return "#faad14" 
    } else if (value == 1) {
        return "#a0d911"
    } else {
        return "#fa541c"
    }
}

const LegendPanel = () => (
    <div className="legend-container">
        <div className="sentiment-container">
            <span>
                <Tag color={sentimentColor(-1)}>-1</Tag>
                <Tag color={sentimentColor(0)}>0</Tag>
                <Tag color={sentimentColor(1)}>1</Tag>
            </span>
        </div>
        <div className="category-container">
            <span>
                <Tag color={categoryColor.Reading}>R</Tag>
                <Tag color={categoryColor.Procedure}>P</Tag>
                <Tag color={categoryColor.Observation}>O</Tag>
                <Tag color={categoryColor.Explanation}>E</Tag>
            </span>
        </div>
        <div className="repetition-container">
            <span>
                <Tag color={repetitionColor(0)}>0</Tag>
                <Tag color={repetitionColor(1)}>1</Tag>
            </span>
        </div>
        <div className="repetition-container">
            <span>
                <Tag color={repetitionColor(0)}>0</Tag>
                <Tag color={repetitionColor(1)}>1</Tag>
            </span>
        </div>
        <div className="repetition-container">
            <span>
                <Tag color={repetitionColor(0)}>0</Tag>
                <Tag color={repetitionColor(1)}>1</Tag>
            </span>
        </div>
    </div>
)


@observer
export default class FeaturePanel extends Component {

    g2Chart = null

    userProblem;
    raw;

    render() {
        const scale = {
            index: {
                min: 0,
                max: this.props.size,
                nice: false,
                tickInterval: 1
            },
            problem: {
                type : "cat",
                values: [ "low speechrate", "low pitch", "high pitch","category", "sentiment"]
            },
            h: {
                min: 0,
                max: 1.2,
                ticks: [0, 0.3, 0.6, 0.9, 1.2]
            }
        }
        const category = store.hightlightData.map((record, index) => {
            const startObj = {index: index, problem: "category"}
            const endObj = {index: index + 1, problem: "category"}

            return (
                <View key={Math.random()} data={[startObj, endObj]} animate={false}>
                    <Axis name="problem" visible tickLine={null} label={{textStyle: {fontSize: "14", fill: "grey", fontWeight: "normal"}}}/>
                    <Axis name="index" visible={false}></Axis>
                    <Geom color={categoryColor[record.category]} type="line" size={14} position="index*problem"></Geom>
                </View>
            )
        })


        const repetition = store.hightlightData.map((record, index) => {
            const startObj = {index: index, problem: "low speechrate"}
            const endObj = {index: index + 1, problem: "low speechrate"}
            return (
                <View key={Math.random()} data={[startObj, endObj]} animate={false}>
                    <Geom color={repetitionColor(record.abnormal_speechrate[1])} type="line" size={14} position="index*problem"></Geom>
                </View>
            )
        })

        const sentiment = store.hightlightData.map((record, index) => {
            
            const startObj = {index: index, problem: "sentiment"}
            const endObj = {index: index + 1, problem: "sentiment"}
            return (
                <View key={Math.random()} data={[startObj, endObj]} animate={false}>
                    <Geom color={sentimentColor(record.sentiment_gt)} type="line" size={14} position="index*problem"></Geom>
                </View>
            ) 
        })

        const highpitch = store.hightlightData.map((record, index) => {
            
            const startObj = {index: index, problem: "high pitch"}
            const endObj = {index: index + 1, problem: "high pitch"}
            return (
                <View key={Math.random()} data={[startObj, endObj]} animate={false}>
                    <Geom color={repetitionColor(record.abnormal_pitch[0])} type="line" size={14} position="index*problem"></Geom>
                </View>
            ) 
        })

        const lowpitch = store.hightlightData.map((record, index) => {
            
            const startObj = {index: index, problem: "low pitch"}
            const endObj = {index: index + 1, problem: "low pitch"}
            return (
                <View key={Math.random()} data={[startObj, endObj]} animate={false}>
                    <Geom color={repetitionColor(record.abnormal_pitch[1])} type="line" size={14} position="index*problem"></Geom>
                </View>
            ) 
        })
 
        return (
        <div className="feature-container" style={{width: "100%", display:"flex"}}>
            <Chart scale={scale} width={store.GRAPH_WIDTH - 150} height={150} padding={{left: 120}} animate={false} className="feature-chart">
                {
                    store.selectedTime
                    ?
                    <View scale={scale} animate={false} data={[{index: store.cursorLocation, problem:"sentiment"}]}>
                        <Geom color="red" size={1} type="interval" position="index*problem"></Geom>
                    </View>
                    :
                    <View scale={scale} animate={false} data={[{index: store.HIGHTLIGHT_LENGTH / 2, problem:"sentiment"}]}>
                        <Geom color="red" size={1} type="interval" position="index*problem"></Geom>
                    </View>
                }
                {
                    sentiment
                }
                {
                    category
                }
                {
                    highpitch
                }
                {
                    lowpitch
                }
                {
                    repetition
                }
            </Chart>
            <LegendPanel></LegendPanel>
        </div>
        )
    }

}
