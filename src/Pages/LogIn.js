import React, { useCallback, useContext } from 'react';
import { withRouter, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import Fbase from '../Firebase/base';
import { AuthContext } from '../Firebase/Auth';

const LogIn = ({ history }) => {
	const handleLogin = useCallback(
		async (event) => {
			event.preventDefault();
			const { email, password } = event.target.elements;
			try {
				await Fbase.auth().signInWithEmailAndPassword(email.value, password.value);
				history.push('/');
			} catch (error) {
				alert(error);
			}
		},
		[ history ]
	);

	const { currentUser } = useContext(AuthContext);

	if (currentUser) {
		return <Redirect to="/" />;
	}

	return (
		<div>
			<h1>Log In</h1>
			<form onSubmit={handleLogin}>
				<label>
					Email
					<input name="email" type="email" />
				</label>
				<label>
					password
					<input name="password" type="password" />
				</label>
				<button type="submit">Log In</button>
			</form>
			<div>
				<h3>
					or <Link to="/signup">sign up</Link> here
				</h3>
			</div>
		</div>
	);
};

export default withRouter(LogIn);
