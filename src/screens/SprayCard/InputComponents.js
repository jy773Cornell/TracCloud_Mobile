import React, {useState} from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {TextInput as Input} from 'react-native-paper'
import {theme} from '../../core/theme'
import DropDown from 'react-native-paper-dropdown';
import PickerModal from 'react-native-picker-modal-view';
import {styles as sty} from "./style";

export function TextInput({errorText, description, endAdornment, ...props}) {
    return (
        <View style={styles.container}>
            <Input
                style={styles.input}
                selectionColor={theme.colors.primary}
                underlineColor="transparent"
                mode="outlined"
                right={<Input.Affix text={endAdornment}/>}
                {...props}
            />
            {description && !errorText ? (
                <Text style={styles.description}>{description}</Text>
            ) : null}
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
        </View>
    )
}

export function Dropdown({label, value, setValue, errorText, description, list, mode = 'outlined', ...props}) {
    const [showDropDown, setShowDropDown] = useState(false);

    return (
        <View style={styles.container}>
            <DropDown
                label={label}
                value={value}
                setValue={setValue}
                list={list}
                visible={showDropDown}
                showDropDown={() => setShowDropDown(true)}
                onDismiss={() => setShowDropDown(false)}
                mode={mode}
                inputProps={{style: styles.dropdown}}
                dropDownItemStyle={styles.dropdown}
                dropDownStyle={styles.dropdown}
                {...props}
            />
            {description && !errorText ? (
                <Text style={styles.description}>{description}</Text>
            ) : null}
            {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
        </View>
    );
}

export function PickerModel({label, value, setValue, list, error = false, ...props}) {
    return (
        <PickerModal
            renderSelectView={(disabled, selected, showModal) =>
                <TouchableOpacity disabled={disabled} onPress={showModal} style={styles.button}>
                    <Text
                        style={[sty.completeSubjectTxt, {color: error ? theme.colors.error : '#007BFF',}]}>
                        {value ? value.Name : label}
                    </Text>
                </TouchableOpacity>
            }
            onSelected={(item) => setValue(item)}
            items={list}
            sortingLanguage={'tr'}
            showToTopButton={true}
            selected={value}
            showAlphabeticalIndex={true}
            autoGenerateAlphabeticalIndex={true}
            searchPlaceholderText={'Search...'}
            onClosed={() => {
            }}
            onEndReached={() => {
            }}
            requireSelection={false}
            autoSort={false}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    input: {
        backgroundColor: "#fff",
    },
    description: {
        fontSize: 13,
        color: theme.colors.secondary,
    },
    error: {
        fontSize: 13,
        color: theme.colors.error,
    },
    dropdown: {
        backgroundColor: 'white'
    },
})