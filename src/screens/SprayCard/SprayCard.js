import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DataGrid from "./DataGrid";
import Details from "./Details";
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useEffect, useContext} from 'react';
import {getSprayData} from '../../api/spraycard-api'

const Stack = createStackNavigator();

export default function SprayCard() {
    const route = useRoute();
    const {uid,} = route.params;

    return (
        <Stack.Navigator initialRouteName="DataGrid">
            <Stack.Screen name="Spray Card Process" component={DataGrid} initialParams={{uid,}}/>
            <Stack.Screen name="Process Details" component={Details} initialParams={{uid,}}/>
        </Stack.Navigator>
    );
}