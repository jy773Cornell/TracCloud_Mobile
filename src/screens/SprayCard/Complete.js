import React, {useContext, useEffect, useState} from 'react';
import {styles} from "./style";
import {KeyboardAvoidingView, ScrollView} from "react-native";
import {Text} from "react-native-paper";
import {useNavigation, useRoute} from "@react-navigation/native";
import {View} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {TouchableOpacity} from "react-native";
import {Card} from "react-native-shadow-cards";
import {SprayCardComplete} from "../../api/spraycard-api";
import {TextInput, PickerModel} from "./InputComponents";
import Toast from "../../components/Toast";
import Button from './Button'
import {theme} from "../../core/theme";
import dayjs from "dayjs";

const field_names = [
    "start_time", "finish_time",
    "equipment", "amount_pesticide_per_tank",
    "average_temp", "wind_speed", "wind_direction",
]

const windDirections = [
    {label: 'North', id: 'North'},
    {label: 'Northeast', id: 'Northeast'},
    {label: 'East', id: 'East'},
    {label: 'Southeast', id: 'Southeast'},
    {label: 'South', id: 'South'},
    {label: 'Southwest', id: 'Southwest'},
    {label: 'West', id: 'West'},
    {label: 'Northwest', id: 'Northwest'}
];

export default function Complete() {
    const navigation = useNavigation();
    const route = useRoute();
    const {uid, sprayCardProcess, sprayCardContents, sprayData, sprayOptions,} = route.params;

    const [fieldValues, setFieldValues] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [startDatePicker, setStartDatePicker] = useState(false);
    const [finishDatePicker, setFinishDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const [cropSiteInfo, setCropSiteInfo] = useState({});
    const [chemicalInfo, setChemicalInfo] = React.useState([]);
    const [equipment, setEquipment] = useState("");
    const [windDirection, setWindDirection] = useState("");

    const handleInputChange = (value, field, index = null) => {
        let fieldObj;
        if (index) {
            fieldObj = fieldValues[field] || {};
            fieldObj[index] = value;
        } else {
            fieldObj = value;
        }

        setFieldValues(prevValues => ({
            ...prevValues, [field]: fieldObj
        }));
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

    const reformatSubmitData = () => {
        const chemicalList = [...new Map(sprayCardContents.map(item => [JSON.stringify(item.chemical_purchase), item.chemical_purchase])).values()]

        let submitData = {"spray_card_id": sprayCardProcess.scpid, "holder_id": uid, "data": {}};
        for (let i = 0; i < sprayCardContents.length; i++) {
            const record = sprayCardContents[i];
            const chemical_idx = chemicalList.map(JSON.stringify).indexOf(JSON.stringify(record.chemical_purchase));

            const recordData = {
                "applicator_id": uid,
                "start_datetime": fieldValues[field_names[0]],
                "finish_datetime": fieldValues[field_names[1]],
                "harvestable_date": addDaysToDate(fieldValues[field_names[1]], chemicalList[chemical_idx].phi),
                "equipment_id": fieldValues[field_names[2]],
                "amount_pesticide_per_tank": fieldValues[field_names[3]][chemical_idx],
                "average_temp": fieldValues[field_names[4]],
                "wind_speed": fieldValues[field_names[5]],
                "wind_direction": fieldValues[field_names[6]],
            }

            submitData["data"][record.arid] = (recordData);
        }

        return submitData
    }

    const addDaysToDate = (dateString, daysString) => {
        const initialDate = new Date(dateString);
        const days = parseFloat(daysString);
        let newDate;

        if (days === 0) {
            newDate = new Date(initialDate.getTime());
        } else {
            const millisecondsToAdd = (days + 1) * 24 * 60 * 60 * 1000;
            newDate = new Date(initialDate.getTime() + millisecondsToAdd);
        }

        return newDate.toISOString().slice(0, 10);
    }

    const checkFields = () => {
        let valid = true;
        setFieldErrors(initialFieldErrors);
        const checkFieldNames = [field_names[0], field_names[1], field_names[2],];

        checkFieldNames.map(field => {
            if (!fieldValues[field]) {
                setFieldErrors(prevValues => ({
                    ...prevValues, [field]: true
                }));
                valid = false;
            }
        })

        return valid;
    };

    const checkDateFields = () => {
        return (dayjs(fieldValues[field_names[1]]).isAfter(dayjs(fieldValues[field_names[0]])));
    }

    const handleSubmitButtonClicked = async () => {
        if (!checkDateFields()) {
            setToastMessage("Finish time must be later than start time.");
            setToastType('error');
            setFieldErrors(prevValues => ({
                ...prevValues,
                [field_names[0]]: true,
                [field_names[1]]: true,
            }));
            return;
        }

        if (checkFields()) {
            try {
                setLoading(true);
                const response = await SprayCardComplete(reformatSubmitData());
                setLoading(false);

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
        } else {
            setToastMessage('Incomplete fields. Please check again.');
            setToastType('error');
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
                            style={[styles.completeSubjectTxt, {color: fieldErrors?.[field_names[0]] ? theme.colors.error : '#007BFF',}]}>
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
                            style={[styles.completeSubjectTxt, {color: fieldErrors?.[field_names[1]] ? theme.colors.error : '#007BFF',}]}>
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

    const equipmentRender = () => {
        return (
            <View style={styles.completeRow}>
                <Text style={[styles.completeSubjectTxt, {fontWeight: 'bold'}]}>Equipment: </Text>
                <PickerModel
                    label={"Choose equipment"}
                    value={equipment}
                    setValue={setEquipment}
                    list={sprayOptions["equipmentOptions"].map(option => ({
                        Name: option.label,
                        Id: option.id
                    }))}
                    error={fieldErrors?.[field_names[2]]}
                />
            </View>
        )
    }

    const chemicalRender = () => {
        return (
            <>
                {Object.keys(chemicalInfo).map((index) => (
                    <React.Fragment key={index}>
                        <View style={styles.completeRow}>
                            <TextInput
                                label={"Amount Per Tank for " + chemicalInfo[index].label.split(" | ")[1]}
                                returnKeyType="done"
                                onChangeText={(text) => {
                                    const validDecimal = /^[0-9]*[.,]?[0-9]*$/;
                                    if (validDecimal.test(text)) {
                                        handleInputChange(text, field_names[3], index)
                                    }
                                }}
                                endAdornment={chemicalInfo[index].unit}
                                autoCapitalize="none"
                                keyboardType="decimal-pad"
                            />
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

                    <TextInput
                        label="Temperature"
                        returnKeyType="done"
                        value={fieldValues[field_names[4]]}
                        onChangeText={(text) => {
                            const validDecimal = /^[0-9]*[.,]?[0-9]*$/;
                            if (validDecimal.test(text)) {
                                handleInputChange(text, field_names[4])
                            }
                        }}
                        errorText={""}
                        endAdornment="°F"
                        autoCapitalize="none"
                        keyboardType="decimal-pad"
                    />
                </View>
                <View style={styles.completeRow}>
                    <TextInput
                        label="Wind Speed"
                        returnKeyType="done"
                        value={fieldValues[field_names[5]]}
                        onChangeText={(text) => {
                            const validDecimal = /^[0-9]*[.,]?[0-9]*$/;
                            if (validDecimal.test(text)) {
                                handleInputChange(text, field_names[5])
                            }
                        }}
                        errorText={""}
                        endAdornment="mph"
                        autoCapitalize="none"
                        keyboardType="decimal-pad"
                    />
                </View>
                <View style={styles.completeRow}>
                    <Text style={[styles.completeSubjectTxt, {fontWeight: 'bold'}]}>Wind Direction: </Text>
                    <PickerModel
                        label={"Choose a direction"}
                        value={windDirection}
                        setValue={setWindDirection}
                        list={windDirections.map(option => ({
                            Name: option.label,
                            Id: option.id
                        }))}
                    />
                </View>
            </>
        )
    }

    const submitButtonRender = () => {
        return (
            <View style={styles.completeRow}>
                <Button loading={loading} mode="contained" onPress={() => handleSubmitButtonClicked()}>
                    Submit
                </Button>
            </View>
        )
    }

    const initialValues = field_names.reduce((acc, cur) => {
        if ([field_names[0], field_names[1]].includes(cur)) {
            acc[cur] = dayjs().format('YYYY-MM-DD HH:mm');
        } else if (cur === field_names[3]) {
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
        acc[cur] = false;
        return acc;
    }, {});

    useEffect(() => {
        setFieldValues(initialValues);
        setFieldErrors(initialFieldErrors);
        updateCorpSiteInfo();
        updateChemicalInfo();
    }, []);

    useEffect(() => {
        handleInputChange(equipment?.Id ? equipment.Id : "", field_names[2])
    }, [equipment]);

    useEffect(() => {
        handleInputChange(windDirection?.Id ? windDirection.Id : "", field_names[6])
    }, [windDirection]);

    return (
        <>
            <KeyboardAvoidingView behavior="padding">
                <ScrollView
                    contentContainerStyle={styles.container}
                    style={styles.scrollContainer}
                >
                    <Card style={styles.card}>
                        <Text style={styles.completeHeadTxt}>{sprayCardProcess.scpid}</Text>
                        {datetimeRender()}
                        {equipmentRender()}
                        {chemicalRender()}
                        {otherRender()}
                        {submitButtonRender()}
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
            <Toast type={toastType} message={toastMessage} onDismiss={() => setToastMessage('')}/>
        </>
    )
}