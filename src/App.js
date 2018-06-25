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
import Register from './components/Register/Register.js';


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
         box: {},
         route: 'signin',
         isSignedIn: false
      }
   }

   componentDidMount() {
      fetch('http://localhost:3000')
         .then(response => response.json())
         .then(data => console.log(data));
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

   onRouteChange = (route) => {
      if (route === 'signin') {
         this.setState({isSignedIn: false})
      } else if (route === 'home'){
          this.setState({isSignedIn: true})
      }
      this.setState({route: route});
   }


   render() {
      const { isSignedIn, route, imageURL, box } = this.state;
      return (
         <div className="App">

            <Particles 
               className='particles'
               params={particleOptions}
            />
            <Navigation 
               onRouteChange={this.onRouteChange} 
               isSignedIn={isSignedIn}
            />

            { route === 'home' 
               ?
                  <div>
                     <Rank />
                     <ImageLinkForm   
                        onInputChange={this.onInputChange}
                        onButtonSubmit={this.onButtonSubmit}
                     />
                     <FaceRecognition 
                        box={box} 
                        imageURL={imageURL} 
                     />
                  </div>
               :
                  (route === 'signin' 
                     ? <Signin onRouteChange={this.onRouteChange}/>
                     : <Register onRouteChange={this.onRouteChange}/>
                  )
            }  
         </div>
      );
   }
}

export default App;
