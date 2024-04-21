import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from "react-router-dom";

function Post() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

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
        setComments(data.comments);
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

  const handleAddComment = async () => {
    try {
      if (!newComment) {
        alert("Please provide a comment.");
        return;
      }
      console.log(newComment);
      const { data, error } = await supabase
        .from("posts")
        .update({ comments: [...comments, newComment ] })
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  const handleDeletePost = async () => {
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      navigate('/');
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  const handleEditPost = () => {
    navigate(`/update/${id}`);
  };

  return (
    <div className="home_container">
      {post && (
        <div className="card">
          <h6>Posted on {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}</h6>
          <h5 className="card_title">{post.title}</h5>
          <p>{post.content}</p>
          {post.image_url &&
            <div className="card-img-container">
              <img
                src={post.image_url}
                className="card-image"
              />
            </div>
          }
          <div className="card-content">
            <div className="card-row">
              <div className="left test">
                <button className="card_button" onClick={handleUpvote}><img src="/like.png" alt="" /></button>
                <p>{upvotes} Upvotes</p>
              </div>
              <div className="right">
                <button className="card_button" onClick={handleEditPost}><img src="/edit.png" alt="" /></button>
                <button className="card_button" onClick={handleDeletePost}><img src="/delete.png" alt="" /></button>
              </div>
            </div>
            <div>
              <input type="text" placeholder="Enter Comment here" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
              <button className="comment_button" onClick={handleAddComment}>Add Comment</button>
            </div>
            <h5>Comments:</h5>
            {comments.map((comment, index) => (
                <p key={index}>{comment}</p>
            ))}   
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;