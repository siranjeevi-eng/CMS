class ExpressError extends Error {
    
    constructor( message: string, public statusCode: number) {
        super(message)
    }
}

module.exports = ExpressError;