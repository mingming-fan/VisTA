
import React, { Component } from 'react';
import {action} from 'mobx';
import {Select, Input, Button} from 'antd'
import {observer} from 'mobx-react';
import store from '../UIStore'
import './ProblemPanel.css'

const Option = Select.Option;
const TextArea = Input.TextArea

const handleSubmit = action(() => {
    const time = Math.min(store.selectedStartTime + store.HIGHTLIGHT_LENGTH / 2, store.rawData.length-1)
    store.userInput.push({
        current: store.playerState ? store.playerState.currentTime : 0,
        start_index: store.selectedStartTime,
        end_index: store.selectedEndTime,
        color: store.selectedColor,
        checked: false,
        master: false,
        title: store.problemTitle,
        description: store.problemDescription,
        key: store.count,
        feature: {
            sentiment: store.rawData[time].sentiment_gt,
            low_speechrate: store.rawData[time].abnormal_speechrate[1],
            category: store.rawData[time].category,
            low_pitch:store.rawData[time].abnormal_pitch[1],
            high_pitch:store.rawData[time].abnormal_pitch[0]
        },
        sessionTime: (Date.now() - store.start_time) / 1000,
        fakeInput: false,
    })

    store.count = store.count + 1
    store.selectedColor = undefined
    store.problemDescription = undefined
    if (store.problemTitle) {
        store.problemTitle.forEach((record) => {
            if (!store.problemTitleSet.includes(record)){
                store.problemTitleSet.push(record)
            }
        })
    }
    store.problemTitle = []

})

@observer
export default class ProblemPanel extends Component {

    render() {
        const problemTitleSet = store.problemTitleSet.map((v) => (
            <Option key={v} value={v}>{v}</Option>
        ))
        const currentTime = store.playerState ? store.playerState.currentTime : 0
        return (
            <div className="form-container">
                    <div className="form-field">
                        <Input readOnly addonBefore="Current Time:" value={new Date(currentTime * 1000).toISOString().substr(14, 5)}/>
                    </div>
                    <div className="form-field">
                        <TextArea autosize={{minRows: 7}} value={store.problemDescription} onChange={action((e) => {store.problemDescription = e.target.value})} placeholder="Please Enter A Problem Description."/>
                    </div>
                    <div className="form-field">
                        <Select value={store.problemTitle} onChange={action((value) => {store.problemTitle = value})} mode="tags" style={{width: '100%'}} placeholder="Add Tags">
                            {
                                problemTitleSet
                            }
                        </Select>
                    </div>
                    <div className="form-field submit-button">
                        <Button type="primary" style={{width: '100%'}} onClick={handleSubmit} disabled={store.addingDisabled} >
                           Add
                        </Button>
                    </div>
            </div>
        )
    }

}
