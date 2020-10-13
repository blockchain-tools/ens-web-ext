import React from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Container from 'react-bootstrap/Container'
import TextRecord from '../../components/TextRecord'
import CoinAddress from '../../components/CoinAddress'
import ContentHash from '../../components/ContentHash'

function index () {
  return (
    <Container className='main' fluid={true}>
      <Tabs defaultActiveKey="text" id="uncontrolled-tab-example">
        <Tab eventKey="text" title="Text Record">
          <TextRecord />
        </Tab>
        <Tab eventKey="contentHash" title="Content Hash">
          <ContentHash />
        </Tab>
        <Tab eventKey="address" title="Coin Address">
          <CoinAddress />
        </Tab>
      </Tabs>
    </Container>
  )
}

export default index
