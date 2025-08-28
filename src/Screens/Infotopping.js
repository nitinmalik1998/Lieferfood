import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../State/ThemeContext'; // Import useTheme

const Infotopping = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { getColors } = useTheme(); // Get theme colors
  const colors = getColors();

  return (
    <SafeAreaView style={{ 
      paddingTop: insets.top, 
      flex: 1,
      backgroundColor: colors.background, // Dynamic background
    
    }}>
      <ScrollView 
        contentContainerStyle={[
          styles.content, 
          { backgroundColor: colors.background } // ScrollView background
        ]}
      >
        {/* Header Row */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>
              <FontAwesome6 
                name="arrow-left-long" 
                size={20} 
                color={colors.headerBg} // Dynamic icon color
              />
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.text }]}>
            More info
          </Text>
        </View>

        {/* Divider Line */}
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        {/* Allergens Section */}
        <View style={{ flexDirection: "row", gap: "3%", marginTop: "4%" }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Allergens
          </Text>
          <Text style={{
            backgroundColor: colors.toggleInactive,
            color: colors.text,
            alignSelf: "center",
            marginBottom: "2.5%",
            padding: 2,
            borderRadius: 5
          }}>
            Unverified by seller
          </Text>
        </View>
        
        <Text style={[styles.infoText, { color: colors.text }]}>
          No information provided
        </Text>
        
        {/* Additives Section */}
        <View style={{ flexDirection: "row", gap: "3%", marginTop: "8%" }}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Additives
          </Text>
          <Text style={{
            backgroundColor: colors.toggleInactive,
            color: colors.text,
            alignSelf: "center",
            marginBottom: "2.5%",
            padding: 2,
            borderRadius: 5
          }}>
            Unverified by seller
          </Text>
        </View>
        <Text style={[styles.infoText, { color: colors.text }]}>
          No information provided
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  backArrow: {
    fontSize: 28,
    marginRight: 16,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '500',
    marginBottom: "1%"
  },
  divider: {
    height: 1,
    marginBottom: 20,
    marginHorizontal: -50,
    marginTop: "1%"
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 22,
    flex: 1
  },
});

export default Infotopping;