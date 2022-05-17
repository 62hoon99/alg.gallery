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
    },
    error: (err) => {
        const form = res_form.FAIL.errors = err;
        return form;
    }
};

module.exports = form;