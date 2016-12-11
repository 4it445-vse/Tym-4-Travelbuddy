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
    const faultyDateFormat = "Datum je bohužel ve špatném formátu.";
    if (dateFrom) {
        if (!moment(dateFrom).isValid()) {
            errors['from'] = faultyDateFormat;
        }
    } else {
        errors['from'] = "Potřebujeme vědět, od kdy plánujete cestu.";
    }
    if (dateTo) {
        if (!moment(dateTo).isValid()) {
            errors['to'] = faultyDateFormat;
        }
    } else {
        errors['to'] = "Potřebujeme vědět, do kdy plánujete cestu.";
    }
    console.log("### date validation: ", new Date(dateFrom).getTime() - new Date(dateTo).getTime());
    if ((new Date(dateFrom).getTime() - new Date(dateTo).getTime()) > 0) {
        errors[name] = "Datum konce je dříve než datum začátku!";
    }
    return errors;
}

function validate(name, value, otherValue) {
    console.log("### in validation: ", name, value);

    let errorMessage = undefined;
    switch (name) {
        case "city":
            errorMessage = checkNotEmpty(value, "Město je povinné pole, to abychom Vás mohli najít.");
            break;
        case "text":
            errorMessage = checkNotEmpty(value, "Řekněte něco o sobě potencionálním buddíkům!");
            break;
    }
    return errorMessage;
}

export default{
    validate,
    validateDates
}