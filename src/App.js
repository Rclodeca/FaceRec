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
         value: 20,
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

const initialState = {
   input: '',
   imageURL: '',
   box: {},
   route: 'signin',
   isSignedIn: false,
   user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
   }
} 

class App extends Component {

   constructor() {
      super();
      this.state = initialState;
   }

   loadUser = (data) => {
      this.setState({user: {
         id: data.id,
         name: data.name,
         email: data.email,
         entries: data.entries,
         joined: data.joined
      }});
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
      if(this.state.imageURL === this.state.input) {
         return;
      }
      this.setState({imageURL: this.state.input});
      app.models
      .predict(
         Clarifai.FACE_DETECT_MODEL, 
         this.state.input
      )
      .then(response => {
         if (response) {
            fetch('http://localhost:3000/image', {
               method: 'put',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
                  id: this.state.user.id
               })
            })
               .then(response => response.json())
               .then(count => {
                  this.setState(Object.assign(this.state.user, {
                     entries: count
                  }));
               })
               .catch(err => console.log(err));
         }
         this.displayFaceBox(this.calculateFaceLocation(response));
      })   
      .catch(err => console.log(err));
   }

   onRouteChange = (route) => {
      if (route === 'signin') {
         this.setState(initialState);
      } else if (route === 'home'){
          this.setState({isSignedIn: true});
      }
      this.setState({route: route});
   }


   render() {
      const { isSignedIn, route, imageURL, box, user } = this.state;
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
                     <Rank 
                        name={user.name}
                        entries={user.entries}
                     />
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
                     ? <Signin 
                        onRouteChange={this.onRouteChange}
                        loadUser={this.loadUser}
                     />
                     : <Register 
                           onRouteChange={this.onRouteChange}
                           loadUser={this.loadUser}
                        />
                  )
            }  
         </div>
      );
   }
}

export default App;
