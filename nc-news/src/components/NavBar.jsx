import { Link } from '@reach/router';
import React, { Component } from 'react';
import * as api from '../api';

class NavBar extends Component {
  state = {
    topics: [],
    isLoading: true
  };

  componentDidMount() {
    api.fetchTopics().then(({ data: { topics } }) => {
      this.setState({ topics: topics, isLoading: false });
    });
  }

  render() {
    const { topics, isLoading } = this.state;
    return (
      <nav className="navbar">
        <button>
          <Link to={`/`}>Home</Link>
        </button>
        <button>
          <Link to={`/`}>Publish Article</Link>
        </button>{' '}
        {topics.map((topic) => {
          return (
            <button>
              <Link to={`/${topic.slug}/articles`}>{topic.slug}</Link>
            </button>
          );
        })}{' '}
      </nav>
    );
  }
}

export default NavBar;