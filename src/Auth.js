import React, {Component} from 'react';

var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyDvwWTpeceltbAwVMT64wAracxbUVn3u_o",
    authDomain: "fir-login-71f0b.firebaseapp.com",
    databaseURL: "https://fir-login-71f0b.firebaseio.com",
    projectId: "fir-login-71f0b",
    storageBucket: "fir-login-71f0b.appspot.com",
    messagingSenderId: "420676080187"
};
firebase.initializeApp(config);


export default class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {err: ''};
        this.login = this.login.bind(this);
        this.logout = this.login.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    render() {
        return (
            <div>
                <input id="email" ref="email" type="email" placeholder="Enter your email:"/><br/>
                <input id="pass" ref="password" type="password" placeholder="Enter your Password:"/>

                <p>Err{this.state.err}</p>
                <button onClick={this.login}>Log In</button>
                <button onClick={this.signUp}>Sign up</button>
                <button onClick={this.logout}>Log Out</button>
            </div>
        );
    }

    login(event) {
        const email = this.refs.email.value;
        const password = this.refs.password.value;

        console.log("user loggined: " + email, password);

        const auth = firebase.auth();

        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => {
            var err = e.message;
            console.log("Login error: " + err);
            this.setState({err: "Login failed: " + err});
        })
    }

    logout() {

    }

    signUp() {
        const email = this.refs.email.value;
        const password = this.refs.password.value;

        console.log(email, password);

        const auth = firebase.auth();

        const promise = auth.createUserWithEmailAndPassword(email, password);
        promise
            .catch(e => {
                var err = e.message;
                console.log(err);
                this.setState({err: err});
            });

        promise
            .then(user => {
                var err = "Welcome " + user.user.email;
                firebase.database().ref('Users/' + user.user.uid).set({
                    email: user.user.email

                });
                console.log(user);
                this.setState({err: err});
            });


    }
}
