import React, {useState, useEffect, useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation, useRoute} from '@react-navigation/native';
import DataGrid from "./DataGrid";
import Details from "./Details";
import Complete from "./Complete";

const Stack = createStackNavigator();

export default function SprayCard() {
    const route = useRoute();
    const {uid, employer_id} = route.params;

    return (
        <Stack.Navigator initialRouteName="DataGrid">
            <Stack.Screen name="Spray Card Process" component={DataGrid} initialParams={{uid, employer_id}}/>
            <Stack.Screen name="Process Details" component={Details} initialParams={{uid, employer_id}}/>
            <Stack.Screen name="Complete Process" component={Complete} initialParams={{uid, employer_id}}/>
        </Stack.Navigator>
    );
}