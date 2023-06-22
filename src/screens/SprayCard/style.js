import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    scrollContainer: {
        backgroundColor: '#fff',
    },
    tableHeader: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#007BFF",
        // borderTopEndRadius: 10,
        // borderTopStartRadius: 10,
        height: 40
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
        fontSize: 16,
    },
    columnRowTxt: {
        width: "25%",
        textAlign: "center",
        fontSize: 15,
    },
    columnRowStateTxt: {
        fontWeight: "bold",
        fontSize: 15,
    },
    columnRowState: {
        width: "25%",
        textAlign: "center",
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: "95%",
        padding: 10,
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
    completeHeadTxt: {
        width: "100%",
        textAlign: "center",
        color: '#808080',
        fontStyle: 'italic',
        fontSize: 12,
        marginBottom: 10,
    },
    completeRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    completeSubjectTxt: {
        fontSize: 15,
    },
    completeSubRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    completeSubSubjectTxt: {
        fontSize: 14,
        margin: 0
    },
    completeSubRowSec: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});