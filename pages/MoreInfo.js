import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, Animated, Dimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import locationsBasic from '../database/locations_basic.json';
import locationsDetails from '../database/locations_details.json';
import { formatOpenHours } from '../utils';

const MoreInfo = () => {
  // const navigation = useNavigation(); // used for navigation.navigate()
  const route = useRoute();
  const {
    location,
    distance,
    indicatorColor,
    textColor,
    timeMessage,
    statusText,
    statusTime,
    requirementIndicatorStyle,
    requirementsTextStyle,
    requirementsText,
    subtitle,
    category,
  } = route.params;

  // Find the matching location details
  const locationDetails = locationsDetails[category].find((detail) => detail.id === location.id);
  const [openHoursFormatted, setOpenHoursFormatted] = useState('');

  // Scroll Bar related code
  const scrollY = useState(new Animated.Value(0))[0];
  const [contentHeight, setContentHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    const details = locationsBasic[category].find((detail) => detail.id === location.id);
    if (details) {
      if (!details.openHours || details.openHours.length === 0) {
        setOpenHoursFormatted('Hours by appointment');
      } else {
        setOpenHoursFormatted(formatOpenHours(details.openHours));
      }
    }
  }, [location, category]);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        onContentSizeChange={(width, height) => setContentHeight(height)}
      >
        <View style={styles.resourceContainer}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.title} allowFontScaling={false}>{location.name}</Text>
          <View style={styles.row}>
            <View style={[styles.indicator, { backgroundColor: requirementIndicatorStyle }]}>
              <Text style={[styles.openOrClosed, { color: requirementsTextStyle }]}>
                {requirementsText}
              </Text>
            </View>
          </View>
          <Text style={styles.distance}>
            ~&nbsp;
            <Text style={{ fontFamily: 'Manrope-Bold' }}>
              {distance}
            </Text>
            &nbsp;miles away
          </Text>
          {/* For Debug */}
          {/* <Text style={styles.coordinates}>Lat: {location.coordinates.lat},
          Lng: {location.coordinates.lng}</Text> */}
          <View style={styles.row}>
            <View style={[styles.indicator, { backgroundColor: indicatorColor }]}>
              <Text style={[styles.openOrClosed, { color: textColor }]}>{statusText}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.timing}>
              {timeMessage}
            </Text>
            <Text style={[styles.timing, { fontFamily: 'Manrope-Bold' }]}>
              {statusTime}
            </Text>
          </View>

        </View>

        <View style={styles.resourceContainer}>
          <View style={styles.card}>

            <View style={styles.row2}>
              <Text style={styles.text}>Open Hours</Text>
              <Text style={styles.text2}>{openHoursFormatted}</Text>
            </View>

            <View style={[styles.row2, { backgroundColor: '#eee' }]}>
              <Text style={styles.text}>Address</Text>
              <Text style={styles.text2}>{locationDetails.address}</Text>
            </View>

            <View style={styles.row2}>
              <Text style={styles.text}>Phone</Text>
              <Text style={styles.text2}>{locationDetails.phone}</Text>
            </View>

          </View>
        </View>

        <View />

      </Animated.ScrollView>

      {contentHeight > screenHeight + 1 && (
        <Animated.View style={[styles.scrollIndicator, {
          height: Math.max(screenHeight * (screenHeight / contentHeight), 10),
          transform: [{
            translateY: scrollY.interpolate({
              inputRange: [0, Math.max(1, contentHeight - screenHeight)],
              outputRange:
              [0, Math.max(1, screenHeight
                - Math.max(screenHeight * (screenHeight / contentHeight), 10))],
              extrapolate: 'clamp',
            }),
          }],
        }]}
        />
      )}

    </View>
  );
};

export default MoreInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: '5%',
    paddingBottom: 20,
  },
  scrollIndicator: {
    position: 'absolute',
    right: 2,
    width: 6,
    height: 100, // Set a fixed height for the scrollbar
    backgroundColor: 'black',
    borderRadius: 3,
    opacity: 0.6,
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: '5%',
    paddingBottom: 20,
  },
  resourceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  textContainer: {
    fontSize: 15,
  },
  subtitle: {
    marginBottom: -2,
    marginLeft: 4,
    color: '#2F2E41',
    fontSize: 17,
    fontFamily: 'Manrope-Bold',
    width: '100%',
  },
  subtitle2: {
    marginBottom: 10,
    fontSize: 17,
    color: '#2F2E41',
    width: '100%',
    fontFamily: 'Manrope-Bold',
  },
  distance: {
    marginBottom: 8,
    color: '#2F2E41',
    fontSize: 17,
    fontFamily: 'Manrope-Medium',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#eae0d4',
  },

  title: {
    marginBottom: 8,
    color: '#2F2E41',
    fontSize: 35,
    fontWeight: '900',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 5,
  },
  indicator: {
    backgroundColor: '#fce9c0',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  openOrClosed: {
    fontSize: 17,
    // fontWeight: '700',
    color: '#664501',
    fontFamily: 'Manrope-Bold',
  },
  timing: {
    marginLeft: 5,
    fontSize: 17,
    // fontWeight: '700',
    fontFamily: 'Manrope-Medium',
  },
  card: {
    backgroundColor: '#fff',
    alignItems: 'center',
    width: '105%',
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#A59D95',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 30,
  },
  text: {
    // marginBottom: -2,
    // color: '#2F2E41',
    fontSize: 17,
    fontFamily: 'Manrope-SemiBold',
    width: '40%',
    paddingVertical: 5,
  },
  text2: {
    // marginBottom: -2,
    // color: '#2F2E41',
    fontSize: 17,
    fontFamily: 'Manrope-Bold',
    width: '65%',
    paddingVertical: 5,
  },
  row2: {
    flexDirection: 'row',
    width: '100%',
    // alignItems:'center',
    justifyContent: 'flex-start',
    paddingBottom: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
