import React from 'react'
import Networks from '../Networks'
import './index.css'

function index () {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 9999 }}>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="#">
          <img src="../../../images/ens.svg" className="d-inline-block align-top header-logo" alt="ens logo" />
        </a>
        <Networks />
      </nav>
    </div>
  )
}

export default index
