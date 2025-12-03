import otpGenerator from 'otp-generator'

export const codeOTP = () => {
    return otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    })
}