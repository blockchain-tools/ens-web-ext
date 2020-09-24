import React from 'react'
import './App.css'
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/Home'
import NotFoundPage from './pages/NotFound'
import Container from 'react-bootstrap/Container'

export default function App () {
  return (
    <Router>
      <Container>
        <Header />
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route exact path="/404" component={NotFoundPage} />
          <Redirect from="*" to="/404" />
        </Switch>
      </Container>
    </Router>
  )
}
