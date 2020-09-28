import { List, message,Button } from 'antd';
import React, { Component } from 'react'
const {ipcRenderer} = require('electron');

//TDO
export default class Messsage extends Component {

    constructor(){
        super();
        this.state = {
            messages: [],
        };
        this.getAllMessages();
    }

    getAllMessages = () => {
        const username = sessionStorage.getItem('username');
        ipcRenderer.send("getReq",username);
        ipcRenderer.on('getRes',(event, args)=>{
            if (typeof(args) != "string"){
                this.setState({
                    messages: args,
                })
            } else {
                message.error(args);
                sessionStorage.removeItem('username');
                window.location.href='#/login';
            }
        });
    }

    render() {
        return (
            <div>
                ALL MESSAGES: <br/>
                <Button type="dashed" onClick={this.getAllMessages}>
                    点击刷新
                </Button>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.messages}
                    pagination={{
                        pageSize: 3,
                    }}
                    footer={
                        <div>
                            生前何必久睡，死后定会长眠。
                        </div>
                    }
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta 
                                title={<b>TIME:{new String(item.uploadtime).match(/\d{4}-\d{2}-\d{2}/g)}</b>}
                                description={item.content}
                            />
                        </List.Item>
                    )}
                >
                </List>
                <a href='#/login'>登录</a>
            </div>
        )
    }
}
