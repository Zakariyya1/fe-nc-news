import '../styles/ArticleDisplay.css';
import React, { Component } from 'react';
import * as api from '../api';
import { Link } from '@reach/router';
import { formatDate } from '../utils/utils';
import CommentsList from './CommentsList';
import ErrorPage from './ErrorPage';

class ArticleDisplay extends Component {
  state = {
    isLoading: true,
    article: {},
    comments: [],
    errorMessage: ''
  };

  componentDidMount = () => {
    const { article_id } = this.props;
    api
      .getArticleById(article_id)
      .then((article) => {
        this.setState({ article, isLoading: false });
      })
      .catch(
        ({
          response: {
            data: { msg }
          }
        }) => {
          this.setState({ errorMessage: msg });
        }
      );

    this.fetchComments();
  };

  render() {
    const { isLoading, article, comments, errorMessage } = this.state;

    if (errorMessage) return <ErrorPage msg={errorMessage} />;

    return (
      <main className="articledisplay">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <article>
            <h2 className="articletitle">{article.title}</h2>
            <p className="author">
              by{' '}
              <Link
                to={`/users/${article.author}/articles`}
              >{`${article.author}`}</Link>{' '}
              on {`${formatDate(article.created_at)}`}
            </p>
            <p className="articlebody">{article.body}</p>
            <button className="vote-button-up" onClick={this.upVote}>
              👍
            </button>
            <p className="votes">{article.votes}</p>
            <button className="vote-button-down" onClick={this.downVote}>
              {' '}
              👎{' '}
            </button>
            <br />
            <CommentsList
              comments={comments}
              article_id={article.article_id}
              updateComments={this.updateComments}
              removeComment={this.removeComment}
            />
          </article>
        )}
      </main>
    );
  }

  fetchComments = () => {
    const { article_id } = this.props;

    api.getCommentsByArticleId(article_id).then((comments) => {
      this.setState({ comments });
    });
  };

  upVote = () => {
    if (this.state.article.votes < 1) this.changeVote(1);
  };

  downVote = () => {
    if (this.state.article.votes > 0) this.changeVote(-1);
  };

  changeVote = (vote) => {
    api
      .changeArticlesVotes(this.state.article.article_id, vote)
      .then((newArticle) => {
        this.setState(({ article }) => {
          return { article: { ...article, votes: (article.votes += vote) } };
        });
      });
  };

  updateComments = (comment) => {
    this.setState(({ comments, article }) => {
      return {
        comments: [comment, ...comments],
        article: {
          ...article,
          comment_count: article.comment_count + 1
        }
      };
    });
  };

  removeComment = (comment_id) => {
    this.setState(({ comments, article }) => {
      const newComments = comments.filter(
        (comment) => comment.comment_id !== comment_id
      );
      return {
        comments: newComments,
        article: {
          ...article,
          comment_count: article.comment_count - 1
        }
      };
    });
  };
}

export default ArticleDisplay;
