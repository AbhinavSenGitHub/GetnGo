import React from 'react'
import { Link } from 'react-router-dom'
const NotFoundpage = () => {
  return (
    <div className="main-notFound">
      <div class="error-container">
    <h1 className="statusCode">404</h1>
    <p className="StatusMessage">Oops! The page you are looking for could not be found.</p>
    <Link className="statusLink" to="/">Go Home</Link>
  </div>
    </div>
  )
}

export default NotFoundpage
