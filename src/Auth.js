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
    this.logout = this.logout.bind(this);
    this.signUp = this.signUp.bind(this);
    this.signInWithGoogle = this.signInWithGoogle.bind(this);
  }

  render() {
    return (
      <div>
        <input id="email" ref="email" type="email" placeholder="Enter your email:"/><br/>
        <input id="pass" ref="password" type="password" placeholder="Enter your Password:"/>

        <p>Err{this.state.err}</p>
        <button id="login" onClick={this.login}>Log In</button>
        <button onClick={this.signUp}>Sign up</button>
        <button id="logout" className="hide" onClick={this.logout}>Log Out</button>
        <button id="google" onClick={this.signInWithGoogle}>Google Login</button>
      </div>
    );
  }

  login(event) {
    const email = this.refs.email.value;
    const password = this.refs.password.value;

    console.log("user loggined: " + email, password);

    const auth = firebase.auth();

    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.then(() => {
      var lout = document.getElementById("logout");
      lout.classList.remove('hide');
      var lin = document.getElementById("login");
      lin.classList.add('hide');
      this.setState({err: "YOu have successfully logged in..."});
    });
    promise.catch(e => {
      var err = e.message;
      console.log("Login error: " + err);
      this.setState({err: "Login failed: " + err});
    })
  }

  logout() {
    const auth = firebase.auth();

    const promise = auth.signOut();

    var lout = document.getElementById("logout");
    lout.classList.add('hide');
    this.setState({err: "YOu have successfully logged out..."});

    var lin = document.getElementById("login");
    lin.classList.remove('hide');
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

  signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    var promise = firebase.auth().signInWithPopup(provider);
    promise.then(result => {
      var user = result.user;
      console.log("google: " + result.user.uid);
      firebase.database().ref('Users/' + user.uid).set({
        email: user.email,
        name: user.displayName,
      });
    }).catch(e => {
      var err = e.message;
      console.log(err);
      this.setState({err: err});
    })
  }
}
