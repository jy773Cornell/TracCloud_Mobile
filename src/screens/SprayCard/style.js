import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#37C2D0",
        // borderTopEndRadius: 10,
        // borderTopStartRadius: 10,
        height: 50
    },
    tableRow: {
        flexDirection: "row",
        height: 40,
        alignItems: "center",
    },
    columnHeader: {
        width: "20%",
        justifyContent: "center",
        alignItems: "center"
    },
    columnHeaderTxt: {
        color: "white",
        fontWeight: "bold",
    },
    columnRowTxt: {
        width: "25%",
        textAlign: "center",
    },
    columnRowStateTxt: {
        fontWeight: "bold",
        color: '#007BFF',
    },
    columnRowState: {
        width: "25%",
        textAlign: "center",
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: "90%",
        padding: 20,
        margin: 20
    },
    overviewHeaderTxt: {
        width: "100%",
        textAlign: "center",
        color: '#007BFF',
        fontWeight: "bold",
        fontSize: 20,
    },
    overviewSubheaderTxt: {
        width: "100%",
        textAlign: "center",
        color: '#808080',
        fontStyle: 'italic',
        fontSize: 12,
        marginTop: 10,
    },
    overviewRowTxt: {
        color: '#007BFF',
    },
});