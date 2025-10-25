import React, { useState } from "react";
import axios from "axios";

function AddStudentForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post("http://localhost:3000/users", { name, email, password })
            .then((res) => {
                setMessage(res.data.message);
                setName("");
                setEmail("");
                setPassword("");
            })
            .catch((err) => {
                console.error(err);
                setMessage("Error adding user");
            });
    };

    return ( <
        div style = {
            { maxWidth: "400px", margin: "20px auto", textAlign: "left" } } >
        <
        h2 > Add New Student < /h2> <
        form onSubmit = { handleSubmit } >
        <
        div >
        <
        label > Name: < /label> <
        input type = "text"
        value = { name }
        onChange = {
            (e) => setName(e.target.value) }
        required style = {
            { width: "100%", padding: "8px", margin: "5px 0" } }
        /> <
        /div> <
        div >
        <
        label > Email: < /label> <
        input type = "email"
        value = { email }
        onChange = {
            (e) => setEmail(e.target.value) }
        required style = {
            { width: "100%", padding: "8px", margin: "5px 0" } }
        /> <
        /div> <
        div >
        <
        label > Password: < /label> <
        input type = "password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value) }
        required style = {
            { width: "100%", padding: "8px", margin: "5px 0" } }
        /> <
        /div> <
        button type = "submit"
        style = {
            { padding: "10px 20px", marginTop: "10px" } } >
        Add Student <
        /button> <
        /form> {
            message && < p > { message } < /p>} <
                /div>
        );
    }

    export default AddStudentForm;