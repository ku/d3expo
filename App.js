import React from 'react';

import Exponent from 'expo'
const d3 = require( 'd3' )

// to avoid an error caused by query-selector which is used inside of ReactFauxDOM
global.navigator.userAgent = ''

const ReactFauxDOM = require('./react-faux-dom/lib/ReactFauxDOM.js')
const d3scale = require('d3-scale')
//const d3line  = require( 'd3-line')
const d3selection = require( 'd3-selection')
const d3axis = require( 'd3-axis')

import _ from 'lodash'

let componentMapping = {
  svg: Exponent.Svg,
}

for (let k in Exponent.Svg) {
  const m = k.match(/^[A-Z]/)
  if (m) {
    const lowerCased = m[0].toLowerCase() + k.substring(1)
    componentMapping[lowerCased] = Exponent.Svg[k]
  }
}

const margin = {top: 20, right: 0, bottom: 0, left: 0}

import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native'

const {height, width} = Dimensions.get('window');

const mydata = [
        {date: new Date(2007, 3, 21), value: 0 },
        {date: new Date(2007, 3, 22), value: Math.random() },
        {date: new Date(2007, 3, 23), value: Math.random() },
        {date: new Date(2007, 3, 24), value: Math.random() },
        {date: new Date(2007, 3, 25), value: Math.random() },
        {date: new Date(2007, 3, 26), value: Math.random() },
        {date: new Date(2007, 3, 27), value: Math.random() },
        {date: new Date(2007, 3, 30), value: Math.random() },
        {date: new Date(2007, 4,  1), value: Math.random() },
        {date: new Date(2007, 4,  2), value: Math.random() },
        {date: new Date(2007, 4,  3), value: 1 },
    ];

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      offset: 0,
    }
  }

  createFauxElement(name) {
    console.log('creating fauxdom', name)
    return new ReactFauxDOM.Element(name)
  }


  componentWillMount() {
    const root = this.root = global.document = new ReactFauxDOM.Element('g')
    root.appendChild( this.createFauxElement('g') )
  }

  updateD3Chart() {
    var x = d3scale.scaleTime()
      .domain([new Date(2007, 3, 21), new Date(2007, 4, 3)])
      .range([0, width]);

    var y = d3scale.scaleLinear()
      .domain([0, 1])
      .range([0, height - margin.top]);

    //this.renderPath(x, y)

    const svg = d3selection.select('g')

    const g = svg.append("g")

    var yAxis = d3axis.axisRight(y)
                    .tickSize(width)
    const customYAxis = function (g) {
       g.call(yAxis);
        g.select(".domain").remove();
        g.selectAll(".tick line").attr("stroke", "#777").attr("stroke-dasharray", "2,2");
        g.selectAll(".tick text").attr("x", 4).attr("dy", -4);
    }

    g.append("g")
      .call(customYAxis);

  }

  renderPath(x, y) {
    const line = d3.line()
          .x(function(d) { return Math.floor( x(d.date) ); })
          .y(function(d) { return Math.floor( y(d.value) ); });

    var chartLine = line(mydata)
    const path =  this.createFauxElement('path')
    path.setAttribute('d', chartLine  )
    path.setAttribute('stroke', "#080"   )
    path.setAttribute('fill', "transparent"   )

    const fillPath = chartLine.replace(/^M/, `M0,${height}L`) +  `L${width},${height}`
    const fill =  this.createFauxElement('path')
    fill.setAttribute('d', fillPath  )
    fill.setAttribute('stroke', "transparent"   )
    fill.setAttribute('fill', "#20c520"   )

    //const tickY = document.getElementById('y-tick')
    //const tickY = global.document.getElementById('y-tick')
    //const e = global.document.getElementById('chart')
    //e.insertBefore(path, tickY)
    //e.insertBefore(fill, tickY)
  }

  render() {
    this.updateD3Chart()

    const svgElements = this.root.toReactNative(0, componentMapping)

    return (
      <View style={ {flex: 1, top: margin.top} }>
        <Exponent.Svg width={width} height={height} style={ {
          backgroundColor: '#efe'
        }}>
          {svgElements}
        </Exponent.Svg>
      </View>
    )
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
