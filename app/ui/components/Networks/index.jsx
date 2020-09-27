import React, { useState, useLayoutEffect } from 'react'
// import { getCurrentEtherNetwork, getAllEtherNetworks } from './../../../config'
import './index.css'
import Dropdown from 'react-bootstrap/Dropdown'

export default function index () {
  const [EtherNetworks, setEtherNetworks] = useState([])
  const [CurrentEtherNetwork, setCurrentEtherNetwork] = useState(null)

  useLayoutEffect(() => {
    browser.runtime.sendMessage({ command: 'GetConfiguration', key: 'EtherNetworks' })
      .then((message) => {
        setEtherNetworks(message)
      })
    browser.runtime.sendMessage({ command: 'GetConfiguration', key: 'CurrentEtherNetwork' })
      .then((message) => {
        console.info(message)
        setCurrentEtherNetwork(message)
      })
  }, [])
  return (
    <div>
      <Dropdown onSelect={(eventKey) => {
        const newNetwork = EtherNetworks.find((d) => d.shortName === eventKey)
        browser.runtime.sendMessage({ command: 'SaveConfiguration', key: 'CurrentEtherNetwork', value: newNetwork })
          .then((message) => {
            console.info(message)
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
