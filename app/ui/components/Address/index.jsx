import React, { useState, useEffect } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
// import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'

function index () {
  const [EnsCoinTypes, setEnsCoinTypes] = useState([])

  useEffect(() => {
    browser.runtime.sendMessage({ command: 'GetAllEnsCoinTypes' })
      .then((message) => {
        setEnsCoinTypes(message)
      })
  }, [])
  return (
    <Card>
      <Card.Body>
        <Card.Title><a target='_blank' rel="noreferrer" href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2304.md">eip-2304</a></Card.Title>
        <Card.Text>
          <ListGroup>
            {
              EnsCoinTypes && EnsCoinTypes.map((d) => {
                return (
                  <ListGroup.Item key={d.shortName}>
                    <Row>
                      <Col>{d.name}</Col>
                      <Col style={{ marginLeft: 20 }}>{d.shortName}</Col>
                      <Col style={{ marginLeft: 20 }}>{d.value}</Col>
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
