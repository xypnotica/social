import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { Redirect, Link } from 'react-router-dom';
import avatar from '../images/avatar.jpg';

// components
import DeleteUser from './DeleteUser';
import FolowProfileButton from './FolowProfileButton';

// methods
import { read } from '../user/apiUser';

class Profile extends Component {
  constructor() {
    super();

    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false
    };
  }

  //check follow
  checkFollow = user => {
    const jwt = isAuthenticated();
    const match = user.followers.find(follower => {
      // one id has many other ids (folowers) and vise versa
      return follower._id === jwt.user._id;
    });
    return match;
  };

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token)
      .then(data => {
        if (data.error) {
          this.setState({ redirectToSignin: true });
        } else {
          let following = this.checkFollow(data);
          this.setState({
            user: data,
            following
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, user } = this.state;

    if (redirectToSignin) return <Redirect to='signin' />;

    const photoUrl = user._id
      ? `http://localhost:8080/user/photo/${user._id}?${new Date().getTime()}`
      : avatar;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Profile</h2>
        <div className='row'>
          <div className='col-md-6'>
            <img
              src={photoUrl}
              alt={user.name}
              style={{ height: '200px', width: 'auto' }}
              className='img-thumbnail'
            />
          </div>
          <div className='col-md-6'>
            <div className='lead mt-2'>
              <p>Hello {user.name}</p>
              <p>Email: {user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>
            {isAuthenticated().user &&
            isAuthenticated().user._id === user._id ? (
              <div className='d-inline-block'>
                <Link
                  className='btn btn-raised btn-success mr-5'
                  to={`/user/edit/${isAuthenticated().user._id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <FolowProfileButton following={this.state.following} />
            )}
          </div>
        </div>

        <div className='row'>
          <div className='col md-12 mt-5 mb-5'>
            <hr />
            <p className='lead'>{user.about}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
