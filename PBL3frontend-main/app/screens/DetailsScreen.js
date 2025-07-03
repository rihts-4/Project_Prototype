import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SpotImage from '../components/SpotImage';

const { width } = Dimensions.get('window');

export default function DetailsScreen({ route }) {
  const { spot, event } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {spot ? (
          // Spot Details View
          <>
            {/* Display Image at top */}
            <SpotImage spotName={spot.name} imageNumber={2} />
            
            {/* Display Title */}
            <Text style={styles.title}>{String(spot.name || 'No Title')}</Text>

            {/* Description / Full Extract Section */}
            <Text style={styles.sectionHeading}>Details</Text>
            <Text style={styles.descriptionText}>{String(spot.description)}</Text>
            
            <Text style={styles.sectionHeading}>Price of Entry</Text>
            <Text style={styles.descriptionText}>{String(spot.price_of_entry)}</Text>
            
            <Text style={styles.sectionHeading}>Open Hours</Text>
            <Text style={styles.descriptionText}>{String(spot.open_hours)}</Text>
            
            <Text style={styles.sectionHeading}>Accessibility</Text>
            {spot.accessibility && spot.accessibility.closest_stations.map((station, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <Text style={styles.descriptionText}>{String(station.station_name)}</Text>
                <Text style={styles.descriptionText}>{String(station.walking_time_minutes)} minutes</Text>
              </View>
            ))}
            
            <Text style={styles.sectionHeading}>General Advice</Text>
            <Text style={styles.descriptionText}>{String(spot.general_advice)}</Text>
          </>
        ) : event ? (
          // Event Details View
          <>
            {/* Display Event Image if available */}
            {event.image_url && (
              <Image 
                source={{ uri: event.image_url }} 
                style={styles.topImage} 
              />
            )}
            
            {/* Display Event Title */}
            <Text style={styles.title}>{String(event.name || 'No Title')}</Text>

            {/* Event Description */}
            <Text style={styles.sectionHeading}>Event Details</Text>
            <Text style={styles.descriptionText}>{String(event.description || 'No description available')}</Text>
            
            {/* Event Date */}
            {event.datetime && (
              <>
                <Text style={styles.sectionHeading}>Date</Text>
                <Text style={styles.descriptionText}>{String(event.datetime)}</Text>
              </>
            )}
            
            {/* Event Location */}
            {event.location && (
              <>
                <Text style={styles.sectionHeading}>Location</Text>
                <Text style={styles.descriptionText}>{String(event.location)}</Text>
              </>
            )}
            
            {/* Event Organizer */}
            {event.url && (
              <>
                <Text style={styles.sectionHeading}>URL</Text>
                <Text style={styles.descriptionText}>{String(event.url)}</Text>
              </>
            )}
          </>
        ) : (
          // Fallback if neither spot nor event is provided
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No details available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { // Style for the SafeAreaView itself
        flex: 1,
        backgroundColor: '#fff',},

  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 0 : 0, // You can adjust this if needed for status bar, or use SafeAreaView
  },
  topImage: {
    width: width,
    height: width * 0.6,
    resizeMode: 'cover',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 10,
    color: '#333',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  summaryText: {
    fontSize: 16,
    marginHorizontal: 16,
    lineHeight: 22,
    color: '#555',
  },
  descriptionText: {
    fontSize: 16,
    marginHorizontal: 16,
    lineHeight: 22,
    color: '#555',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#999',
  },
});