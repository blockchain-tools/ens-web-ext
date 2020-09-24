import React, { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
// import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

function index () {
  const [EnsTextKeys, setEnsTextKeys] = useState([])

  useEffect(() => {
    browser.runtime.sendMessage({ command: 'GetAllEnsTextKeys' })
      .then((message) => {
        setEnsTextKeys(message)
      })
  }, [])
  return (
    <Card>
      <Card.Body>
        <Card.Title><a target='_blank' rel="noreferrer" href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-634.md">eip-634</a></Card.Title>
        <Card.Text>
          <ListGroup>
            {
              EnsTextKeys && EnsTextKeys.map((d) => {
                return (
                  <ListGroup.Item key={d}>
                    <Row>
                      <Col>{d}</Col>
                    </Row>
                  </ListGroup.Item>
                )
              })
            }
          </ListGroup>
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default index
