// app/assets/screens/DiscoverScreen.js
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GetSpots } from '../services/api';
import SpotImage from '../components/SpotImage';

export default function DiscoverScreen({ user }) {
  const navigation = useNavigation();
  const [search, setSearch] = useState(''); // Initial search for tourist spots
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spots, setSpots] = useState([]); // State to hold the fetched tourist spots

  // const touristSpotKeywords = ['park', 'castle', 'temple', 'shrine', 'garden', 'museum', 'landmark', 'tower'];

  //=================================
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await GetSpots(user.user_id)

      if (!response) {
        throw new Error('Failed to fetch data from Database');
      }
      setResults(response); // Set the results from the API response
      setSpots(response); // Also set the spots state for potential future use
      
    } catch (error) {
      console.error('Wikimedia API error (Discover):', error);
      Alert.alert('Error', error.message || 'Failed to load tourist spots.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = () => {
    if (search.trim() !== '') {
      const filtered = results.filter(spot => {
        const spotName = spot.name.toLowerCase();
        const spotDesc = spot.description ? spot.description.toLowerCase() : '';
        const searchTerm = search.toLowerCase();

        return spotName.includes(searchTerm) || spotDesc.includes(searchTerm);
      })
      setResults(filtered);
    } else {
      setResults(spots)
    }
  };

  //==========================
  const handlePressBox = (spot) => {
    navigation.navigate('Details', { spot });
  };

  return (
    <View style={styles.container}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tourist spots..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
        {/* <MaterialIcons name="menu" size={24} color="#999" /> */}
      </View>

      {/* Loading Spinner */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.discoverGrid}>
          {results.length > 0 ? (
            results.map((spot) => {

              return (<TouchableOpacity
                key={spot.spot_id}
                style={styles.discoverBox}
                onPress={() => handlePressBox(spot)}
                >
                <SpotImage spotName={spot.name} imageNumber={1} />
                <Text style={styles.discoverTitle}>{spot.name}</Text>
                {/* {spot.description && (
                  <Text style={styles.discoverDesc}>{spot.description}</Text>
                )} */}
              </TouchableOpacity>)
      })
          ) : (
            <Text style={styles.noResultsText}>No tourist spots found. Try a different search!</Text>
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
  discoverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingBottom: 80,
  },
  discoverBox: {
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
  discoverImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
    resizeMode: 'cover',
  },
  discoverTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  discoverDesc: {
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
});