import _ from "lodash";
import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect, useContext} from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {styles} from "./style";
import {getSprayData, SprayCardListGet} from '../../api/spraycard-api'
import {useFocusEffect} from '@react-navigation/native';
import {Button as PaperButton} from "react-native-paper";

export default function DataGrid() {
    const navigation = useNavigation()
    const route = useRoute();
    const {uid,} = route.params;

    const [sprayData, setSprayData] = React.useState({});
    const [sprayOptions, setSprayOption] = React.useState({});
    const [sprayCardRecords, setSprayCardRecords] = useState(null)

    const [state, setState] = useState({
        direction: null,
        selectedColumn: null,
        pets: [],
    })
    const [columns, setColumns] = useState([
        "state",
        "owner",
        "holder",
        "update",
    ])
    const [refreshing, setRefreshing] = useState(false);

    const createRowData = (record) => {
        return {
            "id": record.scpid,
            "state": record.state,
            "owner": record.owner,
            "holder": record.holder,
            "update": record.update_time.split(" ")[0],
            "create": record.create_time.split(" ")[0],
        };
    }

    const handleStateClick = (record) => {
        navigation.navigate('Process Details', {sprayCardSelected: record,})
    };

    const sortTable = (column) => {
        setState(prevState => {
            const newDirection = prevState.direction === "desc" ? "asc" : "desc"
            const sortedData = _.orderBy(prevState.pets, [column], [newDirection])
            return {
                ...prevState,
                direction: newDirection,
                pets: sortedData,
                selectedColumn: column,
            }
        })
    }

    const tableHeader = () => (
        <View style={styles.tableHeader}>
            {
                columns.map((column, index) => {
                    {
                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.columnHeader}
                                onPress={() => sortTable(column)}>
                                <Text style={styles.columnHeaderTxt}>
                                    {column + " "}
                                    {state.selectedColumn === column &&
                                        <MaterialCommunityIcons
                                            name={state.direction === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"}
                                        />
                                    }
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                })
            }
        </View>
    )

    const fetchUserData = async () => {
        try {
            const response = await getSprayData(uid);
            setSprayData(response.record_data);
            setSprayOption(response.option_data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    const fetchSprayData = async () => {
        try {
            const response = await SprayCardListGet(uid);
            setSprayCardRecords(response)
            setState((prevState) => ({
                ...prevState,
                pets: response.map((record) => createRowData(record))
            }));
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        Promise.all([fetchUserData(), fetchSprayData()]).then(() => setRefreshing(false));
    }, [uid]);

    useFocusEffect(onRefresh);

    return (
        <View style={styles.container}>
            <FlatList
                data={state.pets}
                style={{width: "100%"}}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={tableHeader}
                stickyHeaderIndices={[0]}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={({item, index}) => {
                    return (
                        <View style={{...styles.tableRow, backgroundColor: index % 2 === 1 ? "#F0F8FF" : "white"}}>
                            <PaperButton style={styles.columnRowState} labelStyle={styles.columnRowStateTxt}
                                         onPress={() => handleStateClick(sprayCardRecords.find(record => record.scpid === item.id))}>
                                {item.state}
                            </PaperButton>
                            <Text style={styles.columnRowTxt}>{item.owner}</Text>
                            <Text style={styles.columnRowTxt}>{item.holder}</Text>
                            <Text style={styles.columnRowTxt}>{item.update}</Text>
                        </View>
                    )
                }}
            />
            <StatusBar style="auto"/>
        </View>
    );
}

