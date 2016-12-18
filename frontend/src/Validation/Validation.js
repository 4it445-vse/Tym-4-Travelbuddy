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

function validatePass(pass, pass_repeated, errors, name){
    switch(name){
        case "pass":
            var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            if (pass && pass.match(passw)) {
                errors.pass = undefined;
            } else{
                errors.pass = "The password has to be at least 8 characters long and has to contain capital letter, non-capital letter and number.";
            }
            break;
        case "pass_repeated":
            if (errors.pass === undefined) {
                if (pass_repeated === pass) {
                    errors.pass_repeated = undefined;
                } else {
                    errors.pass_repeated = "Entered passwords have to be identical.";
                }
            }
            break;
    }
    return errors;

}

function checkEmailValidity(value) {
    console.log("in checkEmailVaidity: ", value);
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return undefined;
    }else{
        return "Enter e-mail in a correct format (melon@collie.com).";
    }
}

function validate(name, value, otherValue) {
    console.log("### in validation: ", name, value);

    let errorMessage = undefined;
    let emptyTextMessage = "Tell something about you to pontetial buddies!";

    switch (name) {
        case "city":
            errorMessage = checkNotEmpty(value, "City is a mandatory field, so buddies could find you.");
            break;
        case "text":
            errorMessage = checkNotEmpty(value, emptyTextMessage);
            break;
        case "about_me":
            if (otherValue === true) {
                errorMessage = checkNotEmpty(value, emptyTextMessage);
            }
            break;
        case "agreed_with_conditions":
            if (value !== true) {
                errorMessage = "You have to accept the terms.";
            }
            break;
        case "email":
            errorMessage = checkEmailValidity(value);
            break;
        case "name":
            errorMessage = checkNotEmpty(value, "Enter your name please.");
            break;
        case "surname":
            errorMessage = checkNotEmpty(value, "Enter your surname please.");
            break;
    }
    return errorMessage;
}

export default{
    validate,
    validateDates,
    validatePass
}