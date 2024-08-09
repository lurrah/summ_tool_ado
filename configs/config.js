const org = 'ucf';
const myHeaders = new Headers();

const base64token = Buffer.from(`:${process.env.pk}`).toString('base64');
myHeaders.append("Authorization", `Basic ${base64token}`);

const ado_options = {
    method: 'GET',
    headers: myHeaders
};

module.exports = { org }
