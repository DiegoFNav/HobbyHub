import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { useSupabaseClient } from '@supabase/auth-helpers-react';

function Home() {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from('posts').select('*');
      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/post/${id}`);
  };

  const handleSortByNewest = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error sorting posts by newest:', error.message);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error sorting posts by newest:', error.message);
    }
  };

  const handleSortByMostPopular = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('upvotes', { ascending: false });

      if (error) {
        console.error('Error sorting posts by most popular:', error.message);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error sorting posts by most popular:', error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home_container">
      <div className="sorting_buttons">
        <h3>Order By</h3>
        <Button variant="primary" onClick={handleSortByNewest}>Newest</Button>
        <Button variant="primary" onClick={handleSortByMostPopular}>Most Popular</Button>
      </div>
      <Form className="search_bar">
        <Form.Group controlId="searchQuery">
          <Form.Control
            type="text"
            placeholder="Search posts by title"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Form.Group>
      </Form>
      {filteredPosts.map(post => (
        <div
          key={post.id}
          className="home_card"
          onClick={() => handleCardClick(post.id)}
        >
          <h6>Posted on {new Date(post.created_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}</h6>
          <h2 className="card_title">{post.title}</h2>
          <h6>{post.upvotes} upvotes</h6>
        </div>
      ))}
    </div>
  );
}

export default Home;
