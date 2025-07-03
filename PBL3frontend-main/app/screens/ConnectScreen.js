// app/assets/screens/ConnectScreen.js
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { GetFriends } from '../services/api';

export default function ConnectScreen({ user }) {
  const navigation = useNavigation();
  const [friends, setFriends] = useState([]); // Use our custom hook to get friends and addFriend function
   // Get the friends list from context

   useFocusEffect(
    useCallback(() => {
      GetFriends(user.user_id).then(data => setFriends(data))
      // console.log(user.friends)
      setFriends(user.friends)
      // You can also perform any other actions here when the screen is focused
      // For example, you might want to refresh the friends list or perform some setup
      // console.log('Profile screen is focused');
      // Perform actions when the screen becomes focused
      // return () => {
      //   console.log('Profile screen is unfocused (cleanup)');
      //   // Perform cleanup when the screen goes out of focus
      // };
    }, [])
  );

  const handleAddFriends = () => {
    navigation.navigate('AddFriends', { user, friends }); // Navigate to the screen for adding friends
  };

  const handleFriendPress = (friend) => {
    // Navigate to the chat screen for this friend
    navigation.navigate('ChatScreen', { friendName: friend, friendId: friend });
  };

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItem} onPress={() => handleFriendPress(item)}>
      <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
      <Text style={styles.friendName}>{item}</Text>
      {/* You can add status indicators here later */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Friends</Text>
        <TouchableOpacity onPress={handleAddFriends} style={styles.addButton}>
          <Ionicons name="person-add-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {friends.length === 0 ? (
        <View style={styles.noFriendsContainer}>
          <Text style={styles.noFriendsText}>You haven't added any friends yet.</Text>
          <Text style={styles.noFriendsText}>Tap the person icon to add bots!</Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => String(item.user_id)}
          contentContainerStyle={styles.friendsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: Platform.OS === 'android' ? 25 : 50, // Adjust for status bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 5,
  },
  friendsList: {
    paddingHorizontal: 20,
  },
  friendItem: {
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
  friendName: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: '500',
  },
  noFriendsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noFriendsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },
});