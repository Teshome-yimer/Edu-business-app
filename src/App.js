import React from "react";
import Button from "@guandata/guandata-design/lib/button";
import "./App.css";
import MyPhoto from './myphoto.jpg';
// <-- put your photo in src folder

function App() {
    return ( <
        div className = "App" > { /* Your photo */ }

        <
        img src = { MyPhoto }
        alt = "Teshome"
        style = {
            { width: "200px", borderRadius: "50%", marginBottom: "20px" }
        }
        />


        <
        h1 > 🎓Edu - Business Platform < /h1>  <
        p > Welcome to our education platform! < /p>


        <
        div >

        <
        Button style = {
            { margin: "10px", padding: "10px 20px" }
        } >
        Student Login <
        /Button>  <
        Button style = {
            { margin: "10px", padding: "10px 20px" }
        } >
        Tutor Login <
        /Button>  <
        Button style = {
            { margin: "10px", padding: "10px 20px" }
        } >
        Admin Login <
        /Button>  <
        /div>  <
        /div>
    );
}

export default App;