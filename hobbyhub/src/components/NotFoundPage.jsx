import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="error_container">
      <h1>404 Not Found</h1>
      <Link to={'/'}>Return Home</Link>
    </div>
  );
}

export default NotFoundPage;