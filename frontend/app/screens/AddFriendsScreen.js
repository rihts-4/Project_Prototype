// app/assets/screens/AddFriendsScreen.js
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
  Alert,
  Button
} from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AddFriend, Friends } from '../services/api'; // Import the addFriend function and friends list

export default function AddFriendsScreen({ route }) {
  const navigation = useNavigation();
  const [rec, setRec] = useState([]); // State to hold friends list
  const [addedUsers, setAddedUsers] = useState(new Set()); // Track added users
  const { user, friends } = route.params || {}; // Get user from route params

  const GetBots = () => {
    Friends(user.survey).then(data => {
      const matches = data;
      // console.log('matches:', matches);

      // Create a Set of existing friend usernames for faster lookup
      const existingFriends = new Set(friends || []);
      // console.log(existingFriends)
      // console.log(friends)
      
      // Filter out current user and existing friends
      const filteredMatches = matches.filter(match => {
        // Check if match is not the current user
        if (match.username === user.username) {
          return false;
        }
        
        // Check if match is already in user's friends list
        return !existingFriends.has(match.username);
      });
      
      // Create recommendations array at once
      const newRecommendations = filteredMatches.map(user => ({
        username: user.username,
        score: user.similarity_percent
      }));
      
      // Set state once
      setRec(newRecommendations);
    }).catch(error => {
      console.error('Error fetching recommendations:', error);
    });
  };

  const handleAddBot = (botItem) => {
  try {
      // Add user to the addedUsers set immediately
      setAddedUsers(prev => new Set([...prev, botItem.username]));
      
      // console.log(user.user_id, botItem.username);
      AddFriend(user.user_id, botItem.username).then(response => {
        console.log(response);
        Alert.alert('Success', `${botItem.username} has been added to your friends!`);
        GetBots();
      }).catch(error => {
        // If API call fails, remove user from addedUsers set
        setAddedUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(botItem.username);
          return newSet;
        });
        Alert.alert('Error', error.message, [{ text: 'OK' }]);
      });
    } catch (error) {
      // If there's an error, remove user from addedUsers set
      setAddedUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(botItem.username);
        return newSet;
      });
      Alert.alert('Error', error.message, [{ text: 'OK' }]);
    }
  };

  useEffect(() => {
    // Fetch the friends list when the component mounts
    if (user && user.interest_tags) {
      GetBots();
    }
  }, []);


  const renderBotItem = ({ item }) => {
    const isAdded = addedUsers.has(item.username);
    
    return (
      <View style={styles.botItem}>
        <Ionicons name="person" size={40} color="#6A0DAD" />
        <Text style={styles.botName}>{item.username}</Text>
        <Text style={styles.botName}>{item.score}%</Text>
        <TouchableOpacity
          style={isAdded ? styles.addedButton : styles.addButton}
          onPress={() => {
            handleAddBot(item);
          }}
          disabled={isAdded} // Disable button if already added
        >
          {isAdded ? (
            <Text style={styles.addButtonText}>Added</Text>
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Friends</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.alsoLike}>
        <View>
          <View>
            <Text style={styles.alsoTitle}>People who also like {user.interest_tags.map((interest, i) => i == user.interest_tags.length - 1 ? `${interest}` : `${interest}, `)}</Text>
            <View style={styles.column}>
              <Text style={{ fontSize: 16, color: '#666' }}>
                Username     Similarity Score
              </Text>
            </View>
          </View>
        </View>
      </View> 

      <FlatList
        data={rec}
        renderItem={renderBotItem}
        keyExtractor={(item) => String(item.username)}
        contentContainerStyle={styles.botList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: Platform.OS === 'android' ? 25 : 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  botList: {
    paddingHorizontal: 20,
  },
  botItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  botName: {
    fontSize: 18,
    marginLeft: 15,
    flex: 1, // Allows name to take up available space
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addedButton: {
    backgroundColor: '#ccc', // Gray out if already added
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  alsoLike: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  alsoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
  column: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});