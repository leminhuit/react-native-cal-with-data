import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, RecyclerViewBackedScrollViewComponent, FlatList } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rendered_item = 
(item) => {
  console.log("rendering ",item);
  return <View style={styles.itemView}>
    <Text style={styles.itemTextExpression}>{item.item.expression}</Text>
    <Text style={styles.itemTextResult}>{item.item.result}</Text>
  </View>;
};

const PizzaTranslator = () => {
  const input_expression = useRef("");

  const [result, set_result] = useState('');
  const [expression_text, set_expression_text] = useState('');
  const [history, set_history] = useState([]);
  const [search_result, set_search_result] = useState([]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('@storage_Key', jsonValue)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    let a = getData();
    console.log("Lay duoc Data roi");
    console.log(a);
  }, []);

  return (
    <View style={styles.mainView}>
      <View style={styles.calView}>
        
        <TextInput style={styles.expression}
          placeholder="Type here to translate!"
          onChangeText={newText =>   input_expression.current = newText     }
        />
        <Text style={{padding: 10, fontSize: 42}}>
          {
            result
          }
        </Text>
        <Button title="Calculate"
          onPress = {
            function calculate() {
            try{
              var b = eval(input_expression.current); 
              set_result(b);
              var a = [...history];
              a.push( {
                id: 'history-item' + a.length,
                expression: input_expression.current,
                result : b
              } );
              set_history(a);
              set_search_result(a);
              console.log("history hien tai la ", history);
              console.log("search_result hien tai la ", search_result);
              storeData(a);
              console.log("Doc duoc data roi");
            } catch (e){
              set_result("");
            }
          }}
        />
      </View>
      <View style={styles.historyView}>

        <TextInput style={styles.expression} 
        placeholder="Type to search"
        onChangeText= {search_string => {
          var a = history.filter( (value, inedex, arr) => {
            return value.expression.includes(search_string) || value.result.toString().includes(search_string);
          } );
          console.log(" Ket qua search la " , a);
          set_search_result(a);
        }}
      > 
        </TextInput>
      <FlatList
          data={search_result}
          renderItem = {rendered_item}
          keyExtractor = { (item) => item.id }
        />
      </View>
      
    </View>
  );
}

export default PizzaTranslator;

const styles = StyleSheet.create({
  itemView: {
    backgroundColor: 'black',
    padding : 2,
    marginTop: 0.5
  },
  itemTextExpression: {
    fontSize: 15,
    color: 'red'
  },
  itemTextResult : {
    fontSize: 20,
    color: 'yellow'
  },
  mainView: {
    paddingLeft: 5,
    display: 'flex',
    flexDirection: 'row',
    borderStyle: 'solid',
    borderColor: 'red',
    borderWidth: 3,
    flexFlow: 'wrap'
  },
  calView: {
    flexGrow: 1,
    minWidth: 300,
    marginRight: 15
  },
  expression: {
    borderStyle: 'dashed',
    borderColor: 'green',
    borderWidth: 2
  },
  calculateButton: {

  },
  historyView: {
    marginRight: 15,
    flexGrow: 1,
    minWidth: 300
  }
})


// import * as React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { Button, Text } from 'react-native'
// const Stack = createNativeStackNavigator();

// const HomeScreen = ({ navigation }) => {
//   return (
//     <Button
//       title="Go to Jane's profile"
//       onPress={() =>
//         navigation.navigate('Profile', { name: 'Jane' })
//       }
//     />
//   );
// };

// const ProfileScreen = ({ navigation, route }) => {
//   return <Text>This is {route.params.name}'s profile</Text>;
// };

// const MyStack = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{ title: 'Welcome' }}
//         />
//         <Stack.Screen name="Profile" component={ProfileScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default MyStack;