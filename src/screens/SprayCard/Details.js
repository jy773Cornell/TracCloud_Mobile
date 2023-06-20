import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {useNavigation, useRoute} from '@react-navigation/native';
import {styles} from "./style";

export default function Details() {
    const route = useRoute();
    const {uid, sprayCardSelected} = route.params;

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.overviewHeaderTxt}>Overview</Text>
                <Text style={styles.overviewSubheaderTxt}>{sprayCardSelected.id}</Text>
                <Text style={styles.columnRowTxt}>{sprayCardSelected.owner}</Text>
            </Card>
        </View>
    );
}


