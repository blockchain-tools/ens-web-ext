import React from 'react'
import Networks from '../Networks'
import './index.css'
import Navbar from 'react-bootstrap/Navbar'

function index () {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 9999 }}>
      <Navbar bg="light" variant="light" expand={false} style={{ paddingBottom: 0, paddingTop: 0 }}>
        <Navbar.Brand href="#" style={{ paddingBottom: 0, paddingTop: 0 }}>
          <img
            alt="logo"
            src="../../../images/bridge.png"
            className="d-inline-block align-top header-logo"
            height={45}
            width={45}
          />
          <span>***.eth  ----{'>'} https://</span>
        </Navbar.Brand>
        <Networks />
      </Navbar>
    </div>
  )
}

export default index
