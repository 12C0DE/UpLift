import React, { useCallback } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import Fbase from '../Firebase/base';

const SignUp = ({ history }) => {
	const handleSignUp = useCallback(
		async (event) => {
			event.preventDefault();
			const { email, password, confirmpwd } = event.target.elements;

			if (password !== confirmpwd) {
				alert('Password does not match');
				return;
			}

			try {
				await Fbase.auth().createUserWithEmailAndPassword(email.value, password.value);
				history.push('/');
			} catch (error) {
				alert(error);
			}
		},
		[ history ]
	);

	return (
		<div>
			<h1>Sign Up</h1>
			<form onSubmit={handleSignUp}>
				<div>
					<label>
						First name
						<input name="fname" type="text" />
					</label>
					<label>
						Last name
						<input name="lname" type="text" />
					</label>
				</div>
				<div>
					<label>
						Email
						<input name="email" type="email" />
					</label>
					<label>
						Password
						<input name="password" type="password" />
					</label>
					<label>
						Confirm Password
						<input name="confirmpwd" type="password" />
					</label>
				</div>
				<button type="submit">Sign Up</button>
			</form>
			<div>
				<h3>
					already have an account?<Link to="/login"> Log in</Link> here
				</h3>
			</div>
		</div>
	);
};

export default withRouter(SignUp);
