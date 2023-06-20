import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DataGrid from "./DataGrid";
import Details from "./Details";
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {getSprayData} from '../../api/spraycard-api'

const Stack = createStackNavigator();

export default function SprayCard() {
    const route = useRoute();
    const {uid,} = route.params;

    const [sprayData, setSprayData] = React.useState({});
    const [sprayOptions, setSprayOption] = React.useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSprayData(uid);
                setSprayData(response.record_data);
                setSprayOption(response.option_data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }
        fetchData();
    }, []);

    return (
        <Stack.Navigator initialRouteName="DataGrid">
            <Stack.Screen name="Spray Card Process" component={DataGrid} initialParams={{uid: uid}}/>
            <Stack.Screen name="Process Details" component={Details} initialParams={{uid: uid}}/>
        </Stack.Navigator>
    );
}