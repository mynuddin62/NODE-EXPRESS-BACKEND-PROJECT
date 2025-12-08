class CustomError extends Error {
  
    public statusCode: number; 
    public errors: string;

    constructor(message: string, statusCode: number, error: string) {
        super(message);
        this.errors = error;
        this.statusCode = statusCode;
  }
}

export default CustomError;