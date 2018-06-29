import React from 'react'; 

const RegisterError = ({invalidRegister, dupeUser}) => {
	if (invalidRegister) {
		return (
			<div> 
				<p className='red f6'>Must fill out all fields</p>
			</div>
		);
	} else if (dupeUser) {
		return (
			<div> 
				<p className='red f6'>Error. Email already registered</p>
			</div>
		);
	} else {
		return (
			<div> 
				
			</div>
		)
	}
}	

export default RegisterError;