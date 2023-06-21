import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {styles} from "./style";
import Overview from "./Overview";
import Content from "./Content";
import Operations from "./Operations";
import {ScrollView} from "react-native";

export default function Details() {
    const route = useRoute();
    const {uid, sprayCardSelected} = route.params;

    return (
        <ScrollView contentContainerStyle={styles.container} style={styles.scrollContainer}>
            <Overview sprayCardSelected={sprayCardSelected}/>
            <Content sprayCardSelected={sprayCardSelected}/>
            <Operations uid={uid} sprayCardSelected={sprayCardSelected}/>
        </ScrollView>
    );
}
