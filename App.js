import React from 'react';
import * as Exponent from 'expo';

import ReactFauxDOM from 'react-faux-dom'

//import d3 from 'd3';
import * as selection from 'd3-selection'

import { StyleSheet, Text, View, Button } from 'react-native';

function querySelector(selector, element) {
  if ( !(element instanceof Object) ) {
    return null
  }

  if (element.type.displayName === selector) {
    return addDomMethods(element)
  }

  if ( element.props.children instanceof Array ) {
    for ( let child of element.props.children ) {
      const match = querySelector(selector, child)
      if (match) {
        return match
      }
    }
    return null
  } else {
    return querySelector(selector, element.props.children)
  }
}

function querySelectorAll(selector, element) {
  let matched = []

  if (element instanceof Object) {
    if (element.type instanceof Object && element.type.displayName === selector) {
      matched.push( addDomMethods(element) )
    } else {
      if ( element.props.children instanceof Array ) {
        for ( let child of element.props.children ) {
          matched = matched.concat( querySelectorAll(selector, child) )
        }
        return matched
      } else {
        return matched.concat(querySelectorAll(selector, element.props.children))
      }
    }
  }

  return matched
}

let doc = null


const ElementMap = {
  Text,
}
global.document =  {
  querySelector: (selector) => {
    const e = querySelector(selector, doc)
    console.log(e)
    return e
  },
  querySelectorAll: (selector) => {
    return querySelectorAll(selector, doc)
  },
  createElementNS: (_, name) => {
    const attributes = {}
    return React.createElement(
      ElementMap[name],
      attributes,
    )
  }
}

function addDomMethods(reactElement) {
  return Object.assign({
    ownerDocument: global.document,
    querySelectorAll: function (selector) {
      return querySelectorAll(selector, reactElement)
    },
    insertBefore: function (element, before) {
      const dom = React.DOM
      if (reactElement.props.children instanceof Array) {
        this.props.children.push(element)
      } else {
        reactElement.props.children = [
          this.props.children,
          element
        ]
      }
    },
  }, reactElement)
}

export default class App extends React.Component {

  onPress() {
    this.forceUpdate()
  }

  componentWillMount() {
    doc = this.__d3tree = (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Button
        onPress={ _ => onPress() }
        />
      </View>
    );

    const theData = [1,2,3]
      var p = selection.select("View")
      .selectAll("Text")
      .data(theData)
      .enter().append("Text")
        .text(function(d) { return "I'm number " + d + "!"; });
  }

  render() {
    return this.__d3tree
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
