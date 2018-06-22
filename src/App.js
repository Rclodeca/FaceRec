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
import Signin from './components/SignIn/SignIn.js';


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
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
         leftCol: clarifaiFace.left_col * width,
         topRow: clarifaiFace.top_row * height,
         rightCol: width - (clarifaiFace.right_col * width),
         bottomRow: height - (clarifaiFace.bottom_row * height)
      }
   }

   displayFaceBox = (box) => {
      console.log(box);
      this.setState({box: box});
   }

   onInputChange = (event) => {
      this.setState({ input: event.target.value});
   }

   onButtonSubmit = () => {
      this.setState({ imageURL: this.state.input});
      app.models
      .predict(
         Clarifai.FACE_DETECT_MODEL, 
         this.state.input
      )
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
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
         <Signin />
         {/*<Logo /> */} 
         <Rank />
         <ImageLinkForm   
            onInputChange={this.onInputChange}
            onButtonSubmit={this.onButtonSubmit}
         />
         <FaceRecognition 
            box={this.state.box} 
            imageURL={this.state.imageURL} 
         />
      </div>
      );
   }
}

export default App;
