import React, {useContext, useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {Button as PaperButton} from 'react-native-paper'
import {Card} from 'react-native-shadow-cards';
import {styles} from "./style";
import {SprayCardReturn} from "../../api/spraycard-api";
import Toast from "../../components/Toast";
import {useNavigation} from '@react-navigation/native';
import {RefreshRecordContext} from "./SprayCard";

export default function Operations({uid, refreshRecord, sprayCardSelected}) {
    const navigation = useNavigation();
    const setRefreshRecord = useContext(RefreshRecordContext);

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const completeCondition = () => {
        return (
            sprayCardSelected?.holder_id === uid
        );
    };

    const returnCondition = () => {
        return (
            sprayCardSelected?.holder_id === uid &&
            sprayCardSelected?.holder_id !== sprayCardSelected?.owner_id);
    };

    const editCondition = () => {
        return (
            sprayCardSelected?.owner_id === uid &&
            sprayCardSelected?.holder_id === sprayCardSelected?.owner_id);
    };

    const withdrawCondition = () => {
        return (
            sprayCardSelected?.owner_id === uid
            && sprayCardSelected?.state !== 'archived'
        );
    };

    const performReturnAction = async () => {
        try {
            const response = await SprayCardReturn(sprayCardSelected.scpid, uid);
            if (response) {
                setToastMessage('Process returned successfully.');
                setToastType('success');
                setTimeout(() => {
                    setRefreshRecord(!refreshRecord);
                    navigation.goBack();
                }, 3000);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
            setToastMessage(error);
            setToastType('error');
        }
    };

    return (
        <>
            <Card style={{...styles.card, marginTop: 0}}>
                <Text style={styles.detailsHeaderTxt}>Operations</Text>
                <View style={styles.detailsRow}>
                    <View style={styles.overviewRowSec}>
                        <PaperButton labelStyle={styles.operationText} onPress={() => console.log("aaa")}>
                            Assign
                        </PaperButton>
                    </View>
                    <View style={styles.overviewRowSec}>
                        <PaperButton labelStyle={styles.operationText} disabled={!returnCondition()}
                                     onPress={() => {
                                         Alert.alert(
                                             "Confirmation",
                                             "Are you sure you want to return this process?",
                                             [
                                                 {
                                                     text: "Cancel",
                                                     style: "cancel"
                                                 },
                                                 {
                                                     text: "OK",
                                                     onPress: () => {
                                                         performReturnAction();
                                                     }
                                                 }
                                             ]
                                         );
                                     }}
                        >
                            Return
                        </PaperButton>
                    </View>
                </View>
                <View style={styles.detailsRow}>
                    <View style={styles.overviewRowSec}>
                        <PaperButton labelStyle={styles.operationText} disabled={!completeCondition()}
                                     onPress={() => console.log("aaa")}>
                            Complete
                        </PaperButton>
                    </View>
                    <View style={styles.overviewRowSec}>
                        <PaperButton labelStyle={styles.operationText} disabled={!editCondition()}
                                     onPress={() => console.log("aaa")}>
                            Edit
                        </PaperButton>
                    </View>
                    <View style={styles.overviewRowSec}>
                        <PaperButton labelStyle={styles.operationText} disabled={!withdrawCondition()}
                                     onPress={() => console.log("aaa")}>
                            Withdraw
                        </PaperButton>
                    </View>
                </View>
            </Card>
            <Toast type={toastType} message={toastMessage} onDismiss={() => setToastMessage('')}/>
        </>
    );
}
