import React, {useContext, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {Card} from 'react-native-shadow-cards';
import {styles} from "./style";
import {SprayCardContext} from "./SprayCardContext";

export default function Content() {
    const {sprayCardContents,} = useContext(SprayCardContext);
    const [responsiblePerson, setResponsiblePerson] = React.useState([]);
    const [gallonsWaterRate, setGallonsWaterRate] = React.useState([]);
    const [chemicalContents, setChemicalContents] = React.useState([]);
    const [totalAmount, setTotalAmount] = React.useState([]);
    const [totalCost, setTotalCost] = React.useState([]);
    const [decisionContents, setDecisionContents] = React.useState([]);
    const [cropContents, setCropContents] = React.useState([]);
    const [targetContents, setTargetContents] = React.useState([]);
    const [siteContents, setSiteContents] = React.useState([]);

    const updateSprayCardContent = () => {
        const uniqueChemicalPurchases = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.chemical_purchase), item.chemical_purchase])).values()];

        let applicationRate = []
        for (let i = 0; i < uniqueChemicalPurchases.length; i++) {
            applicationRate.push(sprayCardContents.find(item => JSON.stringify(item.chemical_purchase) === JSON.stringify(uniqueChemicalPurchases[i])).application_rate);
        }

        let tempUniqueChemicalPurchases = JSON.parse(JSON.stringify(uniqueChemicalPurchases));
        for (let i = 0; i < tempUniqueChemicalPurchases.length; i++) {
            tempUniqueChemicalPurchases[i].label = tempUniqueChemicalPurchases[i].label + " | " + applicationRate[i] + " " + tempUniqueChemicalPurchases[i].unit;
        }
        setChemicalContents(tempUniqueChemicalPurchases);

        let uniqueDecisions = [];
        for (let i = 0; i < uniqueChemicalPurchases.length; i++) {
            uniqueDecisions.push(sprayCardContents.find(item => JSON.stringify(item.chemical_purchase) === JSON.stringify(uniqueChemicalPurchases[i])).decision_support);
        }
        setDecisionContents(uniqueDecisions);

        let tempTotalAmount = [];
        for (let i = 0; i < uniqueChemicalPurchases.length; i++) {
            let sum = sprayCardContents
                .filter(item => JSON.stringify(item.chemical_purchase) === JSON.stringify(uniqueChemicalPurchases[i]))
                .reduce((acc, item) => acc + parseFloat(item.total_amount), 0);
            tempTotalAmount.push(sum);
        }
        setTotalAmount(tempTotalAmount);

        let tempTotalCost = [];
        for (let i = 0; i < uniqueChemicalPurchases.length; i++) {
            let sum = sprayCardContents
                .filter(item => JSON.stringify(item.chemical_purchase) === JSON.stringify(uniqueChemicalPurchases[i]))
                .reduce((acc, item) => acc + parseFloat(item.total_cost), 0);
            tempTotalCost.push(sum);
        }
        setTotalCost(tempTotalCost);

        const uniqueCrops = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.crop), item.crop])).values()];
        setCropContents(uniqueCrops);

        let uniqueTargets = [];
        for (let i = 0; i < uniqueCrops.length; i++) {
            uniqueTargets.push(sprayCardContents.find(item => JSON.stringify(item.crop) === JSON.stringify(uniqueCrops[i])).target);
        }
        setTargetContents(uniqueTargets);

        const uniqueSites = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.site), item.site])).values()];
        setSiteContents(uniqueSites);

        setGallonsWaterRate(sprayCardContents[0]?.gallons_water_rate || "")

        setResponsiblePerson(sprayCardContents[0]?.responsible_person || "")
    };

    useEffect(() => {
        updateSprayCardContent()
    }, [sprayCardContents]);

    return (
        <Card style={{...styles.card, marginTop: 0, paddingHorizontal: 20}}>
            <Text style={styles.detailsHeaderTxt}>Spray Card</Text>

            <View style={styles.detailsRow}>
                <View style={styles.contentRowSec}>
                    <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Gallons Water Rate: </Text>
                    <Text
                        style={styles.detailsRowTxt}>{gallonsWaterRate + " gallons/site unit"}</Text>
                </View>
            </View>
            {chemicalContents.map((item, index) => (
                <View style={styles.detailsRow} key={item.id}>
                    <View style={styles.contentRowSec}>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Chemical {index + 1}: </Text>
                            <Text
                                style={styles.detailsRowTxt}>{item.label.split(" | ")[1] + " (" + item.label.split(" | ")[0] + "): " + item.label.split(" | ")[4] + "/site unit"}</Text>
                        </View>
                    </View>
                </View>
            ))}
            {/*{cropContents.map((item, index) => (*/}
            {/*    <View style={styles.detailsRow} key={item.id}>*/}
            {/*        <View style={styles.contentRowSec}>*/}
            {/*            <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Crop {index + 1}: </Text>*/}
            {/*            <Text style={styles.detailsRowTxt}>{item.label}</Text>*/}
            {/*        </View>*/}
            {/*    </View>*/}
            {/*))}*/}
            {siteContents.map((item, index) => (
                <View style={styles.detailsRow} key={item.id}>
                    <View style={styles.contentRowSec}>
                        <View style={{flexDirection: 'column'}}>
                            <Text style={[styles.detailsRowTxt, {fontWeight: 'bold'}]}>Site {index + 1}: </Text>
                            <Text style={styles.detailsRowTxt}>{item.label}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </Card>
    );
}
