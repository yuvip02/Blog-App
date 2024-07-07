import React from 'react';
import { Link } from 'react-router-dom';
import { formatISO9075 } from 'date-fns';

const Post = ({ _id,title, summary, cover, content, createdAt,author }) => {
  return (
    <div className="post">
      <Link to={`/post/${_id}`}>
      <div className="image">
        <img src={'http://localhost:4000/'+cover} alt="img" />
      </div>
      
      </Link>
      <div className="texts">
        <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
        
        </Link>
        <p className="info">
          <Link to={`/post/${_id}`} className="author">{author.username}</Link>
          <time dateTime={formatISO9075(new Date(createdAt))}>
            {formatISO9075(new Date(createdAt))}
          </time>
        </p>
        <p className="summary">
          {summary}
        </p>
      </div>
    </div>
  );
}

export default Post;
