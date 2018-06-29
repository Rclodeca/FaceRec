import React from 'react'; 

const LoginError = ({invalidLogin}) => {
	if (invalidLogin) {
		return (
			<div> 
				<p className='red f6'>Invalid username or password</p>
			</div>
		)
	} else {
		return (
			<div> 
			
			</div>
		)
	}
}	

export default LoginError;