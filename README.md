## Overview
VisTA: Integrating Machine Intelligence with Visualization to Support the Investigation of Think-Aloud Sessions
This work has been presented at IEEE VIS 2019 (InfoVis)

Reference:
Mingming Fan, Ke Wu, Jian Zhao, Yue Li, Winter Wei, and Khai N. Truong. "VisTA: Integrating Machine Intelligence with Visualization to Support the Investigation of Think-Aloud Sessions." IEEE transactions on visualization and computer graphics (2019). 


## Setup
* This tool currently require ``Nodejs``, to install please visit https://nodejs.org/en/, LTS version is prefered.  
* This tool currently contains a front-end and a back-end part. To run the app please follow the instruction.

1. Installation:

In the root folder, run the command `npm install`

In the root folder, run the command `cd ming-project-server`

In the `~/ming-project-server` folder, run the command `npm install`

2. Back-end:

In the `~/ming-project-server` folder, run the command `node index.js`

The back-end server will run on port `8080`

3. Front-end:

In the root foler, run the command `npm start`

The front-end server will run on port `80`

## Data
All the video recordings and pre-processed session record should be placed in `~/src/static` and correctly registered in `~/src/static/data.js`

### registeration format
Every session is registered as label-key pair where `label` indicate the session name and `key` indicate the video file name. (* here label is used as key for mapping *)

## Download

All the user input including interaction with certain part of the app will be recorded and can be download by clicking finish button at the top  
To start the recording, you need first enter a `userID` and then click start button at the top to start recording

## Code structure
This app contains five major UI components, including a video player, a dynamic visualization of ML's predictions, a dynamic visualization of ML's input features, problem annotation functions, and highlight filters.
  
All the UI components is listening to a central data store. When the connected data fields are updated, the corresponding UI components will be re-rendered to show the change. Basically a user interaction on the chart or the video player will trigger the data store to be updated and UI to re-rendered, thanks to MobX.js.



