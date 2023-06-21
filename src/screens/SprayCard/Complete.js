import React, {useContext, useEffect, useState} from 'react';
import {styles} from "./style";
import {Keyboard, ScrollView} from "react-native";
import {Text} from "react-native-paper";
import {useRoute} from "@react-navigation/native";
import {TextInput, View} from "react-native";

export default function Complete() {
    const route = useRoute();
    const {uid, sprayCardProcess, sprayCardContents, sprayData, sprayOptions,} = route.params;

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={styles.scrollContainer}
        >

            <Text>{sprayCardProcess.scpid}</Text>
        </ScrollView>
    )
}