import React from 'react';
import {Text, View} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {styles} from "./style";

export default function Overview({sprayCardSelected}) {
    return (
        <Card style={styles.card}>
            <Text style={styles.detailsHeaderTxt}>Overview</Text>
            <Text style={styles.overviewSubheaderTxt}>{sprayCardSelected.scpid}</Text>
            <View style={styles.detailsRow}>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>State: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardSelected.state}</Text>
                </View>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Active: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardSelected.is_active ? "Yes" : "No"}</Text>
                </View>
            </View>
            <View style={styles.detailsRow}>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Owner: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardSelected.owner}</Text>
                </View>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Holder: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardSelected.holder}</Text>
                </View>
            </View>
            <View style={styles.detailsRow}>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Update: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardSelected.update_time.split(" ")[0]}</Text>
                </View>
                <View style={styles.overviewRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Create: </Text>
                    <Text style={styles.detailsRowTxt}> {sprayCardSelected.create_time.split(" ")[0]}</Text>
                </View>
            </View>
        </Card>
    );
}


