import React, { useState, useLayoutEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import EditableInput from '../EditableInput'

function index () {
  const [EnsContentHashes, setEnsContentHashes] = useState([])

  useLayoutEffect(() => {
    browser.runtime.sendMessage({ command: 'GetConfiguration', key: 'EnsContentHashes' })
      .then((message) => {
        setEnsContentHashes(message)
      })
  }, [])

  const update = (newObj) => {
    console.info(newObj)
    const newEnsContentHashes = EnsContentHashes.map((d) => {
      if (d.name === newObj.name) return newObj
      return d
    })
    browser.runtime.sendMessage({ command: 'SaveConfiguration', key: 'EnsContentHashes', value: newEnsContentHashes })
      .then((message) => {
        setEnsContentHashes(message)
      })
    // console.info(newEnsContentHashes)
  }
  return (
    <Card>
      <Card.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>Protocal</th>
              <th>Gateway</th>
            </tr>
          </thead>
          <tbody>
            {
              EnsContentHashes && EnsContentHashes.map((d) => {
                return (
                  <tr key={d.name}>
                    <td>{d.name}</td>
                    <td>
                      <EditableInput key={d.name} label={d.gateway} onBlur={(newText) => update({
                        ...d,
                        gateway: newText
                      })} />
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer style={{ textAlign: 'right' }}><a target='_blank' rel="noreferrer" href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1577.md">eip-1577</a></Card.Footer>
    </Card>
  )
}

export default index
