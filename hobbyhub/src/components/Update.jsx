import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Update() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [content, setContent] = useState('');
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const supabaseUrl = 'https://ugxbfizuqepumyjumbsg.supabase.co/storage/v1/object/public/';


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
        setTitle(data.title);
        setImageURL(data.image_url);
        setContent(data.content);
      }
    } catch (error) {
      console.error("Error fetching post:", error.message);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  async function handleUpdatePost (event) {
    event.preventDefault();
      let updatedImageURL = imageURL;
      if (image) {
        const file = image[0];
        const { data, error } = await supabase.storage
          .from('images')
          .upload(`public/${file.name}_${uuidv4()}.jpg`, file);
        if (error) {
          console.error('Error uploading image:', error.message);
        } else {
          updatedImageURL = supabaseUrl + data.fullPath;
        }
      }
      const { data, error } = await supabase.from('posts')
      .update([{
          title: title,
          image_url: updatedImageURL,
          content: content,
        },
      ]).eq('id', id);

      if (error) {
        console.error('Error updating post:', error.message);
      } else { 
        navigate(`/post/${id}`);
      }
  };

  return (
    <Container align="center" className="container-sm mt-4">
        <h1>Update Post</h1>
        <Form onSubmit={handleUpdatePost}>
          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
            <Form.Control type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
            <Form.Control type="file" accept="image/png, image/jpeg" onChange={(e) => setImage(e.target.files)} />
          </Form.Group>
          <Form.Group className="mb-3" style={{ maxWidth: "500px" }}>
            <Form.Control as="textarea" rows={3} placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Container>
  );
}

export default Update;
