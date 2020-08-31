import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { About } from './Pages/About';
import { AddLift } from './Pages/AddLift';
import { CurrentLift } from './Pages/CurrentLift';
import { Home } from './Pages/Home';
import { ExCats } from './Pages/ExCats';
import { Exercise } from './Pages/Exercise';
import { Lifts } from './Pages/Lifts';
import { NotFound } from './Pages/NotFound';
import { Programs } from './Pages/Programs';
import { Workout } from './Pages/Workout';
import { Workouts } from './Pages/Workouts';
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
						<Route exact path="/addlift" component={AddLift} />
						<Route exact path="/currlift" component={CurrentLift} />
						<Route exact path="/exercise" component={Exercise} />
						<Route exact path="/excats" component={ExCats} />
						<Route exact path="/lifts" component={Lifts} />
						<Route exact path="/login" component={LogIn} />
						<Route exact path="/programs" component={Programs} />
						<Route exact path="/signup" component={SignUp} />
						<Route path="/workout/:wid" component={Workout} />
						<Route exact path="/workouts" component={Workouts} />
						<Route path="/404" component={NotFound} />
						<Redirect to="/404" />
					</Switch>
				</BrowserRouter>
			</AuthProvider>
		</GlobalProvider>
	);
}

export default App;
