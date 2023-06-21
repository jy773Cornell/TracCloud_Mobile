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
        width: "25%",
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
        width: "95%",
        padding: 20,
        margin: 20
    },
    detailsHeaderTxt: {
        width: "100%",
        textAlign: "center",
        color: '#007BFF',
        fontWeight: "bold",
        fontSize: 20,
        marginBottom: 10,
    },
    overviewSubheaderTxt: {
        width: "100%",
        textAlign: "center",
        color: '#808080',
        fontStyle: 'italic',
        fontSize: 12,
        marginTop: 10,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    detailsRowTxt: {
        textAlign: "center",
        fontSize: 15,
    },
    overviewRowSec: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contentRowSec: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    operationText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});