/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import {action} from 'mobx';
import {Button, Checkbox} from 'antd'  
import {observer} from 'mobx-react';
import store from '../UIStore'
import './Filter.css'
import EditableTable from './EditableTable.js'

@observer
export default class Filter extends Component {

    @action
    onSearch (value) {
        store.showChecked = true
        store.userInput.map((record) => (
            (String(record.description).includes(value)) && (store.searchCheckedLevel.length == 0 || store.searchCheckedLevel.includes(record.color))? record.checked = true : record.checked = false
        ))
    }

    @action
    onTitleSearch (value) {
        store.showChecked = true
        store.userInput.map((record) => (
            (String(record.title).includes(value))? record.checked = true : record.checked = false
        ))
    }

    @action
    handleChange (checkedValues) {
        store.searchCheckedLevel = checkedValues
        store.userInput.map((record) => (
            checkedValues.includes(record.color) ? record.checked = true : record.checked = false
        ))
        if (checkedValues.length > 0) {
            store.showChecked = true
        } else {
            store.showChecked = false
        }
    }

    @action
    clearHighlight () {
        store.showChecked = false
        store.userInput.map((record) => (
            record.checked = false
        ))
    }

    @action
    onChangeMasterSwitch (checked) {
        store.showMaster = checked
    }

    @action
    onChangeMasterDiff (checked) {
        store.showMasterDiff = checked
    }

    @action
    onChangeMasterSim (checked) {
        store.showMasterSim = checked
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="filter-container">
                <div className="filter-left">
                    <EditableTable dataSource = {store.dataSource}></EditableTable>
                    {store.testCondition == 3 && store.playerState && store.selectedJsonPath ? <div className="advance-group">
                        <span className="filter-category">
                            Filters:
                        </span>
                        <div>
                            <span className="filter-sub-category">
                                Sentiment:
                            </span>
                            <Checkbox.Group value={store.advanceSent} onChange={(value) => {store.advanceSent = value}}>
                                <Checkbox value="-1">-1</Checkbox>
                                <Checkbox value="0">0</Checkbox>
                                <Checkbox value="1">1</Checkbox>
                            </Checkbox.Group>
                        </div>
                        <div>
                            <span className="filter-sub-category">
                                Category:
                            </span>
                            <Checkbox.Group value={store.advanceCat} onChange={(value) => {store.advanceCat = value}}>
                                <Checkbox value="Reading">Reading(R)</Checkbox>
                                <Checkbox value="Procedure">Procedure(P)</Checkbox>
                                <Checkbox value="Observation">Observation(O)</Checkbox>
                                <Checkbox value="Explanation">Explanation(E)</Checkbox>
                            </Checkbox.Group>
                        </div>
                        <div>
                            <span className="filter-sub-category">
                                High Pitch:
                            </span>
                            <Checkbox.Group value={store.advanceHighPitch} onChange={(value) => {store.advanceHighPitch = value}}>
                                <Checkbox value="0">0</Checkbox>
                                <Checkbox value="1">1</Checkbox>
                            </Checkbox.Group>
                        </div>
                        <div>
                            <span className="filter-sub-category">
                                Low Pitch:
                            </span>
                            <Checkbox.Group value={store.advanceLowPitch} onChange={(value) => {store.advanceLowPitch = value}}>
                                <Checkbox value="0">0</Checkbox>
                                <Checkbox value="1">1</Checkbox>
                            </Checkbox.Group>
                        </div>
                        <div>
                            <span className="filter-sub-category">
                                Low Speech Rate:
                            </span>
                            <Checkbox.Group value={store.advanceRep} onChange={(value) => {store.advanceRep = value}}>
                                <Checkbox value="0">0</Checkbox>
                                <Checkbox value="1">1</Checkbox>
                            </Checkbox.Group>
                        </div>
                        <Button onClick={
                            () => {
                                store.advanceCat = []
                                store.advanceHighPitch = []
                                store.advanceLowPitch = []
                                store.advanceNeg = []
                                store.advanceRep = []
                                store.advanceSent = []
                            }
                        }>Clear</Button>
                    </div> : null}
                </div>
            </div>
        )
    }

}
