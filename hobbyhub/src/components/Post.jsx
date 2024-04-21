import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSupabaseClient } from '@supabase/auth-helpers-react';

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
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
      } else { 
        setPost(data);
        setUpvotes(data.upvotes);
      }
    } catch (error) {
      console.error("Error fetching post:", error.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [post]);

  const handleUpvote = async () => {
    try {
      console.log(upvotes);
      const { data, error } = await supabase
        .from("posts")
        .update({ upvotes: upvotes + 1 })
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error upvoting post:", error.message);
    }
  };

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
          <h5 className="card_title">{post.title}</h5>
          <p>{post.content}</p>
          <div className="card-img-container">
            <img
              src={post.image_url}
              className="card-image"
            />
          </div>
          <div className="card-content">
            <div className="card-row">
              <div className="left test">
                <button className="card_button" onClick={handleUpvote}><img src="/like.jpg" alt="" /></button>
                <p>{upvotes} Upvotes</p>
              </div>
              <div className="right">
                <button className="card_button"><img src="/edit.png" alt="" /></button>
                <button className="card_button"><img src="/delete.png" alt="" /></button>
              </div>
            </div>
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