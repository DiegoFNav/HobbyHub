import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Form, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const supabase = useSupabaseClient();
  const [images, setImages] = useState([]);

  async function getImages() {
    const { data, error } = await supabase.storage.from('images').list("public/", {
      limit: 100,
      offset: 0
    });

    if(data !== null) {
      setImages(data);
    } else {
      alert("No images found!");
      console.log(error);
    }
  }



  async function uploadImage(event) {
    const file = event.target.files[0];
    console.log(file);
    const { data, error } = await supabase
      .storage
      .from('images')
      .upload('public/' + file.name + '_' + uuidv4().toString() + '.jpg', file);
    if (error) {
      console.log(error);
    } else {
      console.log("UPLOADED");
      getImages();
    }
  }

  // const [email, setEmail] = useState("");
  // const user = useUser();
  // const supabase = useSupabaseClient();

  // async function Login() {
  //   const { data, error } = await supabase.auth.signInWithOtp({
  //     email: email
  //   });
  //   if (error) {
  //     alert("Error sending OTP, please make sure to use a real email address.");
  //     console.log(error);
  //   } else {
  //     alert("OTP sent to your email address!");
  //   }
  // }

  // async function signOut() {
  //   const { error } = await supabase.auth.signOut();
  // }
  
  

  return (
    <> 
      <div>
        <h1>Welcome to the page!</h1>
        <Form.Group className="mb-3" style={{maxWidth: "500px"}}>
          <Form.Control type="file" accept="image/png, image/JPG, image/jpeg" onChange={(e) => uploadImage(e)} />
        </Form.Group>
      </div>
    </>
    // <Container align="center" className="container-sm mt-4">
    //   { user === null ?
    //     <>
    //       <h1>Welcome to the page!</h1>
    //       <Form>
    //         <Form.Group className="mb-3" style={{maxWidth: "500px"}}>
    //           <Form.Label>Email address</Form.Label>
    //           <Form.Control 
    //             type="email" 
    //             placeholder="Enter email" 
    //             onChange={(e) => setEmail(e.target.value)}
    //           />
    //         </Form.Group>
    //         <Button variant="primary" onClick={() => Login()}>
    //           Get Link
    //         </Button>
    //       </Form>
    //     </>
    //   :
    //     <>
    //       <h1>Welcome back, {user.email}!</h1>
    //       <Button onClick={() => signOut()}>Sign Out</Button>
    //     </>
    //   }
    // </Container>
    
  )
}

export default App
