/**
 * Created by jdraslar on 12/11/2016.
 */

function checkThis(){
    console.log("in check this.");
}

function checkNotEmpty(errorMessage){
    if(!value){
        return errorMessage;
    }
    return undefined;
}

function validate(name, value) {
    console.log("in validation: ", fieldName, value);

    let errorMessage = undefined;
    switch (name) {
        case "city":
            errorMessage = checkNotEmpty("Město je povinné pole, to abychom Vás mohli najít.");
            break;
        case "text":
            errorMessage = checkNotEmpty("Řekněte něco o sobě potencionálním buddíkům!");
            break;
        case "from":
            if (value) {
                if (moment(value).isValid()) {
                    errors[name] = undefined;
                    fields[name] = value;
                    this.setState({
                        errors: errors,
                        fields: fields
                    });
                } else {
                    errors[name] = "Datum je bohužel ve špatném formátu.";
                    this.setState({
                        errors: errors
                    });
                }
            } else {
                errors[name] = "Potřebujeme vědět, od kdy plánujete cestu.";
                this.setState({
                    errors: errors
                });
            }
            break;
        case "to":
            if (value) {
                if (moment(value).isValid()) {
                    errors[name] = undefined;
                    fields[name] = value;
                    this.setState({
                        errors: errors,
                        fields: fields
                    });
                } else {
                    errors[name] = "Datum je bohužel ve špatném formátu.";
                    this.setState({
                        errors: errors
                    });
                }
            } else {
                errors[name] = "Potřebujeme vědět, do kdy plánujete cestu.";
                this.setState({
                    errors: errors
                });
            }
            break;
        case "email":

            break;
    }
    return errorMessage;
}

export default{
    validate
}