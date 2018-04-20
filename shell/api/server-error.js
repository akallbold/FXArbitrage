class ServerError extends Error {
  constructor ({ message, fileName, lineNumber, ...args }) {
    super(message, fileName, lineNumber)
    Object.keys(args).forEach(prop => { this[prop] = args[prop] })
    this.name = 'ServerError'
    if (Error.captureStackTrace) Error.captureStackTrace(this, ServerError)
  }
}

export default ServerError
