import React, { useEffect, useState } from 'react'
import {
  View, Text, StyleSheet, TextInput, Button
} from 'react-native'

import { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './src/graphql/mutations'
import { listTodos } from './src/graphql/queries'


import { StatusBar } from 'expo-status-bar';
//import React, {useState} from 'react';
//import { StyleSheet, Text, TextInput, View } from 'react-native';
import Amplify from 'aws-amplify';
import { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
//import { AmplifySignOut, withAuthenticator } from 'aws-amplify-react-native'
import { withAuthenticator } from 'aws-amplify-react-native'
//import { AmplifySignOut } from 'aws-amplify-react-native'
Amplify.configure(awsconfig)
const initialState = { name: '', description: '' }

const App1 = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={val => setInput('name', val)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <TextInput
        onChangeText={val => setInput('description', val)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <Button title="Create Todo" onPress={addTodo} />
      {
        todos.map((todo, index) => (
          <View key={todo.id ? todo.id : index} style={styles.todo}>
            <Text style={styles.todoName}>{todo.name}</Text>
            <Text>{todo.description}</Text>
          </View>
        ))
      }
    </View>
  )
}

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', padding: 20 },
//   todo: {  marginBottom: 15 },
//   input: { height: 50, backgroundColor: '#ddd', marginBottom: 10, padding: 8 },
//   todoName: { fontSize: 18 }
// })







// function App() {
//   const [text, setText] = useState('');
//   const [text1, setText1] = useState('')
//   return (
//     <View style={styles.container}>
//       <div>heh</div>
//       <Text>Calories</Text>
//       <StatusBar style="auto" />
//       <TextInput
//         style={{height: 40}}
//         placeholder="Enter daily calories"
//         //onChangeText={text => setText(text)}
//         defaultValue={text}
//       />
//        <Text style={{padding: 10, fontSize: 42}}>
//         {text.split(' ').map((word) => word ).join(' ')}
//       </Text>
//       <Text>Protein</Text>
//       <TextInput
//         style={{height: 40}}
//         placeholder="Enter protein in grams"
//         defaultValue={text1}
//       />
//        <Text style={{padding: 10, fontSize: 42}}>
//         {text1.split(' ').map((word) => word ).join(' ')}
//       </Text>
//       <Text>Carbohydrates</Text>
//       <TextInput
//         style={{height: 40}}
//         placeholder="Enter carbohydrates in grams"
//         //onChangeText={text => setText(text)}
//         defaultValue={text}
//       />
//        <Text style={{padding: 10, fontSize: 42}}></Text>
//        <Text>Fats</Text>
//       <TextInput
//         style={{height: 40}}
//         placeholder="Enter fats in grams"
//         //onChangeText={text => setText(text)}
//         defaultValue={text}
//         />
//         <div className="App">
//           <header className="App-header">
//             <h2>App content</h2>
//           </header>
//         </div>
//         <TextInput
//         onChangeText={val => setInput('name', val)}
//         style={styles.input}
//         value={formState.name}
//         placeholder="Name"
//       />
//       <TextInput
//         onChangeText={val => setInput('description', val)}
//         style={styles.input}
//         value={formState.description}
//         placeholder="Description"
//       />
//       <Button title="Create Todo" onPress={addTodo} />
//       {
//         todos.map((todo, index) => (
//           <View key={todo.id ? todo.id : index} style={styles.todo}>
//             <Text style={styles.todoName}>{todo.name}</Text>
//             <Text>{todo.description}</Text>
//           </View>
//         ))
//       }
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',},
    //container: { flex: 1, justifyContent: 'center', padding: 20 },
  todo: {  marginBottom: 15 },
  input: { height: 50, backgroundColor: '#ddd', marginBottom: 10, padding: 8 },
  todoName: { fontSize: 18 }
  }
);

export default withAuthenticator(App1, true);