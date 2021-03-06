import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import avatar from '../images/avatar.jpg';

// methods
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';

class EditProfile extends Component {
  constructor() {
    super();

    this.state = {
      id: '',
      name: '',
      email: '',
      password: '',
      redirectToProfile: false,
      error: '',
      loading: false,
      fileSize: 0,
      about: ''
    };
  }

  init = userId => {
    const token = isAuthenticated().token;
    read(userId, token)
      .then(data => {
        if (data.error) {
          this.setState({ redirectToProfile: true });
        } else {
          this.setState({
            id: data._id,
            name: data.name,
            email: data.email,
            error: '',
            about: data.about
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;

    if (fileSize > 100000) {
      this.setState({
        error: 'File size should be less then 100kb'
      });
      return false;
    }

    if (name.length === 0) {
      this.setState({
        error: 'Name is required'
      });
      return false;
    }

    if (!/^\w+([.-]?\w+)*@\w([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({
        error: 'A valid email is required'
      });
      return false;
    }

    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: 'Password must be at least 6 characters long'
      });
      return false;
    }
    return true;
  };

  // handle input change
  handleChange = name => e => {
    this.setState({
      error: '',
      loading: false
    });

    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    const fileSize = name === 'photo' ? e.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({
      [name]: value,
      fileSize
    });
  };

  // submit
  clickSubmit = e => {
    e.preventDefault();

    this.setState({
      loading: true
    });

    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;

      update(userId, token, this.userData).then(data => {
        if (data.error) {
          this.setState({
            error: data.error
          });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true
            });
          });
        }
      });
    }
  };

  signupForm = (name, email, password, about) => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Profile Photo</label>
        <input
          className='form-control'
          type='file'
          accept='image/*'
          onChange={this.handleChange('photo')}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input
          className='form-control'
          type='text'
          onChange={this.handleChange('name')}
          value={name}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input
          className='form-control'
          type='text'
          onChange={this.handleChange('email')}
          value={email}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>About</label>
        <textarea
          className='form-control'
          type='text'
          onChange={this.handleChange('about')}
          value={about}
        />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input
          className='form-control'
          type='password'
          onChange={this.handleChange('password')}
          value={password}
        />
      </div>
      <button className='btn btn-raised btn-primary' onClick={this.clickSubmit}>
        Update
      </button>
    </form>
  );

  render() {
    const {
      id,
      name,
      email,
      password,
      redirectToProfile,
      error,
      loading,
      about
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${id}`} />;
    }

    const photoUrl = id
      ? `http://localhost:8080/user/photo/${id}?${new Date().getTime()}`
      : avatar;

    return (
      <div className='container'>
        <h2 className='mt-5 mb-5'>Edit profile</h2>
        <div
          className='alert alert-danger'
          style={{ display: error ? '' : 'none' }}
        >
          {error}
        </div>
        {loading ? (
          <div className='jumbotron text-center'>
            <h2>Loading...</h2>
          </div>
        ) : (
          ''
        )}
        <img
          src={photoUrl}
          alt={name}
          style={{ height: '200px', width: 'auto' }}
          className='img-thumbnail'
        />
        {this.signupForm(name, email, password, about)}
      </div>
    );
  }
}

export default EditProfile;
