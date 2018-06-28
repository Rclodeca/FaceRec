import React from 'react'; 


const Navigation = ({onRouteChange, isSignedIn}) => {
	if(isSignedIn) {
		return(
			<div className="ph3 mt4" style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p onClick={() => onRouteChange('signin')} 
					className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib pointer ma1">Sign Out
				</p>
			</div>
		);
	} else {
		return (
			<div className="ph3 mt4" style={{display: 'flex', justifyContent: 'flex-end'}}>
				<p onClick={() => onRouteChange('signin')} 
					className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib pointer ma1">Sign In
				</p>
				<p onClick={() => onRouteChange('register')} 
					className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib pointer ma1">Register
				</p>
			</div>
		);
	}
}

export default Navigation;