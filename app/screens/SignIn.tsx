import { View, Text, Button } from 'react-native'
import React from 'react'
import Main from './Main'
import HCalendar from './HCalendar'
import History from './History'
import Records from './Records'

const SignIn = ({ navigation }: any) => {
  return (
    <View>
      <Text>SignIn</Text>
      <Button onPress={() => navigation.navigate(Main)} title="Open Main" />
      <Button onPress={() => navigation.navigate(HCalendar)} title="HCalendar" />
      <Button onPress={() => navigation.navigate(History)} title="History" />
      <Button onPress={() => navigation.navigate(Records)} title="Records" />

      
    </View>
  )
}

export default SignIn