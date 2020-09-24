import React, { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
// import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

function index () {
  const [EnsContentHashes, setEnsContentHashes] = useState([])

  useEffect(() => {
    browser.runtime.sendMessage({ command: 'GetAllEnsContentHashes' })
      .then((message) => {
        setEnsContentHashes(message)
      })
  }, [])
  return (
    <Card>
      <Card.Body>
        <Card.Title><a target='_blank' rel="noreferrer" href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1577.md">eip-1577</a></Card.Title>
        <Card.Text>
          <ListGroup>
            {
              EnsContentHashes && EnsContentHashes.map((d) => {
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
