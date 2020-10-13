import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import ReactDOM from 'react-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import createMetaMaskProvider from 'metamask-extension-provider'

const donationHandler = () => {
  const provider = createMetaMaskProvider()
  if (provider && provider.isMetaMask) {
    console.log('provider detected', provider)
    console.info('MetaMask provider detected.', provider.isConnected())
    provider.sendAsync({ method: 'eth_requestAccounts' }, (err, { result, error }) => {
      if (err || error) {
        browser.runtime.sendMessage({
          command: 'Notification',
          value: {
            title: 'eth_requestAccounts failed',
            message: `${JSON.stringify(err || error)}`,
            type: 'basic'
          }
        })
      } else {
        const from = result[0]
        const to = '0x27d60549785c2ebA0F9c38834b24185798Eb882F'
        const params = [{
          from,
          to,
          // "gas": "0x76c0", // 30400
          // "gasPrice": "0x9184e72a000", // 10000000000000
          value: '0x11c37937e08000' // 5000000000000000
        }]
        provider.sendAsync({
          method: 'eth_sendTransaction',
          params
        }, (err, data) => {
          if (err) {
            browser.runtime.sendMessage({
              command: 'Notification',
              value: {
                title: 'donation failed',
                message: `${JSON.stringify(err)}`,
                type: 'basic'
              }
            })
          } else {
            if (data.result) {
              browser.runtime.sendMessage({
                command: 'Notification',
                value: {
                  title: 'thanks for your donation',
                  message: `${JSON.stringify(data.result)}`,
                  type: 'basic'
                }
              })
            } else {
              browser.runtime.sendMessage({
                command: 'Notification',
                value: {
                  title: 'donation failed',
                  message: `${JSON.stringify(data)}`,
                  type: 'basic'
                }
              })
            }
          }
        })
      }
    })
    provider.on('error', (error) => {
      if (error) {
        console.info('MetaMask extension error.')
        browser.runtime.sendMessage({
          command: 'Notification',
          value: {
            title: 'donation failed',
            message: `${JSON.stringify(error)}`,
            type: 'basic'
          }
        })
      }
    })
  } else {
    console.info('MetaMask provider not detected.')
    browser.runtime.sendMessage({
      command: 'Notification',
      value: {
        title: 'donation failed',
        message: 'MetaMask provider not detected, please install metamask to send donation',
        type: 'basic'
      }
    })
  }
  return false
}

ReactDOM.render(
  <ListGroup className='list-group'>
    <ListGroup.Item>
      <a rel="noreferrer" target='_blank' href='./index.html'>
        <img src='./images/settings.png' />Configuration
      </a>
    </ListGroup.Item>
    <ListGroup.Item>
      <a rel="noreferrer" target='_blank' href='https://github.com/blockchain-tools/ens-web-ext/issues'>
        <img src='./images/github.png' />Feed back
      </a>
    </ListGroup.Item>
    <ListGroup.Item>
      <a rel="noreferrer" target='_blank' href='https://app.ens.domains/'>
        <img src='./images/ens.png' width='20' height='20' />About ENS
      </a>
    </ListGroup.Item>
    <ListGroup.Item>
      <a onClick={donationHandler}>
        <img src='./images/donation.png' width='20' height='20' />Donation
      </a>
    </ListGroup.Item>
  </ListGroup>,
  document.getElementById('root')
)
