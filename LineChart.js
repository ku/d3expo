
import React from 'react';

import Exponent from 'expo'
const d3 = require( 'd3' )

// to avoid an error caused by query-selector which is used inside of ReactFauxDOM
global.navigator.userAgent = ''

const ReactFauxDOM = require('react-faux-dom')
const d3scale = require('d3-scale')
//const d3line  = require( 'd3-line')
const d3selection = require( 'd3-selection')
const d3axis = require( 'd3-axis')

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

const xAxisHeight = 25
const yAxisWidth = 25
const yAxisMargin = 15
const statusBarHeight = 20
const margin = {top: 0, right: 0, bottom: 0, left: 0}
const chartMarginTop = 10

import { Dimensions, View } from 'react-native'

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

export default class LineChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.fontSize = 12
  }

  createFauxElement(name) {
    console.log('creating fauxdom', name)
    return new ReactFauxDOM.Element(name)
  }

  componentWillMount() {
    console.log('componentWillMount')
    const root = this.root = global.document = new ReactFauxDOM.Element('g')
    const xAxis = this.createFauxElement('g')
    const yAxis = this.createFauxElement('g')
    const chart = this.createFauxElement('g')
    xAxis.setAttribute('class', 'x-axis')
    yAxis.setAttribute('class', 'y-axis')
    chart.setAttribute('class', 'chart')
    root.appendChild(xAxis)
    root.appendChild(yAxis)
    root.appendChild(chart)
  }

  updateXAxis(x, y) {
    var xAxis = d3axis.axisTop(x)
      .ticks(4)
      .tickFormat(function(d) {
        return d.toJSON().split('T').shift().split('-').slice(1).map( s => s.replace(/0/, '')).join('/')
      });

    const g = d3selection.select('g.x-axis')
      .attr("transform", {translateY: this.state.height - xAxisHeight} )
      .call( (g) => {
        g.call(xAxis);
        g.select("path").remove();
        g.selectAll(".tick line").remove();//("y", -20)
        g.selectAll(".tick text")
          .attr("dx", -8)
          .attr("dy", 10)
          .attr('fontSize', this.fontSize);
      })
  }

  updateYAxis(x, y) {
    d3selection.select('g.y-axis').call( (g) => {
      g.call(
        d3axis.axisRight(y).tickSize(this.state.width - yAxisWidth).ticks(5)
      );

      g.select(".domain").remove();

      g.selectAll(".tick line").attr("stroke", "#ccc").call( (line) => {
        line.attr('x2', line.attr('x2') + yAxisWidth)
        line.attr("stroke-dasharray", "2,2")
      })
      g.selectAll(".tick text")
        .attr("x", 4)
        .attr("transform", {
          translateY: -1.2 * this.fontSize
        })
        .attr('fontSize', this.fontSize);
    })
  }

  updateD3Chart() {
    var x = d3scale.scaleTime()
      .domain([new Date(2007, 3, 21), new Date(2007, 4, 3)])
      .range([yAxisWidth + yAxisMargin, this.state.width - yAxisMargin]);
    var y = d3scale.scaleLinear()
      .domain([1, 0])
      .range([ chartMarginTop, this.state.height - margin.top - xAxisHeight]);

    this.updateYAxis(x, y)
    this.updateXAxis(x, y)
    this.renderPath(x, y)
  }

  renderPath(x, y) {
    const line = d3.line()
          .x(function(d) { return Math.floor( x(d.date) ); })
          .y(function(d) { return Math.floor( y(d.value) ); });

    const g = d3selection.select('g.chart')
    g.selectAll('path').data([0])
      .enter().append("path")
        .attr("d", line(mydata))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");
  }

  onLayout = event => {
    let {width, height} = event.nativeEvent.layout
    this.setState({width, height})
  }

  render() {
    this.updateD3Chart()
    const svgElements = this.root.toReactNative(0, componentMapping)
    return (
      <View style={ {
        flex: 1,
          flexDirection: 'column'
      }}>
        <Exponent.Svg style={ {
          height: 200,
            backgroundColor: '#efe',
          margin:10,
          }}
        onLayout={ this.onLayout.bind(this) }

          >
        { svgElements }
        </Exponent.Svg>
      </View>
    )
  }
}
