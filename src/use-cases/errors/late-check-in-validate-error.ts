export class LateCheckInValidateError extends Error {
  constructor() {
    super(
      'THe check-in can only be validated until 20 minutes of its creation.',
    )
  }
}
