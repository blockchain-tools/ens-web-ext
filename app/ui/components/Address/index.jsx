import React, { useState, useLayoutEffect } from 'react'
// import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Table from 'react-bootstrap/Table'
import EditableInput from '../EditableInput'

function index () {
  const [EnsCoinTypes, setEnsCoinTypes] = useState([])

  useLayoutEffect(() => {
    browser.runtime.sendMessage({ command: 'GetConfiguration', key: 'EnsCoinTypes' })
      .then((message) => {
        setEnsCoinTypes(message)
      })
  }, [])

  const update = (newObj) => {
    console.info(newObj)
    const newEnsCoinTypes = EnsCoinTypes.map((d) => {
      if (d.name === newObj.name) return newObj
      return d
    })
    browser.runtime.sendMessage({ command: 'SaveConfiguration', key: 'EnsCoinTypes', value: newEnsCoinTypes })
      .then((message) => {
        setEnsCoinTypes(message)
      })
  }
  return (
    <Card>
      <Card.Body>
        <Card.Text>
          <Table responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Value</th>
                <th>Explorer Url</th>
              </tr>
            </thead>
            <tbody>
              {
                EnsCoinTypes && EnsCoinTypes.map((d) => {
                  return (
                    <tr key={d.shortName}>
                      <td>{d.name}</td>
                      <td>{d.shortName}</td>
                      <td>{d.value}</td>
                      <td>
                        <EditableInput label={d.explorer} onBlur={(newText) => update({
                          ...d,
                          explorer: newText
                        })} />
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </Card.Text>
        <Card.Footer style={{ textAlign: 'right' }}><a target='_blank' rel="noreferrer" href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-2304.md">eip-2304</a></Card.Footer>
      </Card.Body>
    </Card>
  )
}

export default index
