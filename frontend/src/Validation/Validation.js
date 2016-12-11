/**
 * Created by jdraslar on 12/11/2016.
 */
import moment from "moment";

function checkNotEmpty(value, errorMessage) {
    if (!value) {
        return errorMessage;
    }
    return undefined;
}

function validateDates(dateFrom, dateTo, errors, name) {
    console.log("### in validateDates: ", dateFrom, dateTo);
    errors['from'] = undefined;
    errors['to'] = undefined;
    const faultyDateFormat = "Unfortunately, date is in wrong format.";
    if (dateFrom) {
        if (!moment(dateFrom).isValid()) {
            errors['from'] = faultyDateFormat;
        }
    } else {
        errors['from'] = "When shall your travel start?";
    }
    if (dateTo) {
        if (!moment(dateTo).isValid()) {
            errors['to'] = faultyDateFormat;
        }
    } else {
        errors['to'] = "When shall your travel end?";
    }
    console.log("### date validation: ", new Date(dateFrom).getTime() - new Date(dateTo).getTime());
    if ((new Date(dateFrom).getTime() - new Date(dateTo).getTime()) > 0) {
        errors[name] = "End date of your travel is ahead of start date!";
    }
    return errors;
}

function validate(name, value, otherValue) {
    console.log("### in validation: ", name, value);

    let errorMessage = undefined;
    switch (name) {
        case "city":
            errorMessage = checkNotEmpty(value, "City is a mandatory field, so buddies could find you.");
            break;
        case "text":
            errorMessage = checkNotEmpty(value, "Tell something about you to pontetial buddies!");
            break;
    }
    return errorMessage;
}

export default{
    validate,
    validateDates
}