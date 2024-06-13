class IsNotPippettoException extends Error {
    constructor() {
        super();
        this.message = "Pippetto is not Pippetto"
        this.name = this.constructor.name; // Set the name of the custom error class
        this.httpCode = 401;
        this.stack = (new Error()).stack; // Capture the stack trace
    }
}

class SavingException extends Error {
    constructor() {
        super();
        this.message = "Couldn't save into db"
        this.name = this.constructor.name; // Set the name of the custom error class
        this.httpCode = 500;
        this.stack = (new Error()).stack; // Capture the stack trace
    }
}

module.exports={
    IsNotPippettoException,
    SavingException
}