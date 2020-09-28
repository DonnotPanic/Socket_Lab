import React, { Component } from 'react'
import 'antd/dist/antd.css'
import {Button, Input, message} from 'antd'
import {Helmet} from 'react-helmet';
import './login.css'
const {ipcRenderer} = require('electron');


export default class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            password: "",
            confirmPassword: "",
        };
        this.handleName = this.handleName.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
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
                    <h1 className="white-font">注册</h1>
                </div>
                <div className="login">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label><b>用户名：</b></label>
                                </td>
                                <td>
                                    <Input size = "large" onChange = {this.handleName} value = {this.state.name} />
                                </td>
                                <td>
                                {this.state.name.length < 4?(<p>"用户名长度不小于4"</p>):null}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label><b>密码：</b></label>
                                </td>
                                <td>
                                    <Input size = "large" onChange = {this.handlePassword} value = {this.state.password} type="password"/>
                                </td>
                                <td>
                                    {this.state.password.length < 4?(<p>"请至少输入4位密码"</p>):null}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label><b>确认密码：</b></label>
                                </td>
                                <td>
                                    <Input size = "large" onChange = {this.handleConfirmPassword} value = {this.state.confirmPassword} type="password"/>
                                </td>
                                <td>
                                    {this.state.password!==this.state.confirmPassword?(<p>"前后两次密码不一致"</p>):null}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>
                    <div className="login-button">
                        <Button size="large" type="primary" 
                            onClick={this.register}
                            disabled={this.state.password!==this.state.confirmPassword 
                            || this.state.password.length < 4 
                            || this.state.name.length < 4 }>注册</Button>  
                        <Button type="link" href="#/login" className="white-font">
                            已有账户？点此登录
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
                name: name,
            })
        }
    }
    handlePassword(event) {
        let password = event.target.value.replace(/[^\d\w_!]/ig,'');
        if (password.length < 13) {
            this.setState({
                password: password,
            })
        }
    }  
    handleConfirmPassword(event) {
        let confirmPassword = event.target.value.replace(/[^\d\w_!]/ig,'');
        if (confirmPassword.length < 13) {
            this.setState({
                confirmPassword: confirmPassword,
            })
        }
    }
    
    handleErrorInfo = (errorInfo) => {
        message.error(errorInfo);
    }

    register = () => {
        const username = this.state.name;
        const password = this.state.password.toLowerCase();
        ipcRenderer.send("registerReq", [username,password]);
        ipcRenderer.on("registerRes", (event, args) => {
            if (args === "success") {
                window.location.href="#/login";
            } else {
                this.handleErrorInfo(args);
            }
        })
    }
    
}
