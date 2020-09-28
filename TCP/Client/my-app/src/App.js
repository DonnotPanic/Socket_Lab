import React from 'react';
import {
  UserOutlined,
  UploadOutlined,
  LogoutOutlined,} from '@ant-design/icons';
import {Layout, Menu, message} from 'antd';
import './App.css';
import Messsage from './message/messsage';
import Posting from './message/posting'
import Modal from 'antd/lib/modal/Modal';
const {ipcRenderer} = require('electron');


const {Header, Sider, Content, Footer} = Layout;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
      showModal: false,
      posting: false,
    };
    this.logout = this.logout.bind(this);
  };

  onCollapse = collapsed => {
    this.setState({
      collapsed: collapsed,
    });
  };

  logout = () => {
    let username = sessionStorage.getItem('username');
    ipcRenderer.send('logoutReq',username);
    ipcRenderer.on('logoutRes',(event, args)=>{
      if (args === "success") {
        sessionStorage.removeItem("username");
        window.location.href="#/login";
      } else {
        message.error(args);
        this.setState({
          showModal: false,
        });
      }
    });
  }

  onPosting = () => {
    this.setState({posting:true});
  }

  onReading = () => {
    this.setState({posting:false});
  }

  showModal = () => {
    this.setState({
      showModal: true
    });
  }

  handleCancel = e => {
    this.setState({
      showModal: false
    });
  };

  render(){
    let status = sessionStorage.getItem('username');
    if (!status) {
        window.location.href = "#/login";
    }
    return (
      <Layout style={{minHeight:'100vh'}}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />} onClick={this.onReading}>
              主页
            </Menu.Item>
            <Menu.Item key="2" icon={<UploadOutlined />} onClick={this.onPosting}>
              发布留言
            </Menu.Item>
            <Menu.Item key="3" icon={<LogoutOutlined />} onClick={this.showModal}>
              注销账户
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0}} />
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              minHeight: 360,
            }}
            >{this.state.posting?<Posting />:<Messsage />}
            <Modal
              title="确认注销？"
              visible={this.state.showModal}
              onOk={this.logout}
              onCancel={this.handleCancel}
            >
              <p>是否确认注销当前账户？</p>
            </Modal>
          </Content>
          <Footer style={{textAlign: 'center'}}>
            Lab2: TCP Socket ©2020 Created by ChroniCat
          </Footer>
          </Layout>
      </Layout>
    );
  }
}

export default App;
