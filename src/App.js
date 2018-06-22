import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation.js';
import Logo from './components/logo/Logo.js';
import 'tachyons';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm.js';
import Rank from './components/rank/Rank.js';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import { key } from './Api.json';
import FaceRecognition from './components/faceRecognition/FaceRecognition.js';


const app = new Clarifai.App({
 apiKey: key
});

const particleOptions = {
   particles: {
      number: {
         value: 50,
         density: {
            enable: true,
            value_area: 500
         }
      }
   },
   interactivity: {
      detect_on: "window",
      events: {
         onhover: { enable: true, mode: "repulse" },
         resize: true
      }
   }
}

class App extends Component {

   constructor() {
      super();
      this.state = {
         input: '',
         imageURL: '',
         box: {}
      }
   }

   calculateFaceLocation = (data) => {
      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementbyId('inputimage')
   }

   onInputChange = (event) => {
      this.setState({ input: event.target.value});
   }

   onButtonSubmit = () => {
      this.setState({ imageURL: this.state.input})
      app.models
      .predict(
         Clarifai.FACE_DETECT_MODEL, 
         this.state.input
      )
      .then(response => this.calculateFaceLocation(response))
      .catch(err => console.log(err));
   }

   render() {
      return (
         <div className="App">
         <Particles 
            className='particles'
            params={particleOptions}
         />
         <Navigation />
         <Logo />  
         <Rank />
         <ImageLinkForm   
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
         />
         <FaceRecognition imageURL={this.state.imageURL} />
      </div>
      );
   }
}

export default App;
