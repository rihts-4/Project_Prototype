import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Only need useNavigation now

// AccountScreen now receives username as a direct prop
const AccountScreen = ({ user }) => {
  const navigation = useNavigation();

  // Use the directly passed username
  const effectiveUser = user || 'N/A'; // Still good to have a fallback just in case

  const displayName = effectiveUser.username;
  // const displayEmail = `${effectiveUser.username}@gmail.com`;
  const visitedPlaces = effectiveUser.travel_history || []; // Assuming travel_history is an array of visited places

  const [mobileNumber, setMobileNumber] = useState('');
  const [hidden, setHidden] = useState(false);

 
  //====================================
  const handleDeletePlace = index => {
    const newVisitedPlaces = [...visitedPlaces];
    newVisitedPlaces.splice(index, 1);

  };

  //========================================
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // In a real application, you would clear user session/tokens here
            // e.g., AsyncStorage.clear() or an API call

            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Ionicons name="person-circle-outline" size={40} color="black" />
          <View>
            <Text style={styles.userName}>{displayName}</Text>
            {/* <Text style={styles.userEmail}>{displayEmail}</Text> */}
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Toggle Personal Details */}
      <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.row}>
        <Text style={styles.label}>Toggle personal details</Text>
        <Feather name={hidden ? "eye-off" : "eye"} size={20} color="black" />
      </TouchableOpacity>

      {/* Conditional Rendering */}
      {!hidden ? (
        <>
          {/* Name Display */}
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Name</Text>
        <Text style={styles.displayText}>{displayName}</Text>
      </View>

      {/* Email Account Display */}
      {/* <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Email account</Text>
        <Text style={styles.displayText}>{displayEmail}</Text>
      </View> */}

      <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Mobile number</Text>
          <TextInput
            style={styles.textInput}
            value={mobileNumber}
            onChangeText={setMobileNumber}
            placeholder="Add number"
            keyboardType="phone-pad"
          />
        </View>

      {/* Location Placeholder */}
      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>Location</Text>
        <Text style={styles.displayText}>Japan</Text>
      </View>
        
        </>
      ): (
        <>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Name</Text>
            <Text style={styles.displayText}>{'*'.repeat(displayName.length)}</Text>
          </View>

          {/* Email Account Display */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Email account</Text>
            <Text style={styles.displayText}>{'*'.repeat(displayEmail.length)}</Text>
          </View>
        </>
      )}

      {/* Visited Places Section */}
      {/* Conditional Rendering */}
      <TouchableOpacity style={styles.row2}>
        <Text style={styles.label}>Travel History</Text>
      </TouchableOpacity>
      {!hidden && visitedPlaces.length > 0 ? (
          visitedPlaces.map((place) => (
              <View key={place} style={styles.row}>
                <Text style={styles.label}>{place}</Text>
                <TouchableOpacity style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
        ) : visitedPlaces.length > 0 ? (
            visitedPlaces.map((place) => (
              <View key={place} style={styles.row}>
                <Text style={styles.label}>{'*'.repeat(place.length)}</Text>
                <TouchableOpacity style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
        ) : (
          <View style={styles.row}>
            <Text style={styles.label}>No visited places</Text>
          </View>
        )}

      
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  inputLabel: {
    fontSize: 16,
    width: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  displayText: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  
 
  deleteButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AccountScreen;