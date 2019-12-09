import React, { Component } from 'react';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import {Select, Button, Radio, Input} from 'antd';
import store from './UIStore'
import './App.css';
import MyPlayer from './components/MyPlayer'
import MainChart from './components/MainChart'
import ProblemChart from './components/ProblemChart'
import ProblemPanel from './components/ProblemPanel'
import Filter from './components/Filter'
import FeaturePanel from './components/FeaturePanel'

const Option = Select.Option
const RadioGroup = Radio.Group
const selectionUpdate = action((value) => {
  store.selectedFile = value.label
  store.selectedVideoPath = "http://127.0.0.1:8080/video?id=" + value.key
  store.selectedJsonPath = String(value.label) + '.json'
})

const uistore = observable({
  enableStart: true,
  enableFinsh:false
})

@observer
export default class App extends Component {
  @observable test = true;
  @observable enableStart = true;
  @observable enableFinsh = false;

  escFunction(event){
    if(event.keyCode === 27) {
      if (store.playerRef && store.playerState) {
        if (store.playerState.paused) {
          const i = store.userInput.findIndex(record => record.fakeInput)
          if (i != -1) {
            store.userInput.splice(i, 1)
          }
          store.playerRef.play()
          store.advanceCat = []
          store.advanceHighPitch = []
          store.advanceLowPitch = []
          store.advanceNeg = []
          store.advanceRep = []
          store.advanceSent = []
        } else {
          store.playerRef.pause()
          const time = Math.min(store.selectedStartTime + store.HIGHTLIGHT_LENGTH / 2, store.rawData.length-1)
          const feature = {
            sentiment: store.rawData[time].sentiment_gt,
            low_speechrate: store.rawData[time].abnormal_speechrate[1],
            category: store.rawData[time].category,
            low_pitch:store.rawData[time].abnormal_pitch[1],
            high_pitch:store.rawData[time].abnormal_pitch[0]
        }
          store.userInput.push({
            start_index: store.selectedStartTime,
            end_index: store.selectedEndTime,
            color: store.selectedColor,
            checked: false,
            master: false,
            title: store.problemTitle,
            description: store.problemDescription,
            key: store.count,
            feature: feature,
            sessionTime: (Date.now() - store.start_time) / 1000,
            fakeInput: true,
          })
          store.advanceCat = [feature.category]
          store.advanceLowPitch = [String(feature.low_pitch)]
          store.advanceRep = [String(feature.low_speechrate)]
          store.advanceSent = [String(feature.sentiment)]
          store.advanceHighPitch = [String(feature.high_pitch)]
        }
      }
    }
    if (event.keyCode === 39) {
      if (store.playerRef && store.playerState) {
        store.playerRef.pause()
        store.playerRef.forward(1)
      }
    }

    if (event.keyCode === 37) {
      if (store.playerRef && store.playerState) {
        store.playerRef.pause()
        store.playerRef.replay(1)
      }
    }
  }
  startFunction() {
    console.log(this)
    uistore.enableStart = false;
    uistore.enableFinsh = true;
    store.start_time = Date.now()
    store.sessionId = window.setInterval(() => {
      store.playBackInteraction.push({sessionTime: (Date.now() - store.start_time) / 1000, videoTime: store.playerState.currentTime, search: {cat: store.advanceCat, neg: store.advanceNeg, low_speechrate: store.advanceRep, sent: store.advanceSent, high_pitch: store.advanceHighPitch, low_pitch: store.advanceLowPitch}})
    }, 1000)
  }

  endFunction() {
    uistore.enableStart = true;
    uistore.enableFinsh = false
    window.clearInterval(store.sessionId)
    function download(content, fileName, contentType) {
      var a = document.createElement("a");
      var file = new Blob([content], {type: contentType});
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }
    download(JSON.stringify(store.playBackInteraction), store.userName + '-playback.json', 'text/json')
    download(JSON.stringify(store.userInput), store.userName + '-problem.json', 'text/json')
    download(JSON.stringify(store.problemChartInteraction), store.userName + '-problemChart.json', 'text/json')
  }
  componentDidMount(){
    document.addEventListener("keydown", this.escFunction, false);
    this.startFunction = this.startFunction.bind(this)
    this.endFunction = this.endFunction.bind(this)
  }
  render() {
    return(
      <div className="main-container" onKeyDown={(event) => {
        // console.log(event.keyCode)
        // if (store.playerRef && event.keyCode == 27) {
        //   store.playerRef.pause()
        // }
      }}>
        <div className="header-container">
          <Input style={{width: 240}} onChange={(e)=>{store.userName = e.target.value}} placeholder="Enter user ID"></Input>
          <Select placeholder="Please Select" onSelect={selectionUpdate} labelInValue style={{width: 240}}>
            {store.files.map((item) => {
              return(
                  <Option key={item.label} value={item.key}>{item.label}</Option>
              )
            }
            )}
          </Select>
          <Button disabled={!uistore.enableStart} onClick={this.startFunction}>
            Start
          </Button>
          <Button disabled={!uistore.enableFinsh} onClick={this.endFunction}>
            Finish
          </Button>
          <RadioGroup onChange={(e) => {store.testCondition = e.target.value}} value={store.testCondition}>
            <Radio value={1}>Default</Radio>
            <Radio value={2}>Prediction Visualization</Radio>
            <Radio value={3}>Full</Radio>
          </RadioGroup>

        </div>
        <div className="left-container">
          <div className="top-container">
            <MyPlayer />
          </div>
            <div className="chart-container">
              {store.testCondition == 3 && store.playerState && store.selectedJsonPath ? <ProblemChart /> : null}
              {store.testCondition != 1 && store.playerState && store.selectedJsonPath ? <MainChart x="index" y="prediction" showProblem={true}/> : null}
              {store.testCondition == 3 && store.playerState && store.selectedJsonPath ? <FeaturePanel size={store.HIGHTLIGHT_LENGTH} cursor={store.cursorLocation}></FeaturePanel> : null}
            </div>
        </div>
        <div className="right-container">
          <ProblemPanel />

          <div className="filter-container">
            <Filter></Filter>
          </div>
        </div>
      </div>
    )
  }
}
