import React, { Component } from 'react';
import './App.css';
import Navigation from './components/navigation/Navigation.js';
import Logo from './components/logo/Logo.js';
import 'tachyons';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm.js';
import Rank from './components/rank/Rank.js';
import Particles from 'react-particles-js';


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
        <ImageLinkForm />
        {/*<FaceRecognition />*/}
      </div>
    );
  }
}

export default App;
