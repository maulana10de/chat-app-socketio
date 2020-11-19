import React, { Component } from 'react';
import { Button, Input, Table } from 'reactstrap';
import NavbarCom from './components/Navbar';
import io from 'socket.io-client';
import Axios from 'axios';
const APIURL = 'https://thawing-lake-66770.herokuapp.com ';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userCount: 0,
      pesan: '',
      user: '',
    };
  }

  onBtSendMessage = () => {
    Axios.post(APIURL + '/chat/sendMessages', {
      nama: this.state.user,
      message: this.state.pesan,
    }).then((res) => {
      alert('Message Send');
      this.setState({ pesan: '' });
    });
  };

  onBtClear = () => {
    Axios.delete(APIURL + '/chat/clearMessages').then((res) => {
      alert('Clear Messages');
    });
  };

  joinChat = () => {
    // untuk memberikan trigger komunikasi otomatis ke API BE, sesuai url. sehingga komunikasi socket terbuka
    const socket = io(APIURL);
    // mengaktifkan socket, untuk menunggu pesan berdasarkan eventKey dari pengirim
    socket.emit('JoinChat', { nama: this.state.user });
    socket.on('chat message', (msgs) => this.setState({ messages: msgs }));
    socket.on('user connected', (count) => this.setState({ userCount: count }));
    // socket.on('userCheck', (check) => {
    //   console.log(check);
    //   this.setState({ userCheck: check });

    //   if (check === true) {
    //     Axios.get(APIURL + '/chat/getMessages').then((res) => {
    //       this.setState({ messages: res.data });
    //       alert('Join Group');
    //     });
    //   } else {
    //     alert('User Exist');
    //   }
    // });
  };

  renderMessages = () => {
    return this.state.messages.map((item, index) => {
      return (
        <tr key={index}>
          <td>{item.nama}</td>
          <td>{item.message}</td>
        </tr>
      );
    });
  };

  render() {
    console.log(this.state.messages);
    return (
      <div className='container'>
        <NavbarCom />
        <hr />
        <h3 className='text-center'>ChatUI Group </h3>
        <div className='row d-flex justify-content-center '>
          <div className='col-md-6 border p-3 rounded'>
            <h5 className='text-center'>
              User Connected : {this.state.userCount}{' '}
            </h5>
            <hr />
            <Input
              className='mb-2'
              placeholder='Join Name'
              onChange={(e) => this.setState({ user: e.target.value })}
            />

            <Button size='sm' color='primary' onClick={this.joinChat}>
              Join
            </Button>
            <hr />
            <Table>
              <thead>
                <th>Nama</th>
                <th>Pesan</th>
                <th>
                  <Button
                    size='sm'
                    color='danger'
                    className='float-right'
                    onClick={this.onBtClear}
                  >
                    Clear
                  </Button>
                </th>
              </thead>
              <tbody>{this.renderMessages()}</tbody>
            </Table>
            <hr />
            <Input
              type='textarea'
              value={this.state.pesan}
              placeholder='Your messages'
              className='mb-2'
              onKeyUp={(e) =>
                e.key === 'Enter' && e.shiftKey
                  ? null
                  : e.key === 'Enter'
                  ? this.onBtSendMessage()
                  : null
              }
              onChange={(e) => this.setState({ pesan: e.target.value })}
            />
            <Button size='sm' color='success' onClick={this.onBtSendMessage}>
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
