import {getCSRFToken} from "./auth-api";

const root = "https://tracloud.azurewebsites.net"

export const getSprayData = async (uid) => {
    const requestOptions = {
        method: "GET",
        headers: {'Accept': 'application/json', "Content-Type": "application/json",},
    };

    const responses = await Promise.all([
        fetch(root + "/api/crop/list/get/" + "?uid=" + uid, requestOptions),
        fetch(root + "/api/site/list/get/" + "?uid=" + uid, requestOptions),
        fetch(root + "/api/chemical/list/get/" + "?uid=" + uid, requestOptions),
        fetch(root + "/api/equipment/list/get/" + "?uid=" + uid, requestOptions),
        fetch(root + "/api/operation/purchase/list/get/" + "?uid=" + uid, requestOptions),
        fetch(root + "/api/operation/application/list/get/?" + "uid=" + uid, requestOptions),
        fetch(root + "/api/crop/category/", requestOptions),
        fetch(root + "/api/operation/application/target/", requestOptions),
        fetch(root + "/api/operation/application/desicisionsupport/", requestOptions),
        fetch(root + "/api/unit/", requestOptions),

        fetch(root + "/workflow/usertree/subtree/get/?" + "uid=" + uid, requestOptions),
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

    const end_site_types = ["Row", "Hole Code#", "Section", "Block"]

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
            userSubTree: jsonData[10].data,
        },
        "option_data": {
            chemicalOptions: jsonData[4].data.map(item => {
                const chemical = jsonData[2].data.find(chem => chem.chemid === item.chemical);
                return {
                    label: `${chemical.epa_reg_no}  |  ${chemical.trade_name}  |  ${chemical.active_ingredient}  |  ${chemical.rei}  |  ${chemical.phi}  |  \$${item.cost_per_unit} per ${chemical.unit}  | ${item.pur_datetime}`,
                    unit: chemical.unit,
                    cost_per_unit: `\$${item.cost_per_unit} per ${chemical.unit}`,
                    id: item.prid,
                };
            }),
            decisionSupportOptions: jsonData[8].data.map(item => ({
                label: item.name, id: item.dsid
            })),
            cropOptions: jsonData[0].data.map(item => ({
                label: `${item.crop} (${item.variety}, ${item.growth_stage})`,
                id: item.cid
            })),
            targetOptions: jsonData[7].data.map(item => ({
                label: item.name, id: item.attid,
            })),
            siteOptions: flatten(jsonData[1].data).filter(item => end_site_types.includes(item.type)).map(item => {
                let site = item;
                let optionStr = site.name;
                const sid = site.sid;
                const cid = site.crop.cid;
                const crop = `${site.crop.crop} (${site.crop.variety}, ${site.crop.growth_stage})`
                while (site.parent) {
                    site = flatten(jsonData[1].data).find(item => item.sid === site.parent)
                    optionStr = `${site.name} - ${optionStr}`;
                }
                return {id: sid, label: optionStr, cid: cid, crop: crop};
            }),
            equipmentOptions: jsonData[3].data.map(item => ({
                label: `${item.name} (${item.owner}, ${item.code})`,
                id: item.eid
            })),
            chemicalUnitOptions: jsonData[9].data.filter(item => item.usage === "chemical").map(item => ({
                label: item.name, id: item.unitid
            })),
            siteUnitOptions: jsonData[9].data.filter(item => item.usage === "site").map(item => ({
                label: item.name, id: item.unitid
            }))
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
                throw new Error('Response not OK');
            }
        })
        .then((data) => data.data); // use another then to get the data
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
                throw new Error('Response not OK');
            }
        }).then((data) => data.data)
}

export const SprayCardReturn = async (spray_card_id, holder_id) => {
    const csrfResponse = await getCSRFToken();
    if (!csrfResponse.csrfToken) {
        return ({error: "csrfToken not found"})
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
                throw new Error('Response not OK');
            }
        })
}
