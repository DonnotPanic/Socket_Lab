import React, { Component } from 'react'
import { Input, DatePicker, Button, message } from 'antd';
const { TextArea } = Input;
const {ipcRenderer, session} = require('electron');

export default class Posting extends Component {
    constructor() {
        super();
        this.state = {
            date: undefined,
            content: "",
        }
    }

    handleDateChange = (_, datestring) => {
        let date = new Date(datestring);
        this.setState({date});
    }

    handleContentChange = (event) => {
        let content = event.target.value;
        this.setState({content});
    }

    post = () => {
        const username = sessionStorage.getItem('username');
        const date = this.state.date;
        const content = this.state.content;
        ipcRenderer.send("postReq",[username, date, content]);
        ipcRenderer.on("postRes",(event, args)=>{
            console.log("postRes",args);
            if (args === "success") {
                message.success('Post Successfully');
            } else {
                message.error("Error Occurs During Posting");
                sessionStorage.removeItem('username');
                window.location.href="#/login";
            }
        })
    }

    render() {
        return (
            <div>
                <h1>发布新留言</h1>
                <label>日期：</label>
                <DatePicker onChange={this.handleDateChange} />
                <br/>
                <br/>
                <label>内容：</label> <br/>
                <TextArea rows={4} value={this.state.content} onChange={this.handleContentChange}/>
                <br/>
                <br/>
                <Button size="medium" type="primary" onClick={this.post}>发布</Button>
            </div>
        )
    }
}
