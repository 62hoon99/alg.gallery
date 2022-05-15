const res_form = {
    "SUCCESS": {
        "result": "SUCCESS",
        "data": null,
        "code": null,
        "errors": null
    },

    "FAIL": {
        "result": "FAIL",
        "data": null,
        "code": null,
        "errors": null
    }
};

const form = {
    success: () => {
        return res_form.SUCCESS;
    },
    fail: () => {
        return res_form.FAIL;
    }
};

module.exports = form;