export const authorizer = (event, ctx, cb) => {
    console.log(event);

    if (event.type !== 'TOKEN') return cb('Unauthorized');
    try {
        const token = event.authorizationToken;
        const encodedCreds = token.split(' ')[1];
        const plainCreds = Buffer.from(encodedCreds, 'base64')
            .toString('utf-8')
            .split(':');
        const userName = plainCreds[0];
        const password = plainCreds[1];
        console.log(`Username ${userName}; password ${password}`);
        const storedPassword = process.env[userName];
        const effect =
            !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';
        console.log(`stored password = ${storedPassword}`);

        const policy = generatePolicy(encodedCreds, event.methodArn, effect);
        console.log(effect, '\n', policy);

        return cb(null, policy);
    } catch (e) {
        return cb('Unauthorized');
    }
};
function generatePolicy(principalId, resource, effect = 'Deny') {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                }
            ]
        }
    };
}
