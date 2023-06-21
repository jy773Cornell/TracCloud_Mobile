import React, {useContext, useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {Button as PaperButton} from 'react-native-paper'
import {Card} from 'react-native-shadow-cards';
import {styles} from "./style";
import {getSprayData, SprayCardReturn, SprayCardWithdraw} from "../../api/spraycard-api";
import Toast from "../../components/Toast";
import {useNavigation} from '@react-navigation/native';

export default function Operations({uid, sprayCardSelected}) {
    const navigation = useNavigation();

    const [sprayData, setSprayData] = React.useState({});
    const [sprayOptions, setSprayOption] = React.useState({});
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

    const handleAssignButtonClicked = () => {
        setToastMessage('Please go to Web for Assign operation.');
        setToastType('error');
    };

    const handleEditButtonClicked = () => {
        setToastMessage('Please go to Web for Edit operation.');
        setToastType('error');
    };

    const performReturnAction = async () => {
        try {
            const response = await SprayCardReturn(sprayCardSelected.scpid, uid);
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
            const response = await SprayCardWithdraw(sprayCardSelected.scpid, uid);
            if (response) {
                setToastMessage('Process withdrew successfully.');
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

    const fetchUserData = async () => {
        try {
            const response = await getSprayData(uid);
            setSprayData(response.record_data);
            setSprayOption(response.option_data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])

    return (
        ["completed", "withdrew"].includes(sprayCardSelected?.state) ? null :
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
                                         onPress={() => handleEditButtonClicked()}>
                                Edit
                            </PaperButton>
                        </View>
                        <View style={styles.overviewRowSec}>
                            <PaperButton labelStyle={styles.operationText} disabled={!withdrawCondition()}
                                         onPress={() => {
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
                                         }}>
                                Withdraw
                            </PaperButton>
                        </View>
                    </View>
                </Card>
                <Toast type={toastType} message={toastMessage} onDismiss={() => setToastMessage('')}/>
            </>
    );
}
