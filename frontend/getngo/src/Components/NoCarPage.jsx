import React from 'react'
import { Link } from 'react-router-dom'
const NoCarPage = () => {
  return (
    <div className="main-searchPage">
      <div class="searchError-container">
    <p className="StatusMessage">No Vehicle available in this city 🫤</p>
    {/* <Link className="statusLink" to="/">Go Home</Link> */}
  </div>
    </div>
  )
}

export default NoCarPage
