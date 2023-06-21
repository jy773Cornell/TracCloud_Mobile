import React, {useContext, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {styles} from "./style";
import {SprayCardContext} from "./Details";

export default function Content() {
    const {sprayCardContents,} = useContext(SprayCardContext);
    const [chemicalContents, setChemicalContents] = React.useState([]);
    const [decisionContents, setDecisionContents] = React.useState([]);
    const [cropContents, setCropContents] = React.useState([]);
    const [targetContents, setTargetContents] = React.useState([]);
    const [siteContents, setSiteContents] = React.useState([]);
    const updateSprayCardContent = () => {
        const uniqueChemicalPurchases = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.chemical_purchase), item.chemical_purchase])).values()];
        setChemicalContents(uniqueChemicalPurchases);

        let uniqueDecisions = [];
        for (let i = 0; i < uniqueChemicalPurchases.length; i++) {
            uniqueDecisions.push(sprayCardContents.find(item => JSON.stringify(item.chemical_purchase) === JSON.stringify(uniqueChemicalPurchases[i])).decision_support);
        }
        setDecisionContents(uniqueDecisions);

        const uniqueCrops = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.crop), item.crop])).values()];
        setCropContents(uniqueCrops);

        let uniqueTargets = [];
        for (let i = 0; i < uniqueCrops.length; i++) {
            uniqueTargets.push(sprayCardContents.find(item => JSON.stringify(item.crop) === JSON.stringify(uniqueCrops[i])).target);
        }
        setTargetContents(uniqueTargets);

        const uniqueSites = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.site), item.site])).values()];
        setSiteContents(uniqueSites);
    };

    useEffect(() => {
        updateSprayCardContent()
    }, [sprayCardContents]);

    return (
        <Card style={{...styles.card, marginTop: 0}}>
            <Text style={styles.detailsHeaderTxt}>Spray Card</Text>
            {cropContents.map((item, index) => (
                <View style={styles.detailsRow} key={item.id}>
                    <View style={styles.contentRowSec}>
                        <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Crop {index + 1}: </Text>
                        <Text style={styles.detailsRowTxt}>{item.label}</Text>
                    </View>
                </View>
            ))}
            {chemicalContents.map((item, index) => (
                <View style={styles.detailsRow} key={item.id}>
                    <View style={styles.contentRowSec}>
                        <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Chemical {index + 1}: </Text>
                        <Text
                            style={styles.detailsRowTxt}>{item.label.split(" | ")[1] + " (" + item.label.split(" | ")[0] + ")"}</Text>
                    </View>
                </View>
            ))}
            {siteContents.map((item, index) => (
                <View style={styles.detailsRow} key={item.id}>
                    <View style={styles.contentRowSec}>
                        <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Site {index + 1}: </Text>
                        <Text style={styles.detailsRowTxt}>{item.label}</Text>
                    </View>
                </View>
            ))}
        </Card>
    );
}
