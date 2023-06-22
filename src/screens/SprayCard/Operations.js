import React, {useContext, useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {Button as PaperButton} from 'react-native-paper'
import {Card} from 'react-native-shadow-cards';
import {styles} from "./style";
import {SprayCardReturn, SprayCardWithdraw} from "../../api/spraycard-api";
import Toast from "../../components/Toast";
import {useNavigation, useRoute} from '@react-navigation/native';
import {SprayCardContext} from "./Details";

export default function Operations() {
    const navigation = useNavigation();
    const route = useRoute();
    const {uid,} = route.params;

    const {
        sprayCardProcess,
        sprayCardContents,
        sprayData,
        sprayOptions,
        refreshing,
        onRefresh
    } = useContext(SprayCardContext);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const completeCondition = () => {
        return (
            sprayCardProcess?.holder_id === uid
        );
    };

    const returnCondition = () => {
        return (
            sprayCardProcess?.holder_id === uid &&
            sprayCardProcess?.holder_id !== sprayCardProcess?.owner_id);
    };

    const editCondition = () => {
        return (
            sprayCardProcess?.owner_id === uid &&
            sprayCardProcess?.holder_id === sprayCardProcess?.owner_id);
    };

    const withdrawCondition = () => {
        return (
            sprayCardProcess?.owner_id === uid
            && sprayCardProcess?.state !== 'archived'
        );
    };

    const performReturnAction = async () => {
        try {
            const response = await SprayCardReturn(sprayCardProcess.scpid, uid);
            if (response) {
                setToastMessage('Process returned successfully.');
                setToastType('success');
                setTimeout(() => {
                    navigation.goBack();
                }, 3000);
            }
        } catch (error) {
            // console.error("Error: ", error);
            setToastMessage(error.message);
            setToastType('error');
        }
    };

    const performWithdrawAction = async () => {
        try {
            const response = await SprayCardWithdraw(sprayCardProcess.scpid, uid);
            if (response) {
                setToastMessage('Process withdrew successfully.');
                setToastType('success');
                setTimeout(() => {
                    onRefresh();
                }, 3000);
            }
        } catch (error) {
            // console.error("Error: ", error);
            setToastMessage(error.message);
            setToastType('error');
        }
    };

    const handleAssignButtonClicked = () => {
        setToastMessage('Please go to Web for Assign operation.');
        setToastType('error');
    };

    const handleReturnButtonClicked = () => {
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
    };

    const handleCompleteButtonClicked = () => {
        navigation.navigate('Complete Process', {sprayCardProcess, sprayCardContents, sprayData, sprayOptions,});
    };

    const handleEditButtonClicked = () => {
        setToastMessage('Please go to Web for Edit operation.');
        setToastType('error');
    };

    const handleWithdrawButtonClicked = () => {
        Alert.alert(
            "Confirmation",
            "Are you sure you want to withdraw this process?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        performWithdrawAction();
                    }
                }
            ]
        );

    };

    return (
        ["completed", "withdrew"].includes(sprayCardProcess?.state) || refreshing ? null :
            <>
                <Card style={{...styles.card, marginTop: 0}}>
                    <Text style={styles.detailsHeaderTxt}>Operations</Text>
                    <View style={styles.detailsRow}>
                        <View style={styles.overviewRowSec}>
                            <PaperButton labelStyle={styles.operationText} onPress={() => handleAssignButtonClicked()}>
                                Assign
                            </PaperButton>
                        </View>
                        <View style={styles.overviewRowSec}>
                            <PaperButton labelStyle={styles.operationText} disabled={!returnCondition()}
                                         onPress={() => handleReturnButtonClicked()}
                            >
                                Return
                            </PaperButton>
                        </View>
                    </View>
                    <View style={styles.detailsRow}>
                        <View style={styles.overviewRowSec}>
                            <PaperButton labelStyle={styles.operationText} disabled={!completeCondition()}
                                         onPress={() => handleCompleteButtonClicked()}>
                                Complete
                            </PaperButton>
                        </View>
                        <View style={styles.overviewRowSec}>
                            <PaperButton labelStyle={styles.operationText} disabled={!editCondition()}
                                         onPress={() => handleEditButtonClicked()}>
                                Edit
                            </PaperButton>
                        </View>
                        <View style={styles.overviewRowSec}>
                            <PaperButton labelStyle={styles.operationText} disabled={!withdrawCondition()}
                                         onPress={() => handleWithdrawButtonClicked()}>
                                Withdraw
                            </PaperButton>
                        </View>
                    </View>
                </Card>
                <Toast type={toastType} message={toastMessage} onDismiss={() => setToastMessage('')}/>
            </>
    );
}
