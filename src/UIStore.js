import {observable, computed} from 'mobx';
import {files} from './static/data'
class UIStore {
    @observable start_time = 0
    @observable sessionId = 0
    files = files
    GRAPH_WIDTH = 600
    @observable HIGHTLIGHT_LENGTH = 10
    @observable HIGHLIGHT_BACKUP = 10
    levelSet = [
        {
            "hex": "#bae7ff",
            "name": "No Problem",
            "rgb": "(203, 65, 84)",
            "level": "0",
            "tooltip": ""
        },
        {
            "hex": "#52c41a",
            "name": "Cosmetic Problem",
            "rgb": "(255, 43, 43)",
            "level": "1",
            "tooltip": "Need not be fixed unless extra time is available on project."
        },
        {
            "hex": "#fadb14",
            "name": "Minor Usability Problem",
            "rgb": "(255, 73, 108)",
            "level": "2",
            "tooltip": "Fixing this should be given low priority."
        },
        {
            "hex": "#fa8c16",
            "name": "Major Usability Problem",
            "rgb": "(238,32 ,77 )",
            "level": "3",
            "tooltip": "Important to fix, so should be given high priority."
        },
        {
            "hex": "#cf1322",
            "name": "Usability Catastrophe",
            "rgb": "(255, 83, 73)",
            "level": "4",
            "tooltip": "Imperative to fix this before product can be released."
        },
    ]
    @observable userName = ""
    @observable problemTitleSet = [
    ]
    @observable testCondition = 1
    @observable showProblemPannel
    @observable selectedFile
    @observable selectedVideoPath
    @observable videoLoaded
    @observable playerState
    @observable selectedJsonPath
    @observable currentHover
    @observable playerRef
    @observable userInput = [

    ]
    @observable playBackInteraction = []
    @observable problemChartInteraction = []
    @observable recordInteraction = []
    @observable showChecked = false
    @observable masterInput
    @observable showMaster
    @observable showMasterDiff
    @observable showMasterSim
    @observable problemTitle
    @observable problemDescription
    @observable selectedColor = this.levelSet[0].hex
    @observable selectedStartTime = 0
    @observable selectedEndTime = 0
    @observable selectedTime = false
    @observable advanceRep = []
    @observable advanceNeg = []
    @observable advanceCat = []
    @observable advanceSent = []
    @observable advanceHighPitch = []
    @observable advanceLowPitch = []
    @observable addingDisabled = false
    @observable searchCheckedLevel = []
    @observable dataSource = []
    @observable count = 0
    @computed get hideControl() {
        return this.testCondition != 1
    }
    @computed get cursorLocation() {
        if (!this.selectedTime) {
            return -1
        }
        return parseInt(this.playerState.currentTime - this.selectedStartTime, 10)
    }
    @computed get unitLength() {
        if (this.selectedJsonPath) {
            return this.rawData.length / (this.GRAPH_WIDTH - 10)
        }
    }
    @computed get rawData() {
        //return (this.selectedJsonPath ? require('./static/' + this.selectedJsonPath) : [])
        if (this.selectedJsonPath) {
            const json = require('./static/' + this.selectedJsonPath)
            const end_time = parseInt(json[json.length-1].end_time, 10)
            let result = []
            for (var i=0; i<end_time; i++) {
                let temp
                for (var j = 0; j<json.length; j++) {
                    if (json[j].start_time <= i && json[j].end_time >= i) {
                        temp = json[j]
                        break
                    }
                }
                if (temp.problem == 1) {
                    temp.problem_h = 1
                }
                result = result.concat({...temp, index: i})
            }
            return result
        }
    }
    @computed get hightlightData() {
        if (this.selectedTime) {
            console.log(1)
            return this.rawData.slice(this.selectedStartTime, this.selectedEndTime + 1)
        }
        const currentTime = Math.max(parseInt(this.playerState.currentTime, 10), 0)
        const lowerBound = Math.max(parseInt(this.playerState.currentTime - this.HIGHTLIGHT_LENGTH / 2, 10), 0)
        return this.rawData.slice(lowerBound, currentTime + this.HIGHTLIGHT_LENGTH / 2).map(item => ({...item, h:1}))
    }

    @computed get userProblem() {
        const result = []
        this.userInput.forEach((record) => {
            result.push(this.rawData.slice(record.start_index, record.end_index).map(item => ({...item, h:1, color:record.color})))
        })
        return result
    }
    @computed get advanceData () {
        if (this.testCondition !=3 ) {
            return []
        }
        const result = []
        this.rawData.forEach((record) => {
            if (
                (this.advanceRep.includes(String(record.abnormal_speechrate[1])) || this.advanceRep.length == 0)
                &&
                (this.advanceCat.includes(String(record.category)) || this.advanceCat.length == 0)
                &&
                (this.advanceSent.includes(String(record.sentiment_gt)) || this.advanceSent.length == 0)
                &&
                (this.advanceHighPitch.includes(String(record.abnormal_pitch[0])) || this.advanceHighPitch.length == 0)
                &&
                (this.advanceLowPitch.includes(String(record.abnormal_pitch[1])) || this.advanceLowPitch.length == 0)
                &&
                (this.advanceCat.length != 0 || this.advanceRep.length != 0 || this.advanceSent.length != 0 || this.advanceHighPitch.length != 0 || this.advanceLowPitch.length != 0)
            ) {
                result.push({...record, h:1})
            }
        })
        console.log(result)
        return result
    }

    @computed get progress() {
        return String((parseFloat(this.playerState.currentTime) / parseFloat(this.playerState.duration)) * 100) + "%"
    }

    @computed get transcript() {
        return (this.selectedJsonPath ? require('./static/' + this.selectedJsonPath) : [])
    }

    @computed get featurePanelScale() {
        return {
            index: {
                min: 0,
                max: this.HIGHTLIGHT_LENGTH,
                nice: false
            },
            problem: {
                type : "cat",
                values: ["category", "negation", "low speechrate", "sentiment", "high pitch", "low pitch"]
            },
            h: {
                min: 0,
                max: 1.2,
                ticks: [0, 0.3, 0.6, 0.9, 1, 1.2]
            }
        }
    }

}



const store = new UIStore()
export default store
