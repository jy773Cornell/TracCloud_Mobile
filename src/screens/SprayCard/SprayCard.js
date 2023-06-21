import React, {useState, useEffect, useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation, useRoute} from '@react-navigation/native';
import DataGrid from "./DataGrid";
import Details from "./Details";
import Complete from "./Complete";

const Stack = createStackNavigator();

export default function SprayCard() {
    const route = useRoute();
    const {uid,} = route.params;

    return (
        <Stack.Navigator initialRouteName="DataGrid">
            <Stack.Screen name="Spray Card Process" component={DataGrid} initialParams={{uid,}}/>
            <Stack.Screen name="Process Details" component={Details} initialParams={{uid,}}/>
            <Stack.Screen name="Complete Process" component={Complete} initialParams={{uid,}}/>
        </Stack.Navigator>
    );
}