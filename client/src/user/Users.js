import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import imagesProfile from '../images/avatar.jpg'

// methods
import { list } from '../user/apiUser';

class Users extends Component {
  constructor() {
    super();

    this.state = {
      users: []
    };
  }

  componentDidMount() {
    list().then(data => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          users: data
        });
      }
    });
  }

  renderUsers = users => (
    <div className='row'>
      {users.map((user, index) => {
        return (
          <div className='card col-md-4' key={index}>
            <img
              src={`http://localhost:8080/user/photo/${user._id}`}
              alt={user.name}
              style={{ height: '200px', width: 'auto' }}
              className='img-thumbnail'
              // onError={i => (i.target.src = `${DefaultProfile}`)}
            />

            <div className='card-body'>
              <h5 className='card-title'>{user.name}</h5>
              <p className='card-text'>{user.email}</p>
              <Link
                to={`/user/${user._id}`}
                className='btn btn-raised btn-primary btn-small'
              >
                View Profile
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );

  render() {
    const { users } = this.state;
    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>User</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}

export default Users;
