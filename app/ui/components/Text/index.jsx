import React, { useState, useLayoutEffect } from 'react'
// import Container from 'react-bootstrap/Container'

import Card from 'react-bootstrap/Card'
import { WithContext as ReactTags } from 'react-tag-input'
import { EnsTextKeys as DefaultEnsTextKeys } from '../../../config/EnsTextKeys'
import './index.css'

const KeyCodes = {
  comma: 188,
  enter: 13
}
const delimiters = [KeyCodes.comma, KeyCodes.enter]

const suggestions = DefaultEnsTextKeys

function index () {
  const [tags, setTags] = useState([])

  useLayoutEffect(() => {
    browser.runtime.sendMessage({ command: 'GetConfiguration', key: 'EnsTextKeys' })
      .then((message) => {
        setTags(message)
      })
  }, [])
  const update = (newEnsTextKeys) => {
    console.info(newEnsTextKeys)
    browser.runtime.sendMessage({ command: 'SaveConfiguration', key: 'EnsTextKeys', value: newEnsTextKeys })
      .then((message) => {
        setTags(message)
      })
  }
  const handleDelete = (i) => {
    const newTags = tags.filter((tag, index) => index !== i)
    setTags(newTags)
    update(newTags)
  }

  const handleAddition = (tag) => {
    const newTags = [...tags, tag.id]
    setTags(newTags)
    update(newTags)
  }

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = [...tags].slice()
    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag.id)

    // re-render
    setTags(newTags)
    update(newTags)
  }

  const handleTagClick = (index) => {
    console.log('The tag at index ' + index + ' was clicked')
  }
  console.info(tags, suggestions)
  return (
    <Card>
      <Card.Body>
        <Card.Text style={{ width: '100%' }}>
          <div className="text-dark">
            This extension would search all text-records with below keys (default keys are <span className="text-muted">{DefaultEnsTextKeys.join(', ')}</span>).
          </div>
          <br/>
          <ReactTags
            tags={tags.map((key) => {
              return {
                id: key,
                text: key
              }
            })}
            suggestions={suggestions.map((key) => {
              return {
                id: key,
                text: key
              }
            })}
            delimiters={delimiters}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            handleTagClick={handleTagClick}
            autofocus={true}
          />
        </Card.Text>
        <Card.Footer style={{ textAlign: 'right' }}><a target='_blank' rel="noreferrer" href="https://github.com/ethereum/EIPs/blob/master/EIPS/eip-634.md">eip-634</a></Card.Footer>

      </Card.Body>
    </Card>
  )
}

export default index
