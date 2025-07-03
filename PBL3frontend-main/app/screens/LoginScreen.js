import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Login } from '../services/api'

// const usersDB = [
//   { username: 'anjal', password: '1234' },
//   { username: 'faiq', password: '1234' },
//   { username: 'brandon', password: '1234' },
//   { username: 'choi', password: '1234' },
//   { username: 'nao', password: '1234' },
//   { username: 'yarik', password: '1234' },
//   { username: 'niko', password: '1234' },
// ];

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //=========================
  const handleLogin = async () => {
    try {
      const user = await Login(String(username), String(password)); // Wait for the login response
      if (user) {
        Alert.alert('Login Success', `Welcome back, ${username}!`);
        navigation.replace('MainTabs', { user: user }); // Navigate to MainTabs if login succeeds
      } else {
        Alert.alert('Login Failed', 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid username or password'); // Handle network or server errors
    }
  };

  const handelSignIn = () => {
    navigation.replace('SignIn');
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>3Scapey</Text>
      <Text style={styles.subtitle}>Enhancing Travel</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={[styles.button, styles.signinButton]} onPress={handelSignIn}>
        <Text style={styles.buttonText}>Create a New User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 30,
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 25,
    paddingBottom: 5,
  },
  icon: {
    marginRight: 10,
    color: '#555',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  signinButton: {
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#aaa',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
  },
});

export default LoginScreen;