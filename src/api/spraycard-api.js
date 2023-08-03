import {getCSRFToken} from "./auth-api";

const root = "https://tracloud.azurewebsites.net"

const end_site_types = ["Row", "Hole Code#", "Section", "Block"]

export const getSprayData = async (uid, employerID) => {
    const requestOptions = {
        method: "GET",
        headers: {'Accept': 'application/json', "Content-Type": "application/json",},
    };

    const responses = await Promise.all([
        fetch(root + "/api/crop/list/get/" + "?uid=" + employerID, requestOptions),
        fetch(root + "/api/site/list/get/" + "?uid=" + employerID, requestOptions),
        fetch(root + "/api/chemical/list/get/" + "?uid=" + employerID, requestOptions),
        fetch(root + "/api/equipment/list/get/" + "?uid=" + employerID, requestOptions),
        fetch(root + "/api/operation/purchase/list/get/" + "?uid=" + employerID, requestOptions),
        fetch(root + "/api/operation/application/list/get/?" + "uid=" + employerID, requestOptions),
        fetch(root + "/api/crop/category/", requestOptions),
        fetch(root + "/api/operation/application/target/", requestOptions),
        fetch(root + "/api/operation/application/desicisionsupport/", requestOptions),
        fetch(root + "/api/unit/", requestOptions),
        fetch(root + "/api/crop/growthstage/", requestOptions),

        fetch(root + "/workflow/spraycard/assignees/get/?" + "uid=" + uid + "&employer_id=" + employerID, requestOptions),
    ]);

    const jsonDataPromises = responses.map((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    });

    const jsonData = await Promise.all(jsonDataPromises);

    const flatten = (data) => {
        let result = [];
        for (let i = 0; i < data.length; i++) {
            let obj = {};
            obj = {...data[i]};
            delete obj.children;
            result.push(obj);
            if (data[i].children) {
                result = result.concat(flatten(data[i].children));
            }
        }
        return result;
    }

    return {
        "record_data": {
            cropList: jsonData[0].data,
            siteList: jsonData[1].data,
            chemicalList: jsonData[2].data,
            equipmentList: jsonData[3].data,
            purchaseList: jsonData[4].data,
            sprayApplicationList: jsonData[5].data,
            cropCategory: jsonData[6].data,
            applicationTarget: jsonData[7].data,
            decisionSupport: jsonData[8].data,
            unit: jsonData[9].data,
            growthStage: jsonData[10].data,
            assigneeList: jsonData[11].data,
        }, "option_data": {
            chemicalOptions: jsonData[4].data.map(item => {
                const chemical = jsonData[2].data.find(chem => chem.chemid === item.chemical);
                return {
                    label: `${chemical.epa_reg_no} | ${chemical.trade_name} | \$${item.cost_per_unit} per ${chemical.unit} | ${item.pur_datetime}`,
                    unit: chemical.unit,
                    cost: item.cost_per_unit,
                    cost_per_unit: `\$${item.cost_per_unit} per ${chemical.unit}`,
                    id: item.prid,
                };
            }),
            decisionSupportOptions: jsonData[8].data.map(item => ({
                label: item.name, id: item.dsid
            })),
            cropOptions: jsonData[0].data.map(item => ({
                label: `${item.crop} (${item.variety})`, id: item.cid
            })),
            growthStageOptions: jsonData[10].data.map(item => ({
                label: `${item.name}`, crop_id: item.crop_id, id: item.cgsid
            })),
            targetOptions: jsonData[7].data.map(item => ({
                label: item.name, id: item.attid,
            })),
            siteOptions: flatten(jsonData[1].data).filter(item => end_site_types.includes(item.type)).map(item => {
                let site = item;
                let optionStr = site.name;
                const sid = site.sid;
                const cid = site.crop.cid;
                const ccid = site.crop.ccid;
                const crop = `${site.crop.crop} (${site.crop.variety})`;
                const area = site.size;
                const unit = site.size_unit;
                while (site.parent) {
                    site = flatten(jsonData[1].data).find(item => item.sid === site.parent)
                    optionStr = `${site.name} - ${optionStr}`;
                }
                return {id: sid, label: optionStr, cid: cid, ccid: ccid, crop: crop, area: area, unit: unit};
            }),
            equipmentOptions: jsonData[3].data.map(item => ({
                label: `${item.name}`, id: item.eid
            })),
            chemicalUnitOptions: jsonData[9].data.filter(item => item.usage === "chemical").map(item => ({
                label: item.name, id: item.unitid
            })),
            siteUnitOptions: jsonData[9].data.filter(item => item.usage === "site").map(item => ({
                label: item.name, id: item.unitid
            })),
            assigneeOptions: jsonData[11].data.map(item => ({
                label: `${item.user} (${item.first_name} ${item.last_name})`, type: item.type, id: item.uid
            })),
        }
    };
}

export const SprayCardListGet = async (uid) => {
    const requestOptions = {
        method: "GET",
        headers: {'Accept': 'application/json', "Content-Type": "application/json",},
    };

    return fetch(root + "/workflow/spraycard/list/get/" + "?uid=" + uid, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Response not OK.');
            }
        })
        .then((data) => data.data);
}

export const SprayCardContentGet = async (scpid) => {
    const requestOptions = {
        method: "GET",
        headers: {'Accept': 'application/json', "Content-Type": "application/json",},
    };

    return fetch(root + "/workflow/spraycard/content/get/" + "?scpid=" + scpid, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Response not OK.');
            }
        }).then((data) => data.data)
}

export const SprayCardReturn = async (spray_card_id, holder_id) => {
    const csrfResponse = await getCSRFToken();
    if (!csrfResponse.csrfToken) {
        return ({error: "csrfToken not found."})
    }

    const csrfToken = csrfResponse.csrfToken;
    const apiData = {"spray_card_id": spray_card_id, "holder_id": holder_id};
    console.log(apiData);
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(apiData),
    };
    return fetch(root + "/workflow/spraycard/return/", requestOptions)
        .then((response) => {
            if (response.ok) {
                return true;
            } else {
                throw new Error('Response not OK.');
            }
        })
}

export const SprayCardWithdraw = async (spray_card_id, owner_id) => {
    const csrfResponse = await getCSRFToken();
    if (!csrfResponse.csrfToken) {
        return ({error: "csrfToken not found"})
    }

    const csrfToken = csrfResponse.csrfToken;
    const apiData = {"spray_card_id": spray_card_id, "owner_id": owner_id};
    console.log(apiData);
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(apiData),
    };
    return fetch(root + "/workflow/spraycard/withdraw/", requestOptions)
        .then((response) => {
            if (response.ok) {
                return true;
            } else {
                throw new Error('Response not OK.');
            }
        })
}

export const SprayCardComplete = async (apiData) => {
    const csrfResponse = await getCSRFToken();
    if (!csrfResponse.csrfToken) {
        return ({error: "csrfToken not found"})
    }

    const csrfToken = csrfResponse.csrfToken;
    console.log(apiData);
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(apiData),
    };
    return fetch(root + "/workflow/spraycard/complete/", requestOptions)
        .then((response) => {
            if (response.ok) {
                return true;
            } else {
                console.log(response);
                throw new Error('Response not OK.');
            }
        })
}