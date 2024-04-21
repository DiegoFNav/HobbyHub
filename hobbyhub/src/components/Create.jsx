import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';


function Create() {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [content, setContent] = useState('');

  const supabaseUrl = 'https://ugxbfizuqepumyjumbsg.supabase.co/storage/v1/object/public/';

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title) {
      alert('Please provide a title for the post.');
      return;
    }

    let imageUrl = null;
    if (image) {
      const file = image[0];
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`public/${file.name}_${uuidv4()}.jpg`, file);
      if (error) {
        console.error('Error uploading image:', error.message);
      } else {
        imageUrl = supabaseUrl + data.fullPath;
      }
    }
    const { data, error } = await supabase.from('posts').insert([
      {
        title: title,
        image_url: imageUrl,
        content: content,
      },
    ]);
    if (error) {
      console.error('Error inserting post:', error.message);
    } else {
      setTitle('');
      setImage(null);
      setContent('');
      navigate('/');
    }
  }

  return (
    <> 
      <Container align="center" className="container-sm mt-4">
        <h1>Create Post</h1>
        <Form onSubmit={handleSubmit}>
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
            Submit
          </Button>
        </Form>
      </Container>
    </>
  )
}

export default Create
