import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import ListGroup from 'react-bootstrap/ListGroup'
ReactDOM.render(
  <React.StrictMode>
    <ListGroup>
      <ListGroup.Item><a rel="noreferrer" target='_blank' href='https://app.ens.domains/'>ENS</a></ListGroup.Item>
      <ListGroup.Item><a rel="noreferrer" target='_blank' href='./index.html'>Custom Configuration</a></ListGroup.Item>
      <ListGroup.Item><a rel="noreferrer" target='_blank' href='https://github.com/'>Submit Issue</a></ListGroup.Item>
    </ListGroup>
  </React.StrictMode>,
  document.getElementById('root')
)
