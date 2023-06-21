import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import DataGrid from "./DataGrid";
import Details from "./Details";
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState, useEffect, useContext} from 'react';
import {getSprayData} from '../../api/spraycard-api'

const Stack = createStackNavigator();
export const RefreshRecordContext = React.createContext();

export default function SprayCard() {
    const route = useRoute();
    const {uid,} = route.params;

    const [sprayData, setSprayData] = React.useState({});
    const [sprayOptions, setSprayOption] = React.useState({});
    const [refreshRecord, setRefreshRecord] = useState(false);

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
        <RefreshRecordContext.Provider value={setRefreshRecord}>
            <Stack.Navigator initialRouteName="DataGrid">
                <Stack.Screen name="Spray Card Process" component={DataGrid} initialParams={{uid, refreshRecord}}/>
                <Stack.Screen name="Process Details" component={Details} initialParams={{uid, refreshRecord}}/>
            </Stack.Navigator>
        </RefreshRecordContext.Provider>
    );
}