import React from 'react';
import {
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  StyleSheet,
} from 'react-native';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.id = 0;
    this.allData = [];
    this.state = {
      todoData: [],
      inputValue: '',
    };
  }

  componentDidMount() {
    this.getAllData();
  }

  getAllData = async () => {
    const {todoData} = this.state;
    const data = await JSON.parse(await AsyncStorage.getItem('database'));

    this.setState({
      todoData: data,
    });
    if (todoData.length === 0) {
      this.allData = data;
      this.id = this.allData[this.allData.length - 1].id + 1;
    }
  };

  addData = async () => {
    const data = {
      id: this.id,
      name: this.state.inputValue,
    };
    this.allData.push(data);
    this.id++;

    await AsyncStorage.setItem('database', JSON.stringify(this.allData));
    this.setState({
      todoData: JSON.parse(await AsyncStorage.getItem('database')),
      inputValue: '',
    });
  };

  removeData = async (value) => {
    const {todoData} = this.state;

    const indexOfValue = todoData.findIndex((data) => data.id === value.id);
    todoData.splice(indexOfValue, 1);

    this.setState({todoData});
    await AsyncStorage.setItem('database', JSON.stringify(todoData));
  };

  reset = async () => {
    await AsyncStorage.setItem('database', JSON.stringify([]));
    this.id = 0;
    this.allData = [];
    this.setState({todoData: []});

    this.getAllData();
  };

  renderItem = () => {
    const {todoData} = this.state;

    if (!todoData) {
      return (
        <View style={styled.card}>
          <View style={styled.nameWrapper}>
            <Text>No Data</Text>
          </View>
        </View>
      );
    }

    return (
      <ScrollView>
        {todoData.map((value) => (
          <View key={value.id} style={styled.card}>
            <View style={styled.nameWrapper}>
              <Text>{value.id}</Text>
              <View style={styled.divider} />
              <Text>{value.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.removeData(value)}
              activeOpacity={0.7}
              style={styled.removeWrapper}>
              <Text style={styled.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  };

  render() {
    const {inputValue} = this.state;
    console.disableYellowBox = true;

    return (
      <View style={styled.container}>
        <View style={styled.topWrapper}>
          <Text style={styled.Title}>Please Input Here</Text>
          <TextInput
            placeholder="Please Input your name"
            autoCorrect={false}
            onChangeText={(val) => this.setState({inputValue: val})}
            style={styled.textInput}
            value={inputValue}
          />
          <TouchableOpacity
            onPress={this.addData}
            activeOpacity={0.5}
            style={styled.addButton}>
            <Text style={styled.textButton}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.reset}
            activeOpacity={0.5}
            style={styled.addButton}>
            <Text style={styled.textButton}>Reset</Text>
          </TouchableOpacity>
        </View>
        <View style={styled.bottomWrapper}>
          <View style={styled.listFontWrapper}>
            <Text style={styled.listFont}>List all data</Text>
          </View>
          {this.renderItem()}
        </View>
      </View>
    );
  }
}

export default App;

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
  topWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textInput: {
    height: 50,
    width: 300,
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  addButton: {
    width: 200,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
    marginBottom: 10,
  },
  textButton: {
    fontSize: 20,
    color: 'white',
  },
  bottomWrapper: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
  },
  listFontWrapper: {
    paddingVertical: 10,
  },
  listFont: {
    fontSize: 20,
    color: 'white',
  },
  card: {
    marginBottom: 10,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    width: Dimensions.get('window').width - 25,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderRadius: 7,
  },
  divider: {
    marginHorizontal: 5,
  },
  nameWrapper: {
    flexDirection: 'row',
  },
  removeWrapper: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 20,
  },
  removeText: {
    color: 'white',
  },
});
