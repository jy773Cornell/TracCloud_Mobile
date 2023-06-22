import React, {useContext, useEffect, useState} from 'react';
import {styles} from "./style";
import {Button, Keyboard, ScrollView} from "react-native";
import {Text} from "react-native-paper";
import {useNavigation, useRoute} from "@react-navigation/native";
import {View} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {TouchableOpacity} from "react-native";
import {Card} from "react-native-shadow-cards";
import {SprayCardComplete} from "../../api/spraycard-api";
import {TextInput} from "./TextInput";

const field_names = [
    "start_time", "finish_time",
    "total_amount", "amount_unit", "total_cost", "application_rate", "rate_unit",
    "equipment", "water_use", "water_unit",
    "average_temp", "wind_speed", "wind_direction",
]

export default function Complete() {
    const navigation = useNavigation();
    const route = useRoute();
    const {uid, sprayCardProcess, sprayCardContents, sprayData, sprayOptions,} = route.params;

    const [fieldValues, setFieldValues] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [startDatePicker, setStartDatePicker] = useState(false);
    const [finishDatePicker, setFinishDatePicker] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const [cropSiteInfo, setCropSiteInfo] = useState({});
    const [chemicalInfo, setChemicalInfo] = React.useState([]);
    const [totalSiteSize, setTotalSiteSize] = useState(0);

    const handleInputChange = (value, field, index = null) => {
        let fieldObj;
        if (index) {
            fieldObj = fieldValues[field] || {};
            fieldObj[index] = value;
        } else {
            fieldObj = value;
        }

        if (field === field_names[2]) {
            setFieldValues(prevValues => ({
                ...prevValues, [field]: fieldObj, [field_names[4]]: {
                    ...prevValues[field_names[4]],
                    [index]: (Number(chemicalInfo[index].cost) * Number(value)).toFixed(2),
                }, [field_names[5]]: {
                    ...prevValues[field_names[5]],
                    [index]: (Number(value) / totalSiteSize).toFixed(2),
                },
            }));
        } else {
            setFieldValues(prevValues => ({
                ...prevValues, [field]: fieldObj
            }));
        }

        console.log(fieldValues);
    };

    const updateCorpSiteInfo = () => {
        let newCropSiteInfo = {};
        sprayCardContents.map(item => {
            const crop = item.site.crop;
            if (!newCropSiteInfo[crop]) {
                newCropSiteInfo[crop] = [];
            }

            if (!newCropSiteInfo[crop].map(JSON.stringify).includes(JSON.stringify(item.site))) {
                newCropSiteInfo[crop].push(item.site);
            }
        })

        setCropSiteInfo(newCropSiteInfo);
    };

    const updateChemicalInfo = () => {
        const uniqueChemicalPurchases = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.chemical_purchase), item.chemical_purchase])).values()]
        setChemicalInfo(uniqueChemicalPurchases);
    };

    const updateTotalSiteSize = () => {
        const uniqueSize = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.site), item.site])).values()]
        let totalSize = 0;
        uniqueSize.map(item => {
            totalSize += item.size;
        })
        setTotalSiteSize(totalSize);
    };

    const reformatSubmitData = () => {
        const chemicalList = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.chemical_purchase), item.chemical_purchase])).values()]

        let submitData = {"spray_card_id": sprayCardProcess.scpid, "holder_id": uid, "data": {}};
        for (let i = 0; i < sprayCardContents.length; i++) {
            const record = sprayCardContents[i];
            const chemical_idx = chemicalList.map(JSON.stringify).indexOf(JSON.stringify(record.chemical_purchase));
            const total_amount = (Number(fieldValues[field_names[5]][chemical_idx]) * Number(record.site.size)).toFixed(2).toString();
            const total_cost = (Number(fieldValues[field_names[5]][chemical_idx]) * Number(record.site.size) * Number(record.chemical_purchase.cost)).toFixed(2).toString();
            const water_use = ((Number(fieldValues[field_names[8]]) / totalSiteSize) * Number(record.site.size)).toFixed(2).toString();

            const recordData = {
                "operator_id": uid,
                "start_time": fieldValues[field_names[0]],
                "finish_time": fieldValues[field_names[1]],
                "total_amount": total_amount,
                "amount_unit_id": sprayOptions["chemicalUnitOptions"].find(item => item.label === chemicalList[chemical_idx].unit).id,
                "total_cost": total_cost,
                "application_rate": fieldValues[field_names[5]][chemical_idx],
                "rate_unit_id": sprayOptions["chemicalUnitOptions"].find(item => item.label === chemicalList[chemical_idx].unit).id,
                "applied_area": record.site.size,
                "area_unit_id": sprayOptions["siteUnitOptions"].find(item => item.label === record.site.size_unit).id,
                "equipment": fieldValues[field_names[7]],
                "water_use": water_use,
                "water_unit_id": fieldValues[field_names[9]],
                "average_temp": fieldValues[field_names[10]],
                "wind_speed": fieldValues[field_names[11]],
                "wind_direction": fieldValues[field_names[12]],
            }

            submitData["data"][record.arid] = (recordData);
        }

        return submitData
    }

    const checkFields = () => {
        let valid = true;
        setFieldErrors(initialFieldErrors);
        const checkFieldNames = [field_names[2], field_names[7], field_names[8], field_names[9]];

        checkFieldNames.map(field => {
            if (field === field_names[2]) {
                Object.keys(fieldValues[field]).map(index => {
                    if (!fieldValues[field][index]) {
                        setFieldErrors(prevValues => ({
                            ...prevValues,
                            [field]: {
                                ...prevValues[field],
                                [index]: true
                            }
                        }));
                        valid = false;
                    }
                })
            } else {
                if (!fieldValues[field]) {
                    setFieldErrors(prevValues => ({
                        ...prevValues, [field]: true
                    }));
                    valid = false;
                }
            }
        })

        return valid;
    };

    const handleSubmitButtonClicked = async () => {
        if (checkFields()) {
            try {
                const response = await SprayCardComplete(reformatSubmitData());
                if (response) {
                    setToastMessage('Process completed successfully.');
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
        }
    };

    const formatDatetime = (datetime) => {
        let year = datetime.getFullYear();
        let month = (datetime.getMonth() + 1).toString().padStart(2, '0');
        let date = datetime.getDate().toString().padStart(2, '0');
        let hours = datetime.getHours().toString().padStart(2, '0');
        let minutes = datetime.getMinutes().toString().padStart(2, '0');
        let dateStr = `${year}-${month}-${date} ${hours}:${minutes}`;
        return dateStr;
    }

    const datetimeRender = () => {
        return (
            <>
                <View style={styles.completeRow}>
                    <Text style={[styles.completeSubjectTxt, {fontWeight: 'bold'}]}>Start Time: </Text>
                    <TouchableOpacity onPress={() => setStartDatePicker(true)} style={styles.button}>
                        <Text
                            style={[styles.completeSubjectTxt, {color: '#007BFF',}]}>
                            {fieldValues[field_names[0]] ? fieldValues[field_names[0]] : "Pick a datetime"}
                        </Text>
                    </TouchableOpacity>
                </View>
                <DateTimePickerModal
                    isVisible={startDatePicker}
                    mode="datetime"
                    onConfirm={(data) => {
                        handleInputChange(formatDatetime(data), field_names[0]);
                        setStartDatePicker(false);
                    }}
                    onCancel={() => setStartDatePicker(false)}
                />
                <View style={styles.completeRow}>
                    <Text style={[styles.completeSubjectTxt, {fontWeight: 'bold'}]}>Finish Time: </Text>
                    <TouchableOpacity onPress={() => setFinishDatePicker(true)} style={styles.button}>
                        <Text
                            style={[styles.completeSubjectTxt, {color: '#007BFF',}]}>
                            {fieldValues[field_names[1]] ? fieldValues[field_names[1]] : "Pick a datetime"}
                        </Text>
                    </TouchableOpacity>
                </View>
                <DateTimePickerModal
                    isVisible={finishDatePicker}
                    mode="datetime"
                    onConfirm={(data) => {
                        handleInputChange(formatDatetime(data), field_names[1]);
                        setFinishDatePicker(false);
                    }}
                    onCancel={() => setFinishDatePicker(false)}
                />
            </>
        )
    }

    const chemicalRender = () => {
        return (
            <>
                {Object.keys(chemicalInfo).map((index) => (
                    <React.Fragment key={index}>
                        <View style={styles.completeRow}>
                            <TextInput
                                label={"Amount for " + chemicalInfo[index].label.split(" | ")[1] + " (" + chemicalInfo[index].label.split(" | ")[0] + ")"}
                                returnKeyType="next"
                                value={fieldValues[field_names[2]][index]}
                                onChangeText={(text) => {
                                    const validDecimal = /^[0-9]*[.,]?[0-9]*$/;
                                    if (validDecimal.test(text)) {
                                        handleInputChange(text, field_names[2], index)
                                    }
                                }}
                                error={fieldErrors?.[field_names[2]]?.[index] || false}
                                errorText={fieldErrors?.[field_names[2]]?.[index] ? "This field is required" : ""}
                                endAdornment={chemicalInfo[index].unit}
                                autoCapitalize="none"
                                keyboardType="decimal-pad"
                            />
                        </View>
                        <View style={styles.completeSubRow}>
                            <Text style={[styles.completeSubSubjectTxt, {fontWeight: 'bold'}]}>Cost: $ </Text>
                            <Text style={[styles.completeSubSubjectTxt, {color: '#007BFF',}]}>
                                {fieldValues[field_names[4]]?.[index] || 0}
                            </Text>
                        </View>
                        <View style={styles.completeSubRow}>
                            <Text style={[styles.completeSubSubjectTxt, {fontWeight: 'bold'}]}>Rate: </Text>
                            <Text style={[styles.completeSubSubjectTxt, {color: '#007BFF',}]}>
                                {fieldValues[field_names[5]]?.[index] || 0}
                            </Text>
                            <Text style={styles.completeSubSubjectTxt}>
                                {" " + chemicalInfo[index].unit} / {(Object.values(cropSiteInfo)[0])[0].size_unit}
                            </Text>
                        </View>
                    </React.Fragment>
                ))}
            </>
        )
    }

    const otherRender = () => {
        return (
            <>
                <View style={styles.completeRow}>
                    <View style={[styles.completeSubRowSec, {marginRight: 5}]}>
                        <TextInput
                            label="Water Use"
                            returnKeyType="next"
                            value={fieldValues[field_names[8]]}
                            onChangeText={(text) => {
                                const validDecimal = /^[0-9]*[.,]?[0-9]*$/;
                                if (validDecimal.test(text)) {
                                    handleInputChange(text, field_names[8])
                                }
                            }}
                            error={fieldErrors?.[field_names[8]] || false}
                            errorText={fieldErrors?.[field_names[8]] ? "This field is required" : ""}
                            autoCapitalize="none"
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <View style={[styles.completeSubRowSec, {marginLeft: 5}]}>
                        <TextInput
                            label="Water Unit"
                            returnKeyType="next"
                            value={fieldValues[field_names[9]]}
                            list={[1, 2, 3]}
                            onChangeText={(text) => handleInputChange(text, field_names[9])}
                            error={fieldErrors?.[field_names[9]] || false}
                            errorText={fieldErrors?.[field_names[9]] ? "This field is required" : ""}
                            autoCapitalize="none"
                        />
                    </View>
                </View>
                <View style={styles.completeRow}>
                    <View style={[styles.completeSubRowSec, {marginRight: 5}]}>
                        <TextInput
                            label="Equipment"
                            returnKeyType="next"
                            value={fieldValues[field_names[7]]}
                            onChangeText={(text) => handleInputChange(text, field_names[7])}
                            error={fieldErrors?.[field_names[7]] || false}
                            errorText={fieldErrors?.[field_names[7]] ? "This field is required" : ""}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={[styles.completeSubRowSec, {marginLeft: 5}]}>
                        <TextInput
                            label="Temperature"
                            returnKeyType="next"
                            value={fieldValues[field_names[10]]}
                            onChangeText={(text) => {
                                const validDecimal = /^[0-9]*[.,]?[0-9]*$/;
                                if (validDecimal.test(text)) {
                                    handleInputChange(text, field_names[10])
                                }
                            }}
                            error={false}
                            errorText={""}
                            endAdornment="°F"
                            autoCapitalize="none"
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>
                <View style={styles.completeRow}>
                    <View style={[styles.completeSubRowSec, {marginRight: 5}]}>
                        <TextInput
                            label="Wind Speed"
                            returnKeyType="next"
                            value={fieldValues[field_names[11]]}
                            onChangeText={(text) => {
                                const validDecimal = /^[0-9]*[.,]?[0-9]*$/;
                                if (validDecimal.test(text)) {
                                    handleInputChange(text, field_names[11])
                                }
                            }}
                            error={false}
                            errorText={""}
                            endAdornment="mph"
                            autoCapitalize="none"
                            keyboardType="decimal-pad"
                        />
                    </View>
                    <View style={[styles.completeSubRowSec, {marginLeft: 5}]}>
                        <TextInput
                            label="Wind Direction"
                            returnKeyType="next"
                            value={fieldValues[field_names[12]]}
                            onChangeText={(text) => handleInputChange(text, field_names[12])}
                            error={false}
                            errorText={""}
                            autoCapitalize="none"
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>
            </>
        )
    }

    const initialValues = field_names.reduce((acc, cur) => {
        if ([field_names[0], field_names[1]].includes(cur)) {
            acc[cur] = null;
        } else if (cur === field_names[2]) {
            acc[cur] = {};
            const uniqueChemicalPurchases = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.chemical_purchase), item.chemical_purchase])).values()]
            for (let i = 0; i < uniqueChemicalPurchases.length; i++) {
                acc[cur][i] = "";
            }
        } else {
            acc[cur] = "";
        }
        return acc;
    }, {});

    const initialFieldErrors = field_names.reduce((acc, cur) => {
        if (cur === field_names[2]) {
            acc[cur] = {};
            const uniqueChemicalPurchases = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.chemical_purchase), item.chemical_purchase])).values()]
            for (let i = 0; i < uniqueChemicalPurchases.length; i++) {
                acc[cur][i] = false;
            }
        } else {
            acc[cur] = false;
        }
        return acc;
    }, {});

    useEffect(() => {
        setFieldValues(initialValues);
        setFieldErrors(initialFieldErrors);
        updateCorpSiteInfo();
        updateTotalSiteSize();
        updateChemicalInfo();
    }, []);

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            style={styles.scrollContainer}
        >
            <Card style={styles.card}>
                <Text style={styles.completeHeadTxt}>{sprayCardProcess.scpid}</Text>
                {datetimeRender()}
                {chemicalRender()}
                {otherRender()}
            </Card>
        </ScrollView>
    )
}