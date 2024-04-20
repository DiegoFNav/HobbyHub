import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSupabaseClient } from '@supabase/auth-helpers-react';

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const supabase = useSupabaseClient();

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  return (
    <div className="home_container">
      <h1>Post</h1>
      {post && (
        <div className="card">
          <h6>Posted on {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}</h6>
          <h5>{post.title}</h5>
          <div className="card-img-container">
            <img
              src={post.image_url}
              className="card-image"
            />
          </div>
          <div className="card-content">
            <h2>{post.content}</h2>
            <button>Upvote</button>
            <h5>Comments:</h5>
              {post.comments.map(comment => (
                <p key={comment.id}>{comment.text}</p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;