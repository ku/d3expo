import React from 'react';

import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View, Button } from 'react-native'
import Exponent from 'expo'

import _ from 'lodash'
import LineChart from './LineChart'

const {height, width} = Dimensions.get('window');

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
      offset: 0,
    }
  }


  render() {
    return (
      <View style={ {flex: 1, top: 20} }>
        <LineChart />
      </View>
    )
  }
}

