import _ from "lodash";
import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect, useContext} from 'react';
import {Text, View, FlatList, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {styles} from "./style";
import {SprayCardListGet} from '../../api/spraycard-api'
import {RefreshRecordContext} from "./SprayCard";


export default function DataGrid() {
    const navigation = useNavigation()
    const route = useRoute();
    const {uid, refreshRecord,} = route.params;
    const setRefreshRecord = useContext(RefreshRecordContext);

    const [pets, setPets] = useState([])
    const [columns, setColumns] = useState([
        "state",
        "owner",
        "holder",
        "update",
    ])
    const [direction, setDirection] = useState(null)
    const [sprayCardRecords, setSprayCardRecords] = useState(null)
    const [selectedColumn, setSelectedColumn] = useState(null)

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
        const newDirection = direction === "desc" ? "asc" : "desc"
        const sortedData = _.orderBy(pets, [column], [newDirection])
        setSelectedColumn(column)
        setDirection(newDirection)
        setPets(sortedData)
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
                                    {selectedColumn === column &&
                                        <MaterialCommunityIcons
                                            name={direction === "desc" ? "arrow-down-drop-circle" : "arrow-up-drop-circle"}
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await SprayCardListGet(uid);
                setSprayCardRecords(response)
                setPets(response.map((record) => createRowData(record)))
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        }
        fetchData();
    }, [refreshRecord]);

    return (
        <View style={styles.container}>
            <FlatList
                data={pets}
                style={{width: "100%"}}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={tableHeader}
                stickyHeaderIndices={[0]}
                renderItem={({item, index}) => {
                    return (
                        <View style={{...styles.tableRow, backgroundColor: index % 2 === 1 ? "#F0FBFC" : "white"}}>
                            <TouchableOpacity
                                style={styles.columnRowState}
                                onPress={() => handleStateClick(sprayCardRecords.find(record => record.scpid === item.id))}
                            >
                                <Text style={styles.columnRowStateTxt}>{item.state}</Text>
                            </TouchableOpacity>
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

