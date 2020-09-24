import React, { useState, useEffect } from 'react'
// import { getCurrentEtherNetwork, getAllEtherNetworks } from './../../../config'
import './index.css'
import Dropdown from 'react-bootstrap/Dropdown'

export default function index () {
  const [EtherNetworks, setEtherNetworks] = useState([])
  const [CurrentEtherNetwork, setCurrentEtherNetwork] = useState(null)

  useEffect(() => {
    console.info('useEffect', browser.runtime)
    console.info(browser.runtime.lastError)

    browser.runtime.sendMessage({ command: 'GetCurrentEtherNetwork' })
      .then((message) => {
        console.info(arguments)
        setCurrentEtherNetwork(message)
      })
    browser.runtime.sendMessage(browser.runtime.id, { command: 'GetAllEtherNetworks' })
      .then((message) => {
        console.info(message)
        setEtherNetworks(message)
      })
  }, [])
  return (
    <div>
      <Dropdown onSelect={(eventKey) => {
        console.error(eventKey)
        browser.runtime.sendMessage({ command: 'SwitchNetwork', network: eventKey }, (message) => {
          setCurrentEtherNetwork(message)
        })
      }}>
        <Dropdown.Toggle id="dropdown-basic" className="network-indicator">
          {CurrentEtherNetwork && CurrentEtherNetwork.name}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {
            EtherNetworks && EtherNetworks.map((d) => {
              return <Dropdown.Item key={d.shortName} eventKey={d.shortName}>{d.name}</Dropdown.Item>
            })
          }
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
