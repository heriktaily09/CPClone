export default function isTokenExpired(tokenTimeStamp) {
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    return currentTimeStamp > tokenTimeStamp;
}