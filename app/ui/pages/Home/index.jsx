import React from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Container from 'react-bootstrap/Container'
import Text from '../../components/Text'
import Address from '../../components/Address'
import ContentHash from '../../components/ContentHash'

function index () {
  return (
    <Container className='main' fluid={true}>
      <Tabs defaultActiveKey="text" id="uncontrolled-tab-example">
        <Tab eventKey="text" title="Text">
          <Text />
        </Tab>
        <Tab eventKey="contentHash" title="ContentHash">
          <ContentHash />
        </Tab>
        <Tab eventKey="address" title="Address">
          <Address />
        </Tab>
      </Tabs>
    </Container>
  )
}

export default index
