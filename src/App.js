import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { About } from './Pages/About';
import { Home } from './Pages/Home';
import { Lifts } from './Pages/Lifts';
import { Exercise } from './Pages/Exercise';
import { NotFound } from './Pages/NotFound';
import LogIn from './Pages/LogIn';
import SignUp from './Pages/SignUp';
import { AuthProvider } from './Firebase/Auth';
import { GlobalProvider } from './Context/GlobalState';
import { PrivateRoute } from './PrivateRoute';
import './App.css';

function App() {
	return (
		<GlobalProvider>
			<AuthProvider>
				<BrowserRouter>
					<Switch>
						<PrivateRoute exact path="/" component={Home} />
						<Route exact path="/about" component={About} />
						<Route exact path="/exercise" component={Exercise} />
						<Route exact path="/lifts" component={Lifts} />
						<Route exact path="/login" component={LogIn} />
						<Route exact path="/signup" component={SignUp} />
						<Route path="/404" component={NotFound} />
						<Redirect to="/404" />
					</Switch>
				</BrowserRouter>
			</AuthProvider>
		</GlobalProvider>
	);
}

export default App;
