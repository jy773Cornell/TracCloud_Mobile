import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {styles} from "./style";
import Overview from "./Overview";
import Content from "./Content";
import Operations from "./Operations";

export default function Details() {
    const route = useRoute();
    const {uid, refreshRecord, sprayCardSelected} = route.params;

    return (
        <View style={styles.container}>
            <Overview sprayCardSelected={sprayCardSelected}/>
            <Content sprayCardSelected={sprayCardSelected}/>
            <Operations uid={uid} refreshRecord={refreshRecord} sprayCardSelected={sprayCardSelected}/>
        </View>
    );
}
