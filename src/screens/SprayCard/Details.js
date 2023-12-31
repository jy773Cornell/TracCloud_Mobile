import React, {useState, useEffect, createContext} from 'react';
import {View} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {styles} from "./style";
import Overview from "./Overview";
import Content from "./Content";
import Operations from "./Operations";
import {ScrollView, RefreshControl} from "react-native";
import {getSprayData, SprayCardContentGet, SprayCardListGet} from "../../api/spraycard-api";
import {SprayCardContext} from './SprayCardContext';


export default function Details() {
    const route = useRoute();
    const {uid, employer_id, sprayCardSelected} = route.params;

    const [sprayCardProcess, setSprayCardProcess] = React.useState({});
    const [sprayCardContents, setSprayCardContents] = useState([]);
    const [sprayData, setSprayData] = React.useState({});
    const [sprayOptions, setSprayOption] = React.useState({});
    const [refreshing, setRefreshing] = React.useState(false);

    const fetchProcessData = async () => {
        try {
            const response = await SprayCardListGet(uid);
            setSprayCardProcess(response.find(process => process.scpid === sprayCardSelected.scpid));
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    const fetchContentData = async () => {
        try {
            const response = await SprayCardContentGet(sprayCardSelected.scpid);
            setSprayCardContents(response);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    const fetchUserData = async () => {
        try {
            const response = await getSprayData(uid, employer_id);
            setSprayData(response.record_data);
            setSprayOption(response.option_data);
        } catch (error) {
            console.error("Error fetching data3: ", error);
        }
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        Promise.all([fetchProcessData(), fetchContentData(), fetchUserData()]).then(() => setRefreshing(false));
    }, [sprayCardSelected]);

    useFocusEffect(onRefresh);

    return (
        <SprayCardContext.Provider
            value={{sprayCardProcess, sprayCardContents, sprayData, sprayOptions, refreshing, onRefresh}}>
            <ScrollView
                contentContainerStyle={styles.container}
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
            >
                <Overview/>
                <Operations uid={uid}/>
                <Content/>
            </ScrollView>
        </SprayCardContext.Provider>
    );
}
