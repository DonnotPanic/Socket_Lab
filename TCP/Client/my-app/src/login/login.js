import React, { Component } from 'react';
import 'antd/dist/antd.css';
import {Alert, Button, Input} from 'antd';
import {Helmet} from 'react-helmet';
import {UserOutlined,KeyOutlined} from '@ant-design/icons';
import './login.css';
const {ipcRenderer} = require('electron');

class Login extends Component {
    constructor() {
        super();
        this.state = {
            "name": "",
            "password": "",
            "displayAlert": false
        };
        this.handleName = this.handleName.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.login = this.login.bind(this);
    }
    render() {
        let status = sessionStorage.getItem('username');
        if (status) {
            window.location.href = "#/";
        }
        return (
            <div>
                <Helmet bodyAttributes={{style:'background:linear-gradient(45deg,rgba(254,172,94,0.8),rgba(199,121,208,0.8),rgba(75,192,200,0.8));'}} />
                    <div className="login-header">
                        <h1 className="white-font">登录</h1>
                    </div>
                    <div className="login">
                        {
                            this.state.displayAlert?(
                                <Alert
                                message="Error"
                                description="登录失败。请检查用户名和密码是否正确。"
                                type="error"
                                showIcon />
                            ):null
                        }
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label><b>用户名：</b></label>
                                    </td>
                                    <td>
                                        <Input size = "large" onChange = {this.handleName} value = {this.state.name} prefix={<UserOutlined />} />
                                    </td>
                                </tr>
                                <br />
                                <tr>
                                    <td>
                                        <label><b>密码：</b></label>
                                    </td>
                                    <td>
                                        <Input.Password size = "large" onChange = {this.handlePassword} value = {this.state.password} prefix={<KeyOutlined />}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br />
                        <div className="login-button">
                            <Button size="large" type="primary" onClick={this.login}>登录</Button>  
                            <Button type="link" href="#/register" className="white-font">
                                没有账户？点此注册
                            </Button>
                        </div>
                    </div>
            </div>
        )
    }
    handleName(event) {
        let name = event.target.value.replace(/[`~%!@#^=''?~！@#￥……&——‘”“'？*()（），,。.、]/ig,'');
        if (name.length < 13) {
            this.setState({
                "name": name,
            })
        }
    }
    handlePassword(event) {
        let password = event.target.value.replace(/[^\d\w_!]/ig,'');
        if (password.length < 13) {
            this.setState({
                "password": password,
            })
        }
    }

    loginFailue() {
        this.setState ({
            "displayAlert": true
        });
    }

    login() {
        const username = this.state.name;
        const password = this.state.password.toLowerCase();
        ipcRenderer.send("loginReq", [username,password]);
        ipcRenderer.on("loginRes", (event, args) => {
            if (args === "success"){
                sessionStorage.setItem("username", this.state.name);
                window.location.href="#/";
            } else {
                this.setState ({
                    "displayAlert": true
                });
            }
        });
    }
}


export default Login;
