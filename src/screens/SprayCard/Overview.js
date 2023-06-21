import React, {useContext, useEffect} from 'react';
import {Text, View} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {styles} from "./style";
import {SprayCardContext} from "./Details";

export default function Overview() {
    const {sprayCardProcess} = useContext(SprayCardContext);

    return (
        <Card style={styles.card}>
            <Text style={styles.detailsHeaderTxt}>Overview</Text>
            <Text style={styles.overviewSubheaderTxt}>{sprayCardProcess?.scpid}</Text>
            <View style={styles.detailsRow}>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>State: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardProcess?.state}</Text>
                </View>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Active: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardProcess?.is_active ? "Yes" : "No"}</Text>
                </View>
            </View>
            <View style={styles.detailsRow}>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Owner: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardProcess?.owner}</Text>
                </View>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Holder: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardProcess?.holder}</Text>
                </View>
            </View>
            <View style={styles.detailsRow}>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Update: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardProcess?.update_time?.split(" ")[0]}</Text>
                </View>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Create: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardProcess?.create_time?.split(" ")[0]}</Text>
                </View>
            </View>
        </Card>
    );
}


