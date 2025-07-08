// app/assets/screens/EventsScreen.js
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GetEvents } from '../services/api';

export default function EventsScreen({ user }) {
  const navigation = useNavigation();
  const [search, setSearch] = useState('Japan festivals'); // Default search for events
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]); // State to hold 

  //=================================
  const fetchWikimediaData = async () => {
    try {
      setLoading(true);
      const response = await GetEvents(user.user_id);

      if (!response) {
        throw new Error('Failed to fetch data from Database');
      }
      setResults(response);
      setEvents(response);
      
    } catch (error) {
      console.error('Wikimedia API error (Discover):', error);
      Alert.alert('Error', error.message || 'Failed to load tourist spots.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWikimediaData();
  }, []);

  const handleSearch = () => {
    if (search.trim() !== '') {
      const filtered = results.filter(event => {
        const eventName = event.name.toLowerCase();
        const searchTerm = search.toLowerCase();

        return eventName.includes(searchTerm);
      })
      setResults(filtered);
    } else {
      setResults(events)
    }
  };

  //=========================
  const handlePressBox = (item) => {
    navigation.navigate('Details', {
      event: item
    });
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events (e.g., festival, concert)..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
      </View>

      <View style={styles.header}>
                        <View>
                          <View>
                            <Text style={styles.title}>Based on your interests</Text>
                            {/* <Text style={styles.userEmail}>{displayEmail}</Text> */}
                          </View>
                        </View>
                    </View> 

      {/* Loading Spinner */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.eventsGrid}>
          {results.length > 0 ? (
            results.map((event) => {
              return (
                <TouchableOpacity
                  key={event.event_id}
                  style={styles.eventBox}
                  onPress={() => handlePressBox(event)}
                >
                  <Image
                    source={{ uri: event.image_url || null }}
                    style={styles.eventImage}
                  />
                  <Text style={styles.eventTitle}>{event.name}</Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noResultsText}>No events found. Try a different search!</Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 50,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingBottom: 80,
  },
  eventBox: {
    width: '45%',
    marginVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
    resizeMode: 'cover',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  eventDesc: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 3,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 30,
    marginBottom: 0,
  }
});